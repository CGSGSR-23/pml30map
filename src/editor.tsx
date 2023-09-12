import { renderC } from "./component";
import { Minimap } from "./components/minimap";
import { Unit, System } from "./system/system";



renderC('test-container', <>
  <div>
    <Minimap/>
  </div>
</>);