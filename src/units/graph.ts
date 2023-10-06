/**
 * @file graph.ts
 * Graph client aspect implementation class
 */

import { System, Unit } from "../system/system";
import { NodeData, ConnectionData } from "../socket";
import { Mat4, Vec3 } from "../system/linmath";
import { URI } from "../socket";
import { Model, Topology } from "../system/render_resources";

/* Node implementation class */
export class Node implements Unit {
  private manager: GraphManager;
  private transform: Mat4;

  unitType: string = "Node";
  doSuicide: boolean;

  data: NodeData;
  uri: URI;

  /**
   * Node create function
   * @param system System to create node in
   * @param manager Manager to create node for
   * @param data Node data
   * @returns Created node
   */
  static create(system: System, manager: GraphManager, data: NodeData): Node {
    let node = new Node();

    node.manager = manager;
    node.data = data;
    node.transform = Mat4.translate(data.position);

    return node;
  } /* create */

  /**
   * Node transformation matrix update function
   */
  updateTrasnform() {
    this.transform = Mat4.translate(this.data.position);
  } /* updateTrasnform */

  /**
   * Node response function
   * @param system System this node is responsed in
   */
  response(system: System): void {
    system.drawModel(this.manager.nodeModel, this.transform);
  } /* response */
} /* Node */

/**
 * In-graph connection between nodes implementation class
 */
export class Connection implements Unit {
  private manager: GraphManager;
  private transform: Mat4;

  unitType: string = "Connection";
  doSuicide: boolean;

  data: ConnectionData;
  uri: URI;

  /**
   * Connection create function
   * @param system System this connection is created in
   * @param manager Manager this connection is created for
   * @param data Connection data
   * @returns Created connection
   */
  static create(system: System, manager: GraphManager, data: ConnectionData): Connection {
    let connection = new Connection();

    connection.manager = manager;
    connection.data = data;

    connection.updateTransform();

    return connection;
  } /* create */

  /**
   * Update transformation matrices of this connection
   */
  updateTransform() {
    let
      firstPos = this.manager.getNode(this.data.first).data.position,
      secondPos = this.manager.getNode(this.data.second).data.position;
    let dir = secondPos.sub(firstPos);
    let len = dir.length();
    dir = dir.mulNum(1 / len);
    let elevation = Math.acos(dir.y);

    this.transform = Mat4.identity()
      .mul(Mat4.scaleNum(1, len, 1))
      .mul(Mat4.rotate(elevation, new Vec3(-dir.z, 0, dir.x)))
      .mul(Mat4.translate(firstPos))
    ;
  } /* updateTransform */

  /**
   * Connection response function
   * @param system System this node is responsed in
   */
  response(system: System): void {
    system.drawModel(this.manager.connectionModel, this.transform);
  } /* response */
} /* Connection */

/* Graph manager class */
export class GraphManager {
  private system: System;
  private nodes: Map<string, Node> = new Map<string, Node>();
  private connections: Map<string, Connection> = new Map<string, Connection>();

  // Models for node and connection
  nodeModel: Model;
  connectionModel: Model;

  /**
   * Graph manager create function
   * @param system System to create graph manager to
   * @returns Promise of graph manager.
   */
  static async create(system: System): Promise<GraphManager> {
    let manager = new GraphManager();
    manager.system = system;

    let nodeMaterial = await system.createMaterial("bin/shaders/editor/node");
    manager.nodeModel = system.createModelFromTopology(Topology.sphere(0.5), nodeMaterial);

    let connectionMaterial = await system.createMaterial("bin/shaders/editor/connection");
    manager.connectionModel = system.createModelFromTopology(Topology.cylinder(0.2), connectionMaterial);

    return manager;
  } /* create */

  /**
   * New node to graph add function
   * @param data Data of node to add
   * @returns Promise of new node unit
   */
  async addNode(data: NodeData): Promise<Node> {
    let unit = await this.system.createUnit(Node.create, this, data) as Node;
    this.nodes.set(data.uri.toStr(), unit);

    return unit;
  } /* addNode */
  
  /**
   * Connection to graph adding function
   * @param data Data of connection
   * @returns Promise of new connection in graph
   */
  async addConnection(data: ConnectionData): Promise<Connection> {
    let unit = await this.system.createUnit(Connection.create, this, data) as Connection;
    this.connections.set(`${data.first.toStr()} - ${data.second.toStr()}`, unit);

    return unit;
  } /* addConnection */

  /**
   * Transform matrices of connections update function (should be called then node position is updated)
   */
  updateConnectionsTransforms() {
    this.connections.forEach((connection) => {
      connection.updateTransform();
    });
  } /* updateConnectionsTransforms */

  /**
   * All connections with certain node transforms update function
   * @param node Node to update transforms of connected with
   */
  updateNodeConnectionsTransforms(node: Node) {
    this.connections.forEach((connection) => {
      if (connection.data.first.toStr() === node.data.uri.toStr() || connection.data.second.toStr() === node.data.uri.toStr()) {
        connection.updateTransform();
      }
    });
  } /* updateNodeConnectionsTransforms */

  /**
   * Node with certain URI getting function
   * @param uri URI to get node with
   * @returns Node if it exists
   */
  getNode(uri: URI): Node | undefined {
    return this.nodes.get(uri.toStr());
  } /* getNode */

  /**
   * Node delete function
   * @param node Node to delete from graph
   * @returns true if deleted, false otherwise
   */
  delNode(node: Node): boolean {
    let nodeKey = node.data.uri.toStr();
    let value = this.nodes.get(nodeKey);

    if (value !== undefined) {
      value.doSuicide = true;
      this.nodes.delete(nodeKey);

      // delete connections
      let deletedNodeKeys = [];

      this.connections.forEach((connection, key) => {
        if (connection.data.first === node.data.uri || connection.data.second === node.data.uri) {
          connection.doSuicide = true;
          deletedNodeKeys.push(key);
        }
      });
      for (let key of deletedNodeKeys)
        this.connections.delete(key);

      return true;
    }

    return false;
  } /* delNode */

  /**
   * Connection delete function
   * @param connection Connection to delete
   * @returns true if deleted, false otherwise
   */
  delConnection(connection: Connection): boolean {
    let connectionKey = `${connection.data.first.toStr()} - ${connection.data.second.toStr()}`;
    let value = this.connections.get(connectionKey);

    if (value !== undefined) {
      value.doSuicide = true;
      this.connections.delete(connectionKey);
      return true;
    }

    return false;
  } /* delConnection */
} /* ConnectionManager */

/* graph.ts */