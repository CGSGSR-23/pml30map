import { renderC } from "./component";
import { Minimap } from "./components/minimap";

renderC('test-container', <>
  <div>
    <Minimap/>
  </div>
</>);