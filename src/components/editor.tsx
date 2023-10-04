import React from "react";
import { URI } from "../socket";
import { queryToStr } from "./support";
import { MinimapEditor } from "./minimap_editor";
import { Overlay } from "./overlay";
import { System, Unit } from "../system/system";
import { Topology, Material, Model, UniformBuffer } from "../system/render_resources";
import { Skysphere } from "../units/skysphere";
import { BaseConstruction } from "../units/base_construction";
import * as CameraController from "../units/camera_controller";
import * as LinMath from '../system/linmath';
import { MapEdit } from "../map_edit";
import { MapConfig } from "../../server/map_config";
import { NodeData, ConnectionData } from "../socket";
import { ConnectionCheckOutFailedEvent } from "mongodb";
import { ProjectManager } from "./project_manager";

class Node implements Unit {
  private manager: GraphManager;
  private transform: LinMath.Mat4;

  unitType: string = "Node";
  doSuicide: boolean;

  data: NodeData;
  uri: URI;


  static create(system: System, manager: GraphManager, data: NodeData): Node {
    let node = new Node();

    node.manager = manager;
    node.data = data;
    node.transform = LinMath.Mat4.translate(data.position);

    return node;
  } /* create */

  /**
   * Node transformation matrix update function
   */
  updateTrasnform() {
    this.transform = LinMath.Mat4.translate(this.data.position);
  } /* updateTrasnform */

  response(system: System): void {
    system.drawModel(this.manager.nodeModel, this.transform);
  } /* response */
} /* Node */

class Connection implements Unit {
  private manager: GraphManager;
  private transform: LinMath.Mat4;

  unitType: string = "Connection";
  doSuicide: boolean;

  data: ConnectionData;
  uri: URI;

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

    this.transform = LinMath.Mat4.identity()
      .mul(LinMath.Mat4.scaleNum(1, len, 1))
      .mul(LinMath.Mat4.rotate(elevation, new LinMath.Vec3(-dir.z, 0, dir.x)))
      .mul(LinMath.Mat4.translate(firstPos))
    ;
  } /* updateTransform */

  response(system: System): void {
    system.drawModel(this.manager.connectionModel, this.transform);
  } /* response */
} /* Connection */

class GraphManager implements Unit {
  unitType: string = "ConnectionManager";
  doSuicide: boolean;

  private system: System;
  private nodes: Map<string, Node> = new Map<string, Node>();
  private connections: Map<string, Connection> = new Map<string, Connection>();

  nodeModel: Model;
  connectionModel: Model;

  static async create(system: System): Promise<GraphManager> {
    let manager = new GraphManager();
    manager.system = system;

    let nodeMaterial = await system.createMaterial("bin/shaders/editor/node");
    manager.nodeModel = system.createModelFromTopology(Topology.sphere(0.5), nodeMaterial);

    let connectionMaterial = await system.createMaterial("bin/shaders/editor/connection");
    manager.connectionModel = system.createModelFromTopology(Topology.cylinder(0.2), connectionMaterial);

    return manager;
  } /* create */

  async addNode(data: NodeData): Promise<Node> {
    let unit = await this.system.createUnit(Node.create, this, data) as Node;
    this.nodes.set(data.uri.toStr(), unit);

    return unit;
  } /* addNode */
  
  async addConnection(data: ConnectionData): Promise<Connection> {
    let unit = await this.system.createUnit(Connection.create, this, data) as Connection;
    this.connections.set(`${data.first.toStr()} - ${data.second.toStr()}`, unit);

    return unit;
  } /* addConnection */

  getNode(uri: URI): Node | undefined {
    return this.nodes.get(uri.toStr());
  } /* getNode */

  delNode(node: Node): boolean {
    let nodeKey = node.data.uri.toStr();
    let value = this.nodes.get(nodeKey);

    if (value !== undefined) {
      value.doSuicide = true;
      this.nodes.delete(nodeKey);
      return true;
    }
    return false;
  } /* delNode */

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

  /**
   * Unit response function
   * @param system System this unit is responsed by
   */
  response(system: System): void {

  } /* response */
} /* ConnectionManager */

interface DisplayedNodeData {
  uri: URI,
  name: string,
  skysphere: {path: string, rotation: number},
  floor: number,
};

interface NodeSettingsProps {
  data: DisplayedNodeData;
  onMakeDefaultCallBack: ()=>void,
  onDeleteNodeCallBack: ()=>void,
  onSave: ( newData: DisplayedNodeData )=>void,
  onClose: ()=>void,
} /* NodeSettingsProps */

interface NodeSettingsState {
  nameRef: React.MutableRefObject<any>;
  skysphereRef: React.MutableRefObject<any>;
  floorRef: React.MutableRefObject<any>;
} /* NodeSettingsState */




class NodeSettings extends React.Component<NodeSettingsProps, NodeSettingsState> {
  constructor( props: NodeSettingsProps ) {
    super(props);
    this.state = {
      nameRef: React.createRef(),
      floorRef: React.createRef(),
      skysphereRef: React.createRef(),
    };
  } /* constructor */

  render() {
    return (<>
      <div className="flexRow spaceBetween">
        <h2> Node settings</h2>
        <div>
          <input type="button" value="Save" onClick={()=>{
            this.props.onSave({
              uri: this.props.data.uri,
              name: this.state.nameRef.current.value,
              skysphere: this.state.skysphereRef.current.value,
              floor: this.state.floorRef.current.value,
            });
            this.props.onClose();
          }}/>
          <input type="button" value="Cancel" onClick={this.props.onClose}/>
        </div>
      </div>
      <div className="flexRow spaceBetween">
        <p>URI:</p>
        <p>{this.props.data.uri.toStr()}</p>
      </div>
      <div className="flexRow spaceBetween">
        <p>Name:</p>
        <input ref={this.state.nameRef} type="text" placeholder="Node name" />
      </div>
      <div className="flexRow spaceBetween">
        <p>Skysphere:</p>
        <input ref={this.state.skysphereRef} type="text" placeholder="Skysphere name" />
      </div>
      <div className="flexRow spaceBetween">
        <p>Floor:</p>
        <input ref={this.state.floorRef} type="range" min={-1} max={4}/>
      </div>
      <input type="button" value="Make default" onClick={this.props.onMakeDefaultCallBack}/>
      <input type="button" value="Delete node" onClick={this.props.onDeleteNodeCallBack}/>
    </>);
  }

  componentDidMount(): void {
    this.state.nameRef.current.value = this.props.data.name;
    this.state.skysphereRef.current.value = this.props.data.skysphere;
    this.state.floorRef.current.value = this.props.data.floor;
  }
} /* NodeSettings */

interface EditorProps {
  socket: MapEdit;
}

interface EditorState {
  canvasRef: React.MutableRefObject<any>;
  floorRef: React.MutableRefObject<any>;
  floorNumberRef: React.MutableRefObject<any>;
  menuJSX: JSX.Element;
  nodeSettingsRef: React.MutableRefObject<any>;
  showNodeSettings: boolean;
  showMinimapSettings: boolean;
  showProjectManager: boolean;
  logListRef: React.MutableRefObject<Overlay>;
}

interface QueryData {
  key?: string;
  map?: string;
}

/**
 * Editor class
 */
export class Editor extends React.Component<EditorProps, EditorState> implements Unit {
  system: System = null;
  graph: GraphManager;
  curQuery: QueryData = {};

  unitType: string = "EditorUnit";
  skysphere: Skysphere;
  baseConstruction: BaseConstruction;
  doSuicide: boolean;

  response(system: System): void {
  
  } /* response */

  asyncSetState( newState: any ) {
    return new Promise<void>((resolve) => {
        this.setState(newState, ()=>{
          resolve();
        });
      });
  } /* asyncSetState */

  getQuery(): QueryData {
    const urlParams = new URLSearchParams(window.location.search);
    var out = {};
    urlParams.forEach((value, name)=>{
      out = {
        ...out,
        [name]: value,
      }
    });
 
    return out as QueryData;
  } /* getQuery */

  updateQuery() {
    history.pushState(this.curQuery, "", '?' + queryToStr(this.curQuery));
  } /* updateQuery */
  
  constructor( props: EditorProps ) {
    super(props);
    this.state = {
      canvasRef: React.createRef(),
      floorRef: React.createRef(),
      floorNumberRef: React.createRef(),
      nodeSettingsRef: React.createRef(),
      logListRef: React.createRef(),
      menuJSX: (<></>),
      showNodeSettings: true,
      showMinimapSettings: false,
      showProjectManager: false,
    };
    window.addEventListener("resize", () => {
      this.system.resize(this.state.canvasRef.current.clientWidth, this.state.canvasRef.current.clientHeight);
    });
    this.curQuery = this.getQuery();
  } /* End of 'cosntructor' function */

  render() {
    return (
      <>
        <div style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          background: '#05243f'
        }}>
          <canvas ref={this.state.canvasRef} style={{width: '100%', height: '100%'}} onContextMenu={(event) => { event.preventDefault(); }}/>
        </div>
        <div className="box" style={{
          zIndex: 3,
          position: 'absolute',
          width: '22em',
        }}>
          {this.state.showNodeSettings && <NodeSettings ref={this.state.nodeSettingsRef} data={{floor: 0, name: 'nodename', skysphere: {rotation: 0, path: 'nodsjysphere'}, uri: new URI('[0, 0, 0, 0, 0, 0, 0, 0]')}}
          onDeleteNodeCallBack={()=>{}} onClose={()=>{}} onMakeDefaultCallBack={()=>{}} onSave={()=>{}}/>}
        </div>
        <div className="box" style={{
          zIndex: 3,
          position: 'relative',
          float: 'right',
          //width: '20em'
        }}>
          <h2>Menu</h2>
          {this.state.menuJSX}
        </div>
        {this.state.showMinimapSettings && <div style={{
          zIndex: 4,
          position: 'absolute',
          backgroundColor: 'var(--shadow2-color)',

          right: 0,
          top: 0,
          left: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <MinimapEditor socket={this.props.socket} logListRef={this.state.logListRef.current} closeCallBack={()=>{
            this.setState({ showMinimapSettings: false });
          }}/>
        </div>}
        {this.state.showProjectManager && <div style={{
          zIndex: 4,
          position: 'absolute',
          backgroundColor: 'var(--shadow2-color)',

          right: 0,
          top: 0,
          left: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ProjectManager socket={this.props.socket} logListRef={this.state.logListRef.current} closeCallBack={()=>{
            this.setState({ showProjectManager: false });
          }} goToMapCallBack={(m)=>{
            this.curQuery.map = m;
            this.updateQuery();
            location.reload();
          }}/>
        </div>}
        <Overlay ref={this.state.logListRef}/>
      </>
    );
  } /* End of 'render' function */

  async componentDidMount() {
    // system initialization
    this.system = await System.create(this.state.canvasRef.current);
    this.system.resize(this.state.canvasRef.current.clientWidth, this.state.canvasRef.current.clientHeight);

    this.skysphere = await this.system.createUnit(Skysphere.create, "bin/imgs/default.png") as Skysphere;
    this.baseConstruction = await this.system.createUnit(BaseConstruction.create, this.props.socket.getStoragePath("models/map.obj")) as BaseConstruction;
    this.graph = await this.system.createUnit(GraphManager.create) as GraphManager;
    this.system.createUnit(CameraController.Arcball.create);

    this.system.addUnit(this);
    this.system.runMainLoop();

    // Get context
    const allMaps = (await this.props.socket.socket.send('getAllMapsReq')) as string[];
    const query = this.getQuery();

    this.baseConstruction.topFloor = this.props.socket.mapConfig.minimapInfo.firstFloor + this.props.socket.mapConfig.minimapInfo.floorCount - 1;
    
    this.asyncSetState({
      menuJSX: (<>
        <input type="button" value="Go to viewer" onClick={()=>{
          window.location.href = "./viewer.html" + window.location.search;
        }}/>
        <input type="button" value="Go to server" onClick={()=>{
            window.location.href = "./server.html" + window.location.search;
        }}/><br/>
        {allMaps.length > 0 && <>
          <h2> Other maps:</h2>
          <div style={{
            display: 'flex',
            flexDirection: 'row-reverse'
          }}>
            {allMaps.map((m)=>{
              if (m == this.props.socket.mapConfig.name)
                return (<></>);

              return (<><input type="button" value={m} onClick={()=>{
                if (query.map != undefined)
                this.curQuery.map = m;
                this.updateQuery();
                location.reload();
              }}/><br/></>);
            })}
          </div></>}
        {this.props.socket.mapConfig.minimapInfo.floorCount > 1 &&
        <div className="flexRow spaceBetween">
          Visible floors:
          <div className="flexRow">
            <input ref={this.state.floorRef} type="range" min={this.props.socket.mapConfig.minimapInfo.firstFloor} max={this.props.socket.mapConfig.minimapInfo.firstFloor + this.props.socket.mapConfig.minimapInfo.floorCount} onChange={(e)=>{
              this.state.floorNumberRef.current.innerText = e.target.value;
              this.baseConstruction.topFloor = parseInt(e.target.value);
            }} style={{ width: this.props.socket.mapConfig.minimapInfo.floorCount * 2 + 'em' }}/>
            <div ref={this.state.floorNumberRef} style={{width: '1em'}}>{this.baseConstruction.topFloor}</div>
          </div>
        </div>}
        <input type="button" value="Minimap settings" onClick={()=>{
          this.setState({ showMinimapSettings: true });
        }}/>
        <input type="button" value="Show project manager" onClick={()=>{
          this.setState({ showProjectManager: true });
        }}/>
      </>)
    });

    // Order guaranted
    let nodeURIs = await this.props.socket.getAllNodes();
    let nodeDatas = await this.props.socket.getAllNodesData();

    for (let i = 0, len = nodeURIs.length; i < len; i++) {
      let data = nodeDatas[i];
      let uri = nodeURIs[i];

      this.graph.addNode({
        uri: uri,
        name: data.name,
        skysphere: data.skysphere,
        position: LinMath.Vec3.fromObject(data.position),
        floor: data.floor,
      });
    }

    // Add connections
    let connections = await this.props.socket.getAllConnections();
    for (let connection of connections)
      this.graph.addConnection(connection);
  } /* componentDidMount */
} /* End of 'Viewer' class */

