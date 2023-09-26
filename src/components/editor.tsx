import React from "react";
import { Connection } from "../socket";
import { URI } from "../socket";
import { queryToStr } from "./support";
import { MinimapEditor } from "./minimap_editor";

import { System, Unit } from "../system/system";
import { Topology, Material, Model, UniformBuffer } from "../system/render_resources";
import { Skysphere } from "../units/skysphere";
import { BaseConstruction } from "../units/base_construction";
import * as CameraController from "../units/camera_controller";
import * as LinMath from '../system/linmath';
import { MapEdit } from "../map_edit";
import { MapConfig } from "../../server/map_config";

class Triangle implements Unit {
  skysphere: Skysphere;
  baseConstruction: BaseConstruction;
  doSuicide: boolean;

  /**
   * Unit create function
   * @param system System
   * @returns Promise of new triangle unit
   */
  static async create(system: System): Promise<Triangle> {
    let unit = new Triangle();

    unit.skysphere = await system.createUnit(Skysphere.create, "bin/imgs/default.png") as Skysphere;
    unit.baseConstruction = await system.createUnit(BaseConstruction.create, "bin/models/pml30map.obj") as BaseConstruction;
    system.createUnit(CameraController.Arcball.create);
    return unit;
  } /* create */

  /**
   * Response function
   * @param system System reference
   */
  response(system: System): void {
    this.baseConstruction.setCutFloor(Math.floor(Math.abs(Math.sin(system.timer.time)) * 10.0));
  } /* response */
} /* class Triangle */

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
      canvasRef: React.createRef(),
      floorRef: React.createRef(),
      floorNumberRef: React.createRef(),
      menuJSX: (<></>),
      nodeSettingsRef: React.createRef(),
      showNodeSettings: true,
      showMinimapSettings: false,
    };
    window.addEventListener("resize", () => {
      this.system.resize(this.state.canvasRef.current.clientWidth, this.state.canvasRef.current.clientHeight);
    });
    this.curQuery = this.getQuery();
  } /* End of 'cosntructor' function */

  async goToNode( uri: URI ) {

  } /* goToNode */

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
          {this.state.showNodeSettings && <NodeSettings ref={this.state.nodeSettingsRef} data={{floor: 0, name: 'nodename', skysphere: 'nodsjysphere', uri: new URI('[0, 0, 0, 0, 0, 0, 0, 0]')}}
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
          <MinimapEditor socket={this.props.socket} closeCallBack={()=>{
            this.setState({ showMinimapSettings: false });
          }}/>
        </div>}
      </>
    );
  } /* End of 'render' function */


  async systemInit() {
    this.system = await System.create(this.state.canvasRef.current);
    this.system.resize(this.state.canvasRef.current.clientWidth, this.state.canvasRef.current.clientHeight);
    this.system.createUnit(Triangle.create);
    this.system.runMainLoop();
  } /* systemInit */

  async componentDidMount() {
    this.systemInit();

    // Get context
    const allMaps = (await this.props.socket.socket.send('getAllMapsReq')) as string[];
    //const map: MapConfig = (await this.props.socket.socket.send("getMapSetInfoReq")) as MapConfig;
    const query = this.getQuery();

    this.upperFloor = this.props.socket.mapConfig.minimapInfo.firstFloor + this.props.socket.mapConfig.minimapInfo.floorCount - 1;
    
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
              this.upperFloor = parseInt(e.target.value);
            }} style={{ width: this.props.socket.mapConfig.minimapInfo.floorCount * 2 + 'em' }}/>
            <div ref={this.state.floorNumberRef} style={{width: '1em'}}>{this.upperFloor}</div>
          </div>
        </div>}
        <input type="button" value="Minimap settings" onClick={()=>{
          this.setState({ showMinimapSettings: true });
        }}/>
      </>)
    });
  } /* componentDidMount */
} /* End of 'Viewer' class */

