import { renderC } from "./component"
import { Connection } from "./socket";
import { Editor } from "./components/editor";

async function main() {
  const socket = new Connection();

  console.log('Start');
  console.log(await socket.ping(47));

  renderC('out-container', (<Editor socket={socket}/>));  
}

main();
