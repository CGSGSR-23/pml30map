import { Viewer } from "./components/viewer"
import { renderC } from "./component"
import { Connection } from "./socket";

//const hasAdminRights = true;
//

async function main() {
  const socket = new Connection();

  console.log('Start');
  console.log(await socket.ping(47));
  console.log(await socket.getAccessLevel());

  renderC('out-container', (<Viewer socket={socket} accessLevel={await socket.getAccessLevel()}/>));  
}

main();
