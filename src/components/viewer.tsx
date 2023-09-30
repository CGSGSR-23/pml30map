import { Minimap } from "./minimap";
import { MapConfig } from "../../server/map_config";
import { Vec2, Vec3, Mat4 } from "../system/linmath";
import React from "react";
//import { Connection } from "../socket";
import { URI, NodeData } from "../socket";
import { queryToStr, getQuery } from "./support";
import { System, Unit } from "../system/system";
import { MapView } from "../map_view";
import { Skysphere } from "../units/skysphere";
import * as CameraController from '../units/camera_controller';
import { MongoInvalidArgumentError } from "mongodb";
import { UniformBuffer, Model, Topology } from "../system/render_resources";

interface ViewerProps {
  accessLevel: number;
  socket: MapView;
}

interface ViewerState {
  canvasRef: React.MutableRefObject<any>;
  minimapRef: React.MutableRefObject<any>;
  minimapJSX: JSX.Element;
  switchMenuJSX: JSX.Element;
}

interface QueryData {
  key?: string;
  map?: string;
  node_uri?: string;
}

class NeighbourArrow implements Unit {
  data: NodeData;
  manager: NeighbourArrowManager;
  uniformBuffer: UniformBuffer;
  transform: Mat4;

  doSuicide: boolean;
  unitType: string = "NeighbourArrow";

  static create(manager: NeighbourArrowManager, data: NodeData): NeighbourArrow {
    let arrow = new NeighbourArrow();

    arrow.manager = manager;
    arrow.data = data;

    let direction = (new Vec2(data.position.x - manager.origin.x, data.position.y - manager.origin.y)).angle();

    arrow.transform = Mat4.identity()
      .mul(Mat4.rotateY(Math.PI / 2))
      .mul(Mat4.rotateZ(Math.PI / 2))
      .mul(Mat4.scaleNum(0.5, 0.5, 0.5))
      .mul(Mat4.translate(new Vec3(1.5, -0.5, 0)))
      .mul(Mat4.rotateY(direction))
      ;

    return arrow;
  } /* create */

  response(system: System): void {
    system.drawModel(this.manager.model, this.transform);
  } /* response */
}; /* NeighbourArrow */

class NeighbourArrowManager {
  system: System;
  model: Model;
  origin: Vec3 = new Vec3(0, 0, 0);
  neighbours: NeighbourArrow[] = [];

  static async create(system: System): Promise<NeighbourArrowManager> {
    let manager = new NeighbourArrowManager();

    let mtl = await system.createMaterial("bin/shaders/arrow");
    let img = await system.createTextureFromURL("bin/imgs/arrow.png");

    mtl.addResource(img);
    manager.model = system.createModelFromTopology(Topology.square(), mtl);
    manager.system = system;

    return manager;
  } /* NeighbourArrowManager */

  addNeighbour(data: NodeData): NeighbourArrow {
    console.log("neighbour added: ", data);
    let arrow = NeighbourArrow.create(this, data);

    this.system.addUnit(arrow);
    this.neighbours.push(arrow);
    return arrow;
  } /* addNeighbour */

  clearNeighbours() {
    for (let neighbour of this.neighbours)
    neighbour.doSuicide = true;
    this.neighbours = [];
  } /* clearNeighbours */
}; /* NeighbourArrowManager */

export class Viewer extends React.Component<ViewerProps, ViewerState> implements Unit {
  curQuery: QueryData = {};

  system: System;
  doSuicide: boolean;
  unitType: string = "Viewer";
  camera: CameraController.FixedArcball;
  neighbourManager: NeighbourArrowManager;
  sky: Skysphere;

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
    return getQuery() as QueryData;
  } /* getQuery */

  updateQuery() {
    history.pushState(this.curQuery, "", '?' + queryToStr(this.curQuery));
  } /* updateQuery */

  constructor( props: ViewerProps ) {
    super(props);
    this.state = {
      canvasRef: React.createRef(),
      minimapRef: React.createRef(),
      minimapJSX: (<></>),
      switchMenuJSX: (<></>),
    };
    console.log('Viewer construcor');
    this.curQuery = this.getQuery();
  } /* cosntructor */

  /* Node transition flag */
  nodeTransitionStarted: boolean = false;

  async goToNode(minimap: Minimap, uri: URI): Promise<boolean> {
    if (this.nodeTransitionStarted)
      return false;
    this.nodeTransitionStarted = true;
    // Canvas part

    // Minimap part
    console.log(uri.toStr());
    const node = await this.props.socket.getNode(uri);
    console.log(node);
    this.sky.skyTexturePath= "";
    const pos = minimap.toMap(node.position);
    console.log('Go to ' + uri.toStr());
    minimap.setAvatar(pos, node.floor);

    let image = await this.props.socket.loadImg("imgs/panorama/" + node.skysphere.path);
    this.sky.setImage(image);
    // Get new neighbours

    let neighbourNodes = await this.props.socket.getNeighbours(uri);
    this.neighbourManager.clearNeighbours();
    this.neighbourManager.origin = Vec3.fromObject(node.position);
    for (let neighbour of neighbourNodes) {
      this.neighbourManager.addNeighbour(await this.props.socket.getNode(neighbour));
    }

    this.curQuery.node_uri = uri.toStr();
    this.updateQuery();

    this.nodeTransitionStarted = false;
    return true;
  } /* goToNode */

  resize() {
    this.system.canvas.width = this.state.canvasRef.current.clientWidth;
    this.system.canvas.height = this.state.canvasRef.current.clientHeight;

    this.system.resize(this.system.canvas.width, this.system.canvas.height);
  } /* resize */

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
          zIndex: 2,
          position: 'absolute',
        }}>
          <h2>Minimap window</h2>
          {this.state.minimapJSX}
          {this.props.accessLevel >= 2 && <>
            <input type="button" value="Go to editor" onClick={()=>{
              window.location.href = "./editor.html" + window.location.search;
            }}/>
            <input type="button" value="Go to server" onClick={()=>{
                window.location.href = "./server.html" + window.location.search;
            }}/>
          </>}
        </div>
        <div className="box" style={{
          zIndex: 3,
          position: 'relative',
          float: 'right',
        }}>
          <h2>Other maps</h2>
          {this.state.switchMenuJSX}
        </div>
      </>
    );
  } /* End of 'render' function */

  /**
   * System initializatoin function
   */
  async componentDidMount() {
    this.system = await System.create(this.state.canvasRef.current);
    this.resize();

    this.system.camera.set(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(0, 1, 0));

    this.camera = await this.system.createUnit(CameraController.FixedArcball.create) as CameraController.FixedArcball;
    this.sky = await this.system.createUnit(Skysphere.create, "bin/imgs/default.png") as Skysphere;

    this.system.addUnit(this);

    this.neighbourManager = await NeighbourArrowManager.create(this.system);

    this.system.runMainLoop();

    window.addEventListener("resize", () => {
      this.resize();
    });
    
    const allMaps = (await this.props.socket.socket.send('getAllMapsReq')) as string[];
    const map: MapConfig = (await this.props.socket.socket.send("getMapConfigReq")) as MapConfig;

    await this.asyncSetState({
      switchMenuJSX: (
        <>
        {allMaps.map((m)=>{
          if (m == map.name)
            return (<></>);

          return (<><input type="button" value={"Switch to " + m} onClick={()=>{
            this.curQuery.map = m;
            this.updateQuery();
            location.reload();
          }}/><br/></>);
        })}
        </>
      ),
      minimapJSX: (
        <Minimap ref={this.state.minimapRef} socket={this.props.socket} callbacks={{
          onclick: async ( minimap: Minimap, floorIndex: number, pos: Vec2 )=>{
            console.log(`On click ${floorIndex} pos: [${pos.x}, ${pos.y}]`);
            const nearest = await this.props.socket.getNearest(minimap.toWorld(pos, floorIndex), floorIndex);
            this.goToNode(minimap, nearest);
          }
        }}/>
      ),
    });

    console.log('minimap ref');
    console.log(this.state.minimapRef);

    if (this.curQuery.node_uri != undefined)
      this.goToNode(this.state.minimapRef.current, new URI(this.curQuery.node_uri));
    else
      this.goToNode(this.state.minimapRef.current, await this.props.socket.getDefNodeURI());
  }
} /* End of 'Viewer' class */
