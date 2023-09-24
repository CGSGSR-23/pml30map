import React, { createRef } from "react";
import { MapInfo } from "../../server/client";
import { Connection } from "../socket";
import { FloorInfo } from "./minimap";
import { Vec2 } from "../system/linmath";
import { loadImg } from "./support";
import { uploadFile } from "./upload";
export interface MinimapEditorProps {
  socket: Connection;
  closeCallBack: ()=>void;
}

export interface MinimapEditorState {
  canvasRef: React.MutableRefObject<any>;
  imgFileRef: React.MutableRefObject<any>;
  imgListJSX: JSX.Element;
  editFloor: FloorInfo;
  mapInfo: MapInfo;
}

export class MinimapEditor extends React.Component<MinimapEditorProps, MinimapEditorState> {
  mapOffset: Vec2 = new Vec2( 0, 0 );
  mapScale: number = 0.2;
  curImg: HTMLImageElement = undefined;
  
  constructor( props: MinimapEditorProps ) {
    super(props);
    this.state = {
      canvasRef: createRef(),
      imgFileRef: createRef(),
      imgListJSX: (<></>),
      editFloor: undefined,
      mapInfo: undefined,
    };
  } 
  
  updateCanvas() {
    var ctx = this.state.canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.state.canvasRef.current.width, this.state.canvasRef.current.height);

    ctx.drawImage(this.curImg, this.mapOffset.x, this.mapOffset.y, this.curImg.width * this.mapScale, this.curImg.height * this.mapScale);
  }

  async updateEdit() {
    this.curImg = await loadImg(this.state.editFloor.fileName) as HTMLImageElement;
    this.updateCanvas();
  }

  async reloadImg() {
    this.curImg = await loadImg(this.state.editFloor.fileName + "?" + Math.random()) as HTMLImageElement;
    this.updateCanvas();
  }

  render() {
    return (
      <div className="box">
        <div className="flexRow spaceBetween">
          <h2>Minimap settings</h2>
          <input type="button" value="close" onClick={this.props.closeCallBack}/>
        </div>
        <div className="flexRow">
          <div className="flexColumn">
            <canvas ref={this.state.canvasRef} width={200} height={200} style={{
              border: '0.2em dashed var(--color2)',
              margin: '0.3em',
              aspectRatio: 1,
            }} onWheel={( we ) => {
              var e = we.nativeEvent as MouseEvent;
              let coef = Math.pow(0.95, we.deltaY / 100);
              let mousePos = new Vec2(e.offsetX, e.offsetY);
            
              this.mapOffset = mousePos.sub(mousePos.sub(this.mapOffset).mul(coef));
            
              this.mapScale *= coef;
            
              this.updateCanvas();
            }} onContextMenu={( e )=>{
              e.preventDefault();
            }} onMouseMove={( e )=>{
              if (e.buttons & 1) // Drag
              {
                this.mapOffset = this.mapOffset.add(new Vec2(e.movementX, e.movementY));
                this.updateCanvas();
              }
            }}/>
            <input ref={this.state.imgFileRef} type="file"/>
            <input type="button" value="Load another" onClick={async ()=>{
              if (this.state.imgFileRef.current.files.length > 0 && this.state.mapInfo != undefined)
              {
                const imgPath = "imgs/minimap/", imgName = `f${this.state.editFloor.floorIndex}.png`;

                // maps/{mapName}/imgs/minimap/
                await uploadFile(this.state.imgFileRef.current.files[0], `maps/${this.state.mapInfo.name}/${imgPath}`, imgName);
                await this.reloadImg();
              }
              console.log("Sent");
            }}/>
          </div>
          {this.state.mapInfo != undefined && <div>
            {this.state.mapInfo.minimapInfo.floors.map((e)=>{
              return (<><input type="button" className={this.state.editFloor != undefined ? this.state.editFloor.floorIndex == e.floorIndex ? "active" : "" : ""} value={`Floor ${e.floorIndex} img: ${e.fileName}`} onClick={()=>{
                console.log("Chose " + e.floorIndex);
                this.setState({ editFloor: e }, ()=>{
                  this.updateEdit();
                });
              }}/><br/></>);
            })}
          </div>}
        </div>
      </div>
    );
  }

  async componentDidMount() {
    const mapInfo: MapInfo = (await this.props.socket.send("getMapSetInfoReq")) as MapInfo;

    this.setState({ mapInfo: mapInfo });
  }
}
