import { renderC } from "./component";
import { Minimap } from "./components/minimap";
import { Vec2 } from "./system/math";

const hasAdminRights = true;

renderC('test-container', <>
  <div style={{
    position: 'absolute',
    backgroundColor: 'var(--bg-color)',
    border: '0.2em solid var(--bg-color)',
    padding: '0.5em',
  }}>
    <h2> Minimap window</h2>
    <Minimap mapInfo={{
      name: 'minimap',
      firstFloor: -1,
      floorCount: 3,
      defFloor: -1,
      imgStartPos: new Vec2(0, 0),
      imgEndPos: new Vec2(1059, 781),
      modelStartPos: new Vec2(1, 1),
      modelEndPos: new Vec2(1, 1),
      floors: [
        {
          fileName: 'minimap/pml30map/f-1.png',
          floorIndex: -1,
        },
        {
          fileName: 'minimap/pml30map/f0.png',
          floorIndex: 0,
        },
        {
          fileName: 'minimap/pml30map/f1.png',
          floorIndex: 1,
        },
        {
          fileName: 'minimap/pml30map/f2.png',
          floorIndex: 2,
        },
        {
          fileName: 'minimap/pml30map/f3.png',
          floorIndex: 3,
        },
        {
          fileName: 'minimap/pml30map/f4.png',
          floorIndex: 4,
        },
      ],
    }} callbacks={{
      onclick: ( minimap: Minimap, floorIndex: number, pos: Vec2 )=>{
        console.log(`On click ${floorIndex} pos: [${pos.x}, ${pos.y}]`);
        minimap.setAvatar(pos);
      }
    }}/>
    {hasAdminRights && <>
      <input type="button" value="Go to editor" onClick={()=>{
          window.location.href = "./editor.html" + window.location.search;
      }}/>
      <input type="button" value="Go to server" onClick={()=>{
          window.location.href = "./server.html" + window.location.search;
      }}/>
    </>}
  </div>
</>);