import React, { createRef } from 'react';
import { Vec2, Vec3 } from '../system/linmath';
import { loadImg } from './support';
import { MinimapInfo, FloorInfo } from '../../server/map_config';
import { MapView } from '../map_view';

interface MinimapCallBacks {
  onclick: ( minimap: Minimap, floorIndex: number, pos: Vec2 )=>void;
}

interface MinimapProps {
  socket: MapView;
  callbacks: MinimapCallBacks,
}

interface MinimapState {
  mapRef: React.MutableRefObject<any>;
  curFloorInd: number;
}

export class Minimap extends React.Component<MinimapProps, MinimapState> {
  floorImgs: Array<Promise<any>> = [];
  mapOffset: Vec2 = new Vec2( 0, 0 );
  mapScale: number = 0.2;
  mouseX: number = 0;
  mouseY: number = 0;
  avatarPos: Vec2 = new Vec2(0, 0);
  avatarFloor: number;
  imgStartPos: Vec2;
  imgEndPos: Vec2;
  scaleCoef: number;

  constructor( props: MinimapProps ) {
    super(props);

    this.state = {
      mapRef: createRef(),
      curFloorInd: props.socket.mapConfig.minimapInfo.defFloor,
    };

    props.socket.mapConfig.minimapInfo.imgStartPos = new Vec2(props.socket.mapConfig.minimapInfo.imgStartPos.x, props.socket.mapConfig.minimapInfo.imgStartPos.y);
    props.socket.mapConfig.minimapInfo.imgEndPos = new Vec2(props.socket.mapConfig.minimapInfo.imgEndPos.x, props.socket.mapConfig.minimapInfo.imgEndPos.y);
    props.socket.mapConfig.minimapInfo.modelStartPos = new Vec2(props.socket.mapConfig.minimapInfo.modelStartPos.x, props.socket.mapConfig.minimapInfo.modelStartPos.y);
    props.socket.mapConfig.minimapInfo.modelEndPos = new Vec2(props.socket.mapConfig.minimapInfo.modelEndPos.x, props.socket.mapConfig.minimapInfo.modelEndPos.y);

    this.updateImgPos();
    
    //for (let i = 0; i < props.mapInfo.floorCount; i++)
    //  this.floorImgs[props.mapInfo.floors[i].floorIndex] = loadImg(props.mapInfo.floors[i].fileName);
    props.socket.mapConfig.minimapInfo.floors.map(async (f)=>{
      this.floorImgs[f.floorIndex] = this.props.socket.loadImg(f.fileName);
    });
  }

  updateImgPos() {
    console.log(this.state.curFloorInd);
    console.log(this.props.socket.mapConfig.minimapInfo.imgStartPos);
    if (this.state.curFloorInd != undefined) {
      for (let f in this.props.socket.mapConfig.minimapInfo.floors)
        if (this.props.socket.mapConfig.minimapInfo.floors[f].floorIndex == this.state.curFloorInd)
        {
          this.imgStartPos = this.props.socket.mapConfig.minimapInfo.floors[f].startPos != undefined ? this.props.socket.mapConfig.minimapInfo.floors[f].startPos : this.props.socket.mapConfig.minimapInfo.imgStartPos;
          this.imgEndPos   = this.props.socket.mapConfig.minimapInfo.floors[f].endPos   != undefined ? this.props.socket.mapConfig.minimapInfo.floors[f].endPos   : this.props.socket.mapConfig.minimapInfo.imgEndPos;
          break;
        }
    }
    this.imgStartPos = this.props.socket.mapConfig.minimapInfo.imgStartPos;
    this.imgEndPos = this.props.socket.mapConfig.minimapInfo.imgEndPos;
    this.scaleCoef = this.imgEndPos.sub(this.imgStartPos).length() /
                     this.props.socket.mapConfig.minimapInfo.modelEndPos.sub(this.props.socket.mapConfig.minimapInfo.modelStartPos).length();
  }

  drawAvatar( ctx: CanvasRenderingContext2D,  coords: Vec2 ): void {
    const size = 5;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgb(255, 0, 0)';

    const pos = coords.mul(this.mapScale).add(this.mapOffset);
  
    ctx.beginPath();
    ctx.moveTo(pos.x - size, pos.y - size);
    ctx.lineTo(pos.x + size, pos.y + size);
    ctx.moveTo(pos.x + size, pos.y - size);
    ctx.lineTo(pos.x - size, pos.y + size);
    ctx.closePath();
    ctx.stroke();
  }
  
  async updateCanvas() {
    var ctx = this.state.mapRef.current.getContext('2d');

    //console.log(this.floorImgs);
    ctx.clearRect(0, 0, this.state.mapRef.current.width, this.state.mapRef.current.height);

    let img = await this.floorImgs[this.state.curFloorInd];
    ctx.drawImage(img, this.mapOffset.x, this.mapOffset.y, img.width * this.mapScale, img.height * this.mapScale);

    if (this.avatarFloor == this.state.curFloorInd)
      this.drawAvatar(ctx, this.avatarPos);
  }

  componentDidMount(): void {
    this.switchToFloor(this.props.socket.mapConfig.minimapInfo.defFloor);
  }

  switchToFloor( floorInd: number ): void {
    this.setState({ curFloorInd: floorInd }, ()=>{
      this.updateCanvas();
      this.updateImgPos();
    });
  }

  setAvatar( pos: Vec2, floor: number) {
    this.avatarPos = pos;
    this.avatarFloor = floor;
    this.updateCanvas();
  }

  toWorld( pos: Vec2, floorIndex: number ): Vec3 {
    let hPos = (new Vec2(pos.x, pos.y)).sub(this.imgStartPos).mul(1 / this.scaleCoef).add(this.props.socket.mapConfig.minimapInfo.modelStartPos);

    return new Vec3(hPos.x, floorIndex, hPos.y);
  }

  toMap( pos: Vec3 ): Vec2 {
    let hPos = new Vec2(pos.x, pos.z);

    return hPos.sub(this.props.socket.mapConfig.minimapInfo.modelStartPos).mul(this.scaleCoef).add(this.imgStartPos);
  }

  render() {
    return (
      <div>
        <div className="flexRow">
          <canvas ref={this.state.mapRef} width={200} height={200} style={{
            border: '0.2em dashed var(--color2)',
            margin: '0.3em',
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
          }} onMouseDown={(e)=>{
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
          }} onMouseUp={(e)=>{
            if (this.mouseX == e.clientX && this.mouseY == e.clientY)
            {
              const pos = (new Vec2(e.nativeEvent.offsetX, e.nativeEvent.offsetY)).sub(this.mapOffset).mul(1 / this.mapScale);
              this.props.callbacks.onclick(this, this.state.curFloorInd, pos);
            }
          }}/>
          {this.props.socket.mapConfig.minimapInfo.floorCount > 1 && <div className="flexColumn">
            {this.props.socket.mapConfig.minimapInfo.floors.map(( f: FloorInfo )=>{
              return (<input type="button" className={this.state.curFloorInd == f.floorIndex ? "active" : ""} value={f.floorIndex} onClick={()=>{
                this.switchToFloor(f.floorIndex);
              }}/>);
            })}
          </div>}
        </div>
      </div>
    );
  }
}

