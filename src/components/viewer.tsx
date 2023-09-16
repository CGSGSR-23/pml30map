import { Minimap, FloorInfo } from "./minimap";
import { MapInfo } from "../../server/client";
import { Vec2, Vec3 } from "../system/linmath";
import React, { createRef } from "react";
import { Connection } from "../socket";
import { URI } from "../socket";

interface ViewerProps {
  accessLevel: number;
  socket: Connection;
}

interface ViewerState {
  canvasRef: React.MutableRefObject<any>;
  minimapRef: React.MutableRefObject<any>;
  minimap: JSX.Element;
}

export class Viewer extends React.Component<ViewerProps, ViewerState> {

  constructor( props: ViewerProps ) {
    super(props);
    this.state = {
      canvasRef: createRef(),
      minimapRef: createRef(),
      minimap: (<></>),
    };
    console.log('Viewer construcor');
  } /* End of 'cosntructor' function */

  async goToNode( uri: URI ) {
    
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
          background: 'darkblue'
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
          <h2> Minimap window</h2>
          {this.state.minimap}
          {this.props.accessLevel >= 2 && <>
            <input type="button" value="Go to editor" onClick={()=>{
              window.location.href = "./editor.html" + window.location.search;
            }}/>
            <input type="button" value="Go to server" onClick={()=>{
                window.location.href = "./server.html" + window.location.search;
            }}/>
          </>}
        </div>
      </>
    );
  } /* End of 'render' function */

  async loadAsync() {
    var map: MapInfo = (await this.props.socket.send("getMapSetInfoReq")) as MapInfo;

    this.setState({ minimap: (
      <Minimap ref={this.state.minimapRef} mapInfo={map.minimapInfo} callbacks={{
        onclick: async ( minimap: Minimap, floorIndex: number, pos: Vec2 )=>{
          console.log(`On click ${floorIndex} pos: [${pos.x}, ${pos.y}]`);
          const nearest = await this.props.socket.getNearest(minimap.toWorld(pos, floorIndex), floorIndex);
          console.log(nearest);
          const node = await this.props.socket.getNode(nearest);
          console.log(node);
          console.log('Pos prev:');
          console.log(pos);
          pos = minimap.toMap(node.position);
          console.log('Pos new:');
          console.log(pos);

          minimap.setAvatar(pos, minimap.state.curFloorInd);
        }
      }}/>
    )});
  }

  componentDidMount() {
    this.loadAsync();
    // Get context
    // System init

  }
} /* End of 'Viewer' class */

