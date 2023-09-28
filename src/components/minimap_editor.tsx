import React, { createRef } from "react";
import { MapConfig } from "../../server/map_config";
import { FloorInfo } from "../../server/map_config";
import { Vec2 } from "../system/linmath";
import { uploadFile } from "./upload";
import { MapEdit } from "../map_edit";
import { InputFile } from "./support";

import { MinimapEditReqType } from "../../server/client";
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
      inputRef: createRef(),
      imgListJSX: (<></>),
      editFloor: undefined,
      mapConfig: this.props.socket.mapConfig,
      showAddFloorWindow: false,
      showLoadButton: false,
      errorText: "",
    };
  } 
  
  updateCanvas() {
    var ctx = this.state.canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.state.canvasRef.current.width, this.state.canvasRef.current.height);

    ctx.drawImage(this.curImg, this.mapOffset.x, this.mapOffset.y, this.curImg.width * this.mapScale, this.curImg.height * this.mapScale);
  }

  async updateEdit() {
    console.log('LOAD IMAGE');
    this.curImg = await this.props.socket.loadImg(this.state.editFloor.fileName) as HTMLImageElement;
    console.log(this.curImg);
    this.updateCanvas();
  }

  async reloadImg() {
    console.log('LOAD IMAGE');
    this.curImg = await this.props.socket.loadImg(this.state.editFloor.fileName + "?" + Math.random()) as HTMLImageElement;
    console.log(this.curImg);
    this.updateCanvas();
    this.setState({});
  }

  render() {
    return (
      <div className="box">
        <div className="flexRow spaceBetween">
          <h2>Minimap settings</h2>
          <input type="button" value="close" onClick={this.props.closeCallBack}/>
        </div>
        <div className="flexColumn">
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
                <input type="button" value="Delete floor" onClick={async ()=>{
                  await this.props.socket.editMinimap({type: MinimapEditReqType.delFloor, data: this.state.editFloor.floorIndex});
                  this.setState({ mapConfig: this.props.socket.mapConfig });  
                }}/>

                {/*
                <input type="button" value="Save config" onClick={async ()=>{
                  await fetch(`saveConfig`, {
                    method: 'post',
                  });
                }}/>
                */}
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
                  await this.props.socket.updateConfig();

                  if (!res)
                    this.setState({ errorText: "Such floor already exist" });
                  else
                    this.setState({ errorText: "", showAddFloorWindow: false, mapConfig: this.props.socket.mapConfig });  
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
