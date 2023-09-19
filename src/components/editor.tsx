import { Minimap, FloorInfo } from "./minimap";
import { MapInfo } from "../../server/client";
import { Vec2, Vec3 } from "../system/linmath";
import React, { createRef } from "react";
import { Connection } from "../socket";
import { URI } from "../socket";
import { queryToStr } from "./support";
import { System, Unit } from "../system/system";
import { Target, Topology, Vertex, Material, Model } from "../system/render_resources";

class Triangle implements Unit {
  doSuicide: boolean;
  model: Model;

  /**
   * Unit create function
   * @param system System
   * @returns Promise of new triangle unit
   */
  static async create(system: System): Promise<Triangle> {
    let unit: Triangle = new Triangle();
    let tpl: Topology = Topology.sphere(0.1);
    let material: Material = await Material.create(system.gl, "bin/shaders/model");

    unit.model = Model.fromTopology(system.gl, tpl, material);

    return unit;
  } /* create */

  /**
   * Response function
   * @param system System reference
   */
  response(system: System): void {
    system.drawModel(this.model);
  } /* response */
} /* class Triangle */

class FrameCounter implements Unit {
  doSuicide: boolean;
  frameIndex: number = 0;

  constructor() {
    const listenFunction = (key) => {
      if (key.key != 'w')
        return;
      console.log("Suicide!");
      this.doSuicide = true;

      document.removeEventListener("keydown", listenFunction);
    };

    document.addEventListener("keydown", listenFunction)
  } /* constructor */
  
  response(system: System) {
    console.log(`Current frame: ${this.frameIndex++}`);
  } /* response */
} /* TestUnit */


interface NodeData {
  uri: URI;
  name: string;
  skysphere: string;
  floor: number;
} /* NodeData */

interface NodeSettingsProps {
  data: NodeData;
  onMakeDefaultCallBack: ()=>void,
  onDeleteNodeCallBack: ()=>void,
  onSave: ( newData: NodeData )=>void,
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
      nameRef: createRef(),
      floorRef: createRef(),
      skysphereRef: createRef(),
    };
  }

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
  socket: Connection;
}

interface EditorState {
  canvasRef: React.MutableRefObject<any>;
  floorRef: React.MutableRefObject<any>;
  floorNumberRef: React.MutableRefObject<any>;
  menuJSX: JSX.Element;
  nodeSettingsRef: React.MutableRefObject<any>;
  showNodeSettings: boolean,
}


interface QueryData {
  key?: string;
  map?: string;
}

/**
 * Editor class
 */
export class Editor extends React.Component<EditorProps, EditorState> {
  system: System = null;
  upperFloor: number = 0;
  curQuery: QueryData = {};

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
      canvasRef: createRef(),
      floorRef: createRef(),
      floorNumberRef: createRef(),
      menuJSX: (<></>),
      nodeSettingsRef: createRef(),
      showNodeSettings: true,
    };
    console.log('Viewer construcor');
    window.addEventListener("resize", () => {this.resize();});
  } /* End of 'cosntructor' function */

  async goToNode( uri: URI ) {
    
  } /* goToNode */
  
  resize() {
    this.system.canvas.width = this.state.canvasRef.current.clientWidth;
    this.system.canvas.height = this.state.canvasRef.current.clientHeight;

    this.system.defaultTarget.resize(this.system.canvas.width, this.system.canvas.height);
    this.system.target.resize(this.system.canvas.width, this.system.canvas.height);
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
        <div style={{
          zIndex: 3,
          position: 'absolute',
          backgroundColor: 'var(--bg-color)',
          border: '0.2em solid var(--bg-color)',
          padding: '0.5em',
          width: '30em',
        }}>
          {this.state.showNodeSettings && <NodeSettings ref={this.state.nodeSettingsRef} data={{floor: 0, name: 'nodename', skysphere: 'nodsjysphere', uri: new URI('[0, 0, 0, 0, 0, 0, 0, 0]')}}
          onDeleteNodeCallBack={()=>{}} onClose={()=>{}} onMakeDefaultCallBack={()=>{}} onSave={()=>{}}/>}
        </div>
        <div style={{
          zIndex: 3,
          position: 'relative',
          backgroundColor: 'var(--bg-color)',
          border: '0.2em solid var(--bg-color)',
          padding: '0.5em',
          float: 'right',
          width: '20em'
        }}>
          <h2>Menu</h2>
          {this.state.menuJSX}
        </div>
      </>
    );
  } /* End of 'render' function */
  
  async systemInit() {
    this.system = await System.create(this.state.canvasRef.current);
    this.resize();

    this.system.addUnit(await Triangle.create(this.system));

    this.system.runMainLoop();
  } /* systemInit */

  async componentDidMount() {
    console.log(this.state.canvasRef.current);
    this.systemInit();

    // Get context
    const allMaps = (await this.props.socket.send('getAllMapsReq')) as string[];
    const map: MapInfo = (await this.props.socket.send("getMapSetInfoReq")) as MapInfo;
    const query = this.getQuery();

    this.upperFloor = map.minimapInfo.firstFloor + map.minimapInfo.floorCount - 1;
    
    this.asyncSetState({
      menuJSX: (<>
        <input type="button" value="Go to viewer" onClick={()=>{
          window.location.href = "./viewer.html" + window.location.search;
        }}/>
        <input type="button" value="Go to server" onClick={()=>{
            window.location.href = "./server.html" + window.location.search;
        }}/><br/>
        {allMaps.map((m)=>{
          if (m == map.name)
            return (<></>);

          return (<><input type="button" value={"Switch to " + m} onClick={()=>{
            if (query.map != undefined)
            this.curQuery.map = m;
            this.updateQuery();
            location.reload();
          }}/><br/></>);
        })}<br/>
        {map.minimapInfo.floorCount > 1 &&
        <div className="flexRow spaceBetween">
          Visible floors:
          <div className="flexRow">
            <input ref={this.state.floorRef} type="range" min={map.minimapInfo.firstFloor} max={map.minimapInfo.firstFloor + map.minimapInfo.floorCount} onChange={(e)=>{
              this.state.floorNumberRef.current.innerText = e.target.value;
              this.upperFloor = parseInt(e.target.value);
            }}/>
            <div ref={this.state.floorNumberRef} style={{width: '1em'}}>{this.upperFloor}</div>
          </div>
        </div>
        }
      </>)
    });
  } /* componentDidMount */
} /* End of 'Viewer' class */

