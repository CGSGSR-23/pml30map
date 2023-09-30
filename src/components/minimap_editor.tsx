import React, { createRef } from "react";
import { MapConfig } from "../../server/map_config";
import { FloorInfo } from "../../server/map_config";
import { Vec2 } from "../system/linmath";
import { uploadFile } from "./upload";
import { MapEdit } from "../map_edit";
import { InputFile } from "./support";

import { MinimapEditReqType, MinimapPosType } from "../../server/client";
export interface MinimapEditorProps {
  socket: MapEdit;
  closeCallBack: ()=>void;
}

export interface MinimapEditorState {
  canvasRef: React.MutableRefObject<any>;
  imgFileRef: React.MutableRefObject<any>;
  imgListJSX: JSX.Element;
  editFloor: FloorInfo;
  mapConfig: MapConfig;
  inputRef: React.MutableRefObject<any>;
  showAddFloorWindow: boolean;
  showLoadButton: boolean;
  errorText: string;
  isSetPosMode: boolean;
  setPosCallBack: ( pos: Vec2 )=>void;
}

export class MinimapEditor extends React.Component<MinimapEditorProps, MinimapEditorState> {
  mapOffset: Vec2 = new Vec2( 0, 0 );
  mapScale: number = 0.4;
  curImg: HTMLImageElement = undefined;
  canvasMousePos: Vec2 = new Vec2(0, 0);
  
  constructor( props: MinimapEditorProps ) {
    super(props);
    this.state = {
      canvasRef: createRef(),
      imgFileRef: createRef(),
      inputRef: createRef(),
      imgListJSX: (<></>),
      editFloor: undefined,
      mapConfig: this.props.socket.mapConfig,
      showAddFloorWindow: false,
      showLoadButton: false,
      errorText: "",
      isSetPosMode: false,
      setPosCallBack: undefined,
    };
  } 
  
  drawAvatar( ctx: CanvasRenderingContext2D, coords: Vec2, color: string = 'white'): void {
    const size = 5;
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    // Some kal
    coords = new Vec2(coords.x, coords.y);
    
    const pos = coords.mul(this.mapScale).add(this.mapOffset);
  
    ctx.beginPath();
    ctx.moveTo(pos.x - size, pos.y - size);
    ctx.lineTo(pos.x + size, pos.y + size);
    ctx.moveTo(pos.x + size, pos.y - size);
    ctx.lineTo(pos.x - size, pos.y + size);
    ctx.closePath();
    ctx.stroke();
  }
  
  updateCanvas() {
    var ctx = this.state.canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.state.canvasRef.current.width, this.state.canvasRef.current.height);

    ctx.drawImage(this.curImg, this.mapOffset.x, this.mapOffset.y, this.curImg.width * this.mapScale, this.curImg.height * this.mapScale);

    this.drawAvatar(ctx, this.state.mapConfig.minimapInfo.imgStartPos, 'lightgreen');
    this.drawAvatar(ctx, this.state.mapConfig.minimapInfo.imgEndPos, 'pink');

    if (this.state.editFloor != undefined) {
      if (this.state.editFloor.startPos != undefined)
        this.drawAvatar(ctx, this.state.editFloor.startPos, 'green');
      if (this.state.editFloor.endPos != undefined)
        this.drawAvatar(ctx, this.state.editFloor.endPos, 'red');
    }
    
    if (this.state.isSetPosMode)
    {
      const pos = (this.canvasMousePos).sub(this.mapOffset).mul(1 / this.mapScale);
      this.drawAvatar(ctx, pos, 'orange');
    }
  }

  async updateEdit() {
    this.curImg = await this.props.socket.loadImg(this.state.editFloor.fileName) as HTMLImageElement;
    this.updateCanvas();
  }

  async reloadImg() {
    this.curImg = await this.props.socket.loadImg(this.state.editFloor.fileName + "?" + Math.random()) as HTMLImageElement;
    this.updateCanvas();
    this.setState({});
  }

  async updateConfig() {
    await this.props.socket.updateConfig();
    return new Promise<void>((resolve)=>{
      if (this.state.editFloor != undefined)
        for (let f in this.props.socket.mapConfig.minimapInfo.floors)
          if (this.props.socket.mapConfig.minimapInfo.floors[f].floorIndex == this.state.editFloor.floorIndex)
          {
            this.setState({ mapConfig: this.props.socket.mapConfig, editFloor: this.props.socket.mapConfig.minimapInfo.floors[f] }, ()=>{
              resolve();
            });
            return;
          }

      this.setState({ mapConfig: this.props.socket.mapConfig }, ()=>{
        resolve();
      });
    });  
  }

  enableSetPosMode( callBack: ( pos: Vec2 )=>void ) {
    this.setState({ isSetPosMode: true, setPosCallBack: callBack });
  }

  disableSetPosMode() {
    this.setState({ isSetPosMode: false }, ()=>{
      this.updateCanvas();
    });
  }

  render() {
    var mouseX = 0, mouseY = 0; // For click detect
    
    return (
      <div className="box">
        <div className="flexRow spaceBetween">
          <h2>Minimap settings</h2>
          <input type="button" value="close" onClick={this.props.closeCallBack}/>
        </div>
        <div className="flexColumn">
          <div className="flexRow">
            <div className="flexColumn">
              <canvas ref={this.state.canvasRef} width={400} height={400} style={{
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
                this.canvasMousePos.x = e.nativeEvent.offsetX; 
                this.canvasMousePos.y = e.nativeEvent.offsetY; 
                if (e.buttons & 1) { // Drag
                  this.mapOffset = this.mapOffset.add(new Vec2(e.movementX, e.movementY));
                  this.updateCanvas();
                } else if (this.state.isSetPosMode)
                  this.updateCanvas();
                

              }} onMouseDown={(e)=>{
                mouseX = e.clientX;
                mouseY = e.clientY;
              }} onMouseUp={(e)=>{
                if (mouseX == e.clientX && mouseY == e.clientY)
                {
                  const pos = (new Vec2(e.nativeEvent.offsetX, e.nativeEvent.offsetY)).sub(this.mapOffset).mul(1 / this.mapScale);
                  if (this.state.isSetPosMode)
                    this.state.setPosCallBack(pos);
                }
              }}/>
              {this.state.editFloor != undefined && <>
                {/*<input ref={this.state.imgFileRef} type="file" accept="image/*"/>*/}
                <InputFile ref={this.state.imgFileRef} value="Chose image file" onLoadCallBack={async ()=>{
                  if (this.state.imgFileRef.current.getFiles().length > 0 && this.state.mapConfig != undefined)
                  {
                    const imgPath = "imgs/minimap/", imgName = `f${this.state.editFloor.floorIndex}.png`;

                    await uploadFile(this.state.imgFileRef.current.getFiles()[0], `maps/${this.state.mapConfig.name}/${imgPath}`, imgName);
                    await this.reloadImg();
                  }
                  console.log("Sent");
                }}/>
                <div className="flexColumn">
                  <div>
                    <p>Options:</p>
                    <div className="flexRow padded">
                      <input type="button" value="Delete floor" onClick={async ()=>{
                        await this.props.socket.editMinimap({type: MinimapEditReqType.delFloor, data: this.state.editFloor.floorIndex});
                        this.setState({ mapConfig: this.props.socket.mapConfig });  
                      }}/>
                      <input type="button" value="Set default img poses" onClick={async ()=>{
                        await this.props.socket.editMinimap({type: MinimapEditReqType.setFloorImgPos, data: { posType: MinimapPosType.Start, pos: this.state.mapConfig.minimapInfo.imgStartPos, floor: this.state.editFloor.floorIndex}});
                        await this.props.socket.editMinimap({type: MinimapEditReqType.setFloorImgPos, data: { posType: MinimapPosType.End, pos: this.state.mapConfig.minimapInfo.imgEndPos, floor: this.state.editFloor.floorIndex}});
                        await this.updateConfig();
                        this.updateCanvas();
                      }}/>
                    </div>
                  </div>
                  <div className="flexRow spaceBetween">
                    <p>Img start pos - <b>{this.state.editFloor.startPos == undefined ?
                      `[${this.state.mapConfig.minimapInfo.imgStartPos.x}, ${this.state.mapConfig.minimapInfo.imgStartPos.y}](default)` :
                      `[${this.state.editFloor.startPos.x}, ${this.state.editFloor.startPos.y}]`}</b></p>
                    <input type="button" value="Edit" onClick={async ()=>{
                      this.enableSetPosMode( async ( pos: Vec2 )=>{
                        await this.props.socket.editMinimap({type: MinimapEditReqType.setFloorImgPos, data: { posType: MinimapPosType.Start, pos: new Vec2(Math.floor(pos.x), Math.floor(pos.y)), floor: this.state.editFloor.floorIndex}});
                        await this.updateConfig();
                        this.disableSetPosMode();
                      });
                    }}/>
                  </div>
                  <div className="flexRow spaceBetween">
                    <p>Img end pos - <b>{this.state.editFloor.startPos == undefined ?
                      `[${this.state.mapConfig.minimapInfo.imgEndPos.x}, ${this.state.mapConfig.minimapInfo.imgEndPos.y}](default)` :
                      `[${this.state.editFloor.endPos.x}, ${this.state.editFloor.endPos.y}]`}</b></p>
                    <input type="button" value="Edit" onClick={async ()=>{
                      this.enableSetPosMode( async ( pos: Vec2 )=>{
                        await this.props.socket.editMinimap({type: MinimapEditReqType.setFloorImgPos, data: { posType: MinimapPosType.End, pos: new Vec2(Math.floor(pos.x), Math.floor(pos.y)), floor: this.state.editFloor.floorIndex}});
                        await this.updateConfig();
                        this.disableSetPosMode();
                      });
                    }}/>
                  </div>
                </div>
              </>}
            </div>
            {this.state.mapConfig != undefined && <div>
              {this.state.mapConfig.minimapInfo.floors.map((e)=>{
                return (<><input type="button" className={this.state.editFloor != undefined ? this.state.editFloor.floorIndex == e.floorIndex ? "active" : "" : ""} value={`Floor ${e.floorIndex}`} onClick={()=>{
                  this.setState({ editFloor: e }, ()=>{
                    this.state.imgFileRef.current.reset();
                    this.updateEdit();
                  });
                }}/><br/></>);
              })}
            </div>}
          </div>
          <input type="button" value="Add floor" onClick={async ()=>{
            //await this.props.socket.editMinimap({type: MinimapEditReqType.addFloor, data: 10});
            this.setState({ showAddFloorWindow: true });
          }}/>
          <b>Map settings:</b>
          <div className="flexColumn padded">
            <div className="flexRow spaceBetween">
              <p>Img start pos - <b>[{this.state.mapConfig.minimapInfo.imgStartPos.x}, {this.state.mapConfig.minimapInfo.imgStartPos.y}]</b></p>
              <input type="button" value="Edit" onClick={async ()=>{
                this.enableSetPosMode( async ( pos: Vec2 )=>{
                  await this.props.socket.editMinimap({type: MinimapEditReqType.setImgPos, data: { posType: MinimapPosType.Start, pos: new Vec2(Math.floor(pos.x), Math.floor(pos.y)) }});
                  await this.updateConfig();
                  this.disableSetPosMode();
                });
              }}/>
            </div>
            <div className="flexRow spaceBetween">
              <p>Img end pos - <b>[{this.state.mapConfig.minimapInfo.imgEndPos.x}, {this.state.mapConfig.minimapInfo.imgEndPos.y}]</b></p>
              <input type="button" value="Edit" onClick={async ()=>{
                this.enableSetPosMode( async ( pos: Vec2 )=>{
                  await this.props.socket.editMinimap({type: MinimapEditReqType.setImgPos, data: { posType: MinimapPosType.End, pos: new Vec2(Math.floor(pos.x), Math.floor(pos.y)) }});
                  await this.updateConfig();
                  this.disableSetPosMode();
                });
              }}/>
            </div>
            <div className="flexRow spaceBetween">
              <p>Model start pos - <b>[{this.state.mapConfig.minimapInfo.modelStartPos.x}, {this.state.mapConfig.minimapInfo.modelStartPos.y}]</b></p>
            </div>
            <div className="flexRow spaceBetween">
              <p>Model end pos - <b>[{this.state.mapConfig.minimapInfo.modelEndPos.x}, {this.state.mapConfig.minimapInfo.modelEndPos.y}]</b></p>
            </div>
          </div>
        </div>
        {this.state.showAddFloorWindow &&
          <div style={{
            zIndex: 5,
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
            <div className="box">
              <div className="flexRow">
                Floor index: <input ref={this.state.inputRef} type="number"/><input type="button" value="Add" onClick={async ()=>{
                  const res = await this.props.socket.editMinimap({type: MinimapEditReqType.addFloor, data: parseInt(this.state.inputRef.current.value)});
                  
                  if (!res)
                    this.setState({ errorText: "Such floor already exist" });
                  else
                  {
                    await this.props.socket.updateConfig();
                    this.setState({ errorText: "", showAddFloorWindow: false, mapConfig: this.props.socket.mapConfig });  
                  }
                }}/>  
              </div>
              {this.state.errorText != "" && <p>{this.state.errorText}</p>}
            </div>
          </div>
        }
      </div>
    );
  }

  async componentDidMount() {
    //const mapInfo: MapConfig = (await this.props.socket.socket.send("getMapConfigReq")) as MapConfig;


    //this.setState({ mapInfo: this.prosp });
  }
}
