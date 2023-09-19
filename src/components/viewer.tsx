import { Minimap, FloorInfo } from "./minimap";
import { MapInfo } from "../../server/client";
import { Vec2, Vec3 } from "../system/linmath";
import React, { createRef } from "react";
import { Connection } from "../socket";
import { URI } from "../socket";
import { queryToStr } from "./support";

interface ViewerProps {
  accessLevel: number;
  socket: Connection;
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

export class Viewer extends React.Component<ViewerProps, ViewerState> {
  curQuery: QueryData = {};
  
  asyncSetState( newState: any ) {
    return new Promise<void>((resolve) => {
        this.setState(newState, ()=>{
          resolve();
        });
      });
  }

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
  }

  updateQuery() {
    history.pushState(this.curQuery, "", '?' + queryToStr(this.curQuery));
  }

  constructor( props: ViewerProps ) {
    super(props);
    this.state = {
      canvasRef: createRef(),
      minimapRef: createRef(),
      minimapJSX: (<></>),
      switchMenuJSX: (<></>),
    };
    console.log('Viewer construcor');
    this.curQuery = this.getQuery();
  } /* End of 'cosntructor' function */

  async goToNode( minimap: Minimap, uri: URI ) {
    // Canvas part

    // Minimap part
    const node = await this.props.socket.getNode(uri);
    const pos = minimap.toMap(node.position);
    console.log('Go to ' + uri.toStr());
    minimap.setAvatar(pos, node.floor);

    this.curQuery.node_uri = uri.toStr();
    this.updateQuery();
  }

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
          <canvas ref={this.state.canvasRef}></canvas>
        </div>
        <div style={{
          zIndex: 2,
          position: 'absolute',
          backgroundColor: 'var(--bg-color)',
          border: '0.2em solid var(--bg-color)',
          padding: '0.5em',
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
        <div style={{
          zIndex: 3,
          position: 'relative',
          backgroundColor: 'var(--bg-color)',
          border: '0.2em solid var(--bg-color)',
          padding: '0.5em',
          float: 'right',
        }}>
          <h2>Other maps</h2>
          {this.state.switchMenuJSX}
        </div>
      </>
    );
  } /* End of 'render' function */

  async loadAsync() {
    const allMaps = (await this.props.socket.send('getAllMapsReq')) as string[];
    const map: MapInfo = (await this.props.socket.send("getMapSetInfoReq")) as MapInfo;
    
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
        <Minimap ref={this.state.minimapRef} mapInfo={map.minimapInfo} callbacks={{
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

  }

  componentDidMount() {
    this.loadAsync();
    // Get context
    // System init
  }
} /* End of 'Viewer' class */

window.onbeforeunload = ()=>{
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa');
}