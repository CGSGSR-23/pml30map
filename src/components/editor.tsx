import React, { InputHTMLAttributes } from "react";
import { URI } from "../socket";
import { queryToStr } from "./support";
import { MinimapEditor } from "./minimap_editor";
import { MessageType, Overlay } from "./overlay";
import { System, Unit } from "../system/system";
import { Topology, Material, Model, UniformBuffer } from "../system/render_resources";
import { Skysphere } from "../units/skysphere";
import { BaseConstruction } from "../units/base_construction";
import * as CameraController from "../units/camera_controller";
import * as LinMath from '../system/linmath';
import { MapEdit } from "../map_edit";
import { NodeData, ConnectionData } from "../socket";
import { ProjectManager } from "./project_manager";
import { InputFile } from "./support";
import { uploadFile } from "./upload";
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


/* Manager of VISUAL PART OF graph */
class GraphManager {
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
} /* ConnectionManager */

enum NodeSelectorMode {
  SELECT,
  CONNECT,
}

class NodeSelector implements Unit {
  private arrow: Model;
  doSuicide: boolean;
  unitType: string = "NodeSelector";
  selectedNode: Node | null = null;
  mode: NodeSelectorMode = NodeSelectorMode.SELECT;

  static async create(system: System, editor: Editor): Promise<NodeSelector> {
    let selector = new NodeSelector();

    let material = await system.createMaterial("bin/shaders/editor/selectedMark");
    material.resources.push(await system.createTextureFromURL("bin/imgs/arrow.png"));
    selector.arrow = system.createModelFromTopology(Topology.cone(0.5, 0.0), material);

    system.canvas.addEventListener('click', (event: PointerEvent) => {
      let unknownUnit = system.getScreenUnit(event.clientX, event.clientY);

      if (unknownUnit === null || unknownUnit.unitType !== "Node")
        return;

      let node = unknownUnit as Node;

      // Handle connection mode
      if (selector.mode === NodeSelectorMode.CONNECT && selector.selectedNode.doSuicide !== true) {
        console.log('connect: ', selector.selectedNode, node);
        editor.props.socket.connectNodes(selector.selectedNode.data.uri, node.data.uri);
        let newConnectionData: ConnectionData = {
          uri: null,
          first: selector.selectedNode.data.uri,
          second: node.data.uri,
        };
        editor.graphManager.addConnection(newConnectionData);
        selector.mode = NodeSelectorMode.SELECT;
        return;
      }

      selector.selectedNode = node;

      const onMakeDefault = () => {
        editor.props.socket.setDefNodeURI(node.data.uri);
        console.log(`new default node: ${node.data.name}`);
      };

      const onDelete = () => {
        editor.graphManager.delNode(node);
        editor.props.socket.delNode(node.data.uri);
        console.log(`deleted \'${node.data.name}\' node`);
      };

      const onConnectWith = () => {
        selector.mode = NodeSelectorMode.CONNECT;
      };

      const onDataUpdate = (type: string, value: any) => {
        if (type === 'Floor') {
          console.log(`${value} floor selected`);
          node.data.floor = value;
        } else if (type === 'SkysphereName') {
          console.log(`new skysphere name: ${value}`);
          node.data.skysphere.path = value;
        } else if (type === 'NodeName') {
          console.log(`${node.data.name} node renamed to \'${value}\'`);
          node.data.name = value;
        } else {
          console.error("unknown node data type");
          return;
        }

        editor.props.socket.updateNode(node.uri, node.data);
      };

      editor.state.nodeSettingsRef.current.selectNode(node.data, onDataUpdate, onMakeDefault, onDelete, onConnectWith);
    });

    return selector;
  } /* create */

  response(system: System): void {
    if (this.selectedNode !== null) {
      system.drawModel(this.arrow, LinMath.Mat4.translate(this.selectedNode.data.position.add(new LinMath.Vec3(0, 1 + Math.sin(system.timer.time) * 0.5, 0))));
    }
  } /* response */
} /* NodeSelector */

class ConnectionSelector implements Unit {
  doSuicide: boolean;
  unitType: string = "ConnectionSelector";
  selectedConnection: Connection | null = null;

  /**
   * Connection selector create function
   * @param system System to create selector in
   * @param editor Editor to create selector for
   * @returns New connection selector
   */
  static create(system: System, editor: Editor): ConnectionSelector {
    let selector = new ConnectionSelector();

    system.canvas.addEventListener('click', (event: PointerEvent) => {
      let unknownUnit = system.getScreenUnit(event.clientX, event.clientY);

      if (unknownUnit === null || unknownUnit.unitType !== "Connection")
        return;

      let connection = unknownUnit as Connection;
      selector.selectedConnection = connection;

      const onDelete = () => {
        editor.graphManager.delConnection(connection);
        editor.props.socket.disconnectNodes(connection.data.first, connection.data.second);
      };

      editor.state.nodeSettingsRef.current.selectConnection(connection.data, onDelete);
    });

    return selector;
  } /* create */

  /**
   * Connection selector class
   * @param system 
   */
  response(system: System): void {

  } /* response */
} /* ConnectionSelector */

interface DisplayedNodeData {
  uri: URI,
  name: string,
  skysphere: {path: string, rotation: number},
  floor: number,
}

type NodeSettingsUpdateCallback = (name: string, value: any) => void;
type NodeSettingsMakeDefaultCallback = () => void;
type NodeSettingsDeleteCallback = () => void;
type NodeSettingsConnectWithCallback = () => void;
type NodeSettingsConenctionDeleteCallback =  () => void;

interface NodeSettingsState {
  nameRef: React.MutableRefObject<any>;
  skysphereRef: React.MutableRefObject<any>;
  floorRef: React.MutableRefObject<any>;

  nodeData: NodeData;
  connectionData: ConnectionData;

  onValueUpdate: NodeSettingsUpdateCallback;
  onMakeDefault: NodeSettingsMakeDefaultCallback;
  onDelete: NodeSettingsDeleteCallback;
  onConnectWith: NodeSettingsConnectWithCallback;
  onConnectionDelete: NodeSettingsConenctionDeleteCallback;
} /* NodeSettingsState */

class NodeSettings extends React.Component<any, NodeSettingsState> {
  nodeNameChanged: boolean = false;
  skysphereNameChanged: boolean = false;

  constructor( props: any ) {
    super(props);
    let emptyURI = new URI([0, 0, 0, 0, 0, 0, 0, 0]);
    this.state = {
      // Smth
      nameRef: React.createRef(),
      floorRef: React.createRef(),
      skysphereRef: React.createRef(),

      nodeData: {
        uri: emptyURI,
        name: 'unknown',
        skysphere: { path: 'amogus', rotation: 0 },
        position: new LinMath.Vec3(0, 0, 0),
        floor: 0,
      },
      connectionData: {
        uri: emptyURI,
        first: emptyURI,
        second: emptyURI
      },

      // State functions
      onValueUpdate: () => {},
      onMakeDefault: () => {},
      onDelete: () => {},
      onConnectWith: () => {},
      onConnectionDelete: () => {},
   };
  } /* constructor */

  /**
   * Node selecting function
   * @param data Node to select data
   */
  selectNode(data: NodeData,
    valueUpdateCallback: NodeSettingsUpdateCallback,
    makeDefaultCallback: NodeSettingsMakeDefaultCallback,
    deleteCallback: NodeSettingsDeleteCallback,
    connectWithCallback: NodeSettingsConnectWithCallback,
  ): void {
    this.state.floorRef.current.value = data.floor;
    this.state.nameRef.current.value = data.name;
    this.state.skysphereRef.current.value = data.skysphere.path;
    this.setState({
      nodeData: data,
      onValueUpdate: valueUpdateCallback,
      onMakeDefault: makeDefaultCallback,
      onDelete: deleteCallback,
      onConnectWith: connectWithCallback,
    });
  } /* selectNode */

  selectConnection(data: ConnectionData, onDelete: NodeSettingsConenctionDeleteCallback) {
    this.setState({
      connectionData: data,
      onConnectionDelete: onDelete,
    });
  } /* selectConnection */

  render() {
    return (<>
      <h2> Node settings</h2>

      <div className="flexRow spaceBetween">
        <p>URI:</p>
        <p>{this.state.nodeData.uri.toStr()}</p>
      </div>

      {/* Node name block */}
      <div className="flexRow spaceBetween">
        <p>Name:</p>
        <input ref={this.state.nameRef} type="text" placeholder="Node name" onChange={() => {this.nodeNameChanged = true}} onBlur={(event) => {
          if (this.nodeNameChanged) {
            this.state.onValueUpdate("NodeName", event.target.value);
            this.nodeNameChanged = false;
          }
        }}/>
      </div>

      {/* Skysphere name block */}
      <div className="flexRow spaceBetween">
        <p>Skysphere:</p>
        <input ref={this.state.skysphereRef} type="text" placeholder="Skysphere name" onChange={() => {this.skysphereNameChanged = true}} onBlur={(event) => {
          if (this.skysphereNameChanged) {
            this.state.onValueUpdate("SkysphereName", event.target.value);
            this.skysphereNameChanged = false;
          }
        }}/>
      </div>

      {/* Floor block */}
      <div className="flexRow spaceBetween">
        <p>Floor:</p>
        <input ref={this.state.floorRef} type="range" min={-1} max={4} onChange={(event) => {
          this.state.onValueUpdate("Floor", event.target.value);
        }}/>
      </div>

      {/* MakeDefault and Delete button block */}
      <input type="button" value="Connect with other node" onClick={() => {this.state.onConnectWith()}}/>
      <input type="button" value="Make default" onClick={() => {this.state.onMakeDefault();}}/>
      <input type="button" value="Delete node" onClick={() => {this.state.onDelete()}}/>

      <h2>Connection settings</h2>
      <div className="flexRow spaceBetween">
        <p>URI:</p>
        <p>{`${this.state.connectionData.first.toStr()} - ${this.state.connectionData.second.toStr()}`}</p>
      </div>
      <input type="button" value="Delete connection" onClick={() => {this.state.onConnectionDelete()}}/>
    </>);
  }

  componentDidMount(): void {
    this.state.nameRef.current.value = this.state.nodeData.name;
    this.state.skysphereRef.current.value = this.state.nodeData.skysphere;
    this.state.floorRef.current.value = this.state.nodeData.floor;
  } /* componentDidMount */
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
  logListRef: React.MutableRefObject<Overlay>;
  showNodeSettings: boolean;
  showMinimapSettings: boolean;
  showProjectManager: boolean;
  showChangeModelBox: boolean;
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
  graphManager: GraphManager;
  curQuery: QueryData = {};
  nodeSelector: NodeSelector;
  connectionSelector: ConnectionSelector;
  
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
      showChangeModelBox: false,
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
          {this.state.showNodeSettings && <NodeSettings ref={this.state.nodeSettingsRef}/>}
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
        {this.state.showChangeModelBox && <div style={{
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
          <div className="box flexRow">
              Choose another model: <InputFile value="Model file" onLoadCallBack={async ( inputFileRef: InputFile )=>{
                const files = inputFileRef.getFiles();
                if (files.length <= 0)
                {
                  this.state.logListRef.current.log({ str: "No files selected", type: MessageType.warning });
                  return;
                }
                console.log('Uploading model file');
                await uploadFile(files[0], `maps/${this.props.socket.mapConfig.name}/models/`, 'map.obj');
                location.reload();
                this.setState({ showChangeModelBox: false });
              }}/><input type="button" value="Cancel" onClick={async ()=>{
                this.setState({ showChangeModelBox: false });  
              }}/>
            </div>
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

    this.graphManager = await GraphManager.create(this.system);

    this.nodeSelector = await this.system.createUnit(NodeSelector.create, this) as NodeSelector;
    this.connectionSelector = await this.system.createUnit(ConnectionSelector.create, this) as ConnectionSelector;

    this.system.createUnit(CameraController.Arcball.create);

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
        <input type="button" value="Change model" onClick={()=>{
          this.setState({ showChangeModelBox: true });
        }}/><br/>
        {this.props.socket.mapConfig.minimapInfo.floorCount > 1 && <>
        <div className="flexRow spaceBetween">
          Visible floors:
          <div className="flexRow">
            <input ref={this.state.floorRef} type="range" min={this.props.socket.mapConfig.minimapInfo.firstFloor} max={this.props.socket.mapConfig.minimapInfo.firstFloor + this.props.socket.mapConfig.minimapInfo.floorCount} onChange={(e)=>{
              this.state.floorNumberRef.current.innerText = e.target.value;
              this.baseConstruction.topFloor = parseInt(e.target.value);
            }} style={{ width: this.props.socket.mapConfig.minimapInfo.floorCount * 2 + 'em' }}/>
            <div ref={this.state.floorNumberRef} style={{width: '1em'}}>{this.baseConstruction.topFloor}</div>
          </div>
        </div><br/></>}
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

      this.graphManager.addNode({
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
      this.graphManager.addConnection(connection);
  } /* componentDidMount */
} /* End of 'Viewer' class */
