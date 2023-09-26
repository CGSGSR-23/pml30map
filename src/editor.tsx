import { renderC } from "./component"
//import { Connection } from "./socket";
import { Editor } from "./components/editor";
import { MapEdit } from "./map_edit";

async function main() {
  const socket = new MapEdit();
  socket.init();

  console.log('Start');
  console.log(await socket.ping(47));

  renderC('out-container', (<Editor socket={socket}/>));  
}

main();
