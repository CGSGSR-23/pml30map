import React, { createRef } from 'react';
import { Vec2 } from '../system/math';

function loadImg( fileName: string ) {
  var img = new Image();
  img.src = "./bin/imgs/" + fileName;
  return new Promise( async (resolve) => {
    img.onload = ()=>{ resolve(img); };
  });
} /* loadImg */

interface FloorInfo {
  floorIndex: number,
  fileName: string
}

export interface MapSetInfo {
  name: string,

  floorCount: number,
  firstFloor: number,
  defFloor: number,

  imgStartPos: Vec2,
  imgEndPos: Vec2,
  modelStartPos: Vec2,
  modelEndPos: Vec2,

  floors: FloorInfo[]
}

interface MinimapCallBacks {
  onclick: ( minimap: Minimap, floorIndex: number, pos: Vec2 )=>void;
}

interface MinimapProps {
  mapInfo: MapSetInfo;
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

  constructor( props: MinimapProps ) {
    super(props);

    this.state = {
      mapRef: createRef(),
      curFloorInd: props.mapInfo.defFloor,
    };

    props.mapInfo.floors.map(async (f, i)=>{
      this.floorImgs[f.floorIndex] = loadImg(f.fileName);
    });
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
    this.drawAvatar(ctx, this.avatarPos);
  }

  componentDidMount(): void {
    this.switchToFloor(this.props.mapInfo.defFloor);
  }

  switchToFloor( floorInd: number ): void {
    this.setState({ curFloorInd: floorInd }, ()=>{
      this.updateCanvas();
    });
  }

  setAvatar( newPos: Vec2 ) {
    this.avatarPos = newPos;
    this.updateCanvas();
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
          <div className="flexColumn">
            {this.props.mapInfo.floors.map(( f: FloorInfo )=>{
              return (<input type="button" className={this.state.curFloorInd == f.floorIndex ? "active" : ""} value={f.floorIndex} onClick={()=>{
                this.switchToFloor(f.floorIndex);
              }}/>);
            })}
          </div>
        </div>
      </div>
    );
  }
}

