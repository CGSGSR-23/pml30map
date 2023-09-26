import { Viewer } from "./components/viewer"
import { renderC } from "./component"
//import { Connection } from "./socket";
import { MapView } from "./map_view";

//const hasAdminRights = true;
//

async function main() {
  const socket = new MapView();
  socket.init();

  console.log(await socket.ping(47));

  renderC('out-container', (<Viewer socket={socket} accessLevel={await socket.getAccessLevel()}/>));  
}

main();
