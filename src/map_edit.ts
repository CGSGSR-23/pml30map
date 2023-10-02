import { Connection, URI, NodeData, ConnectionData, ServerNodeData, ServerConnectionData } from "./socket";
import { Vec3 } from "./system/linmath";
import { MapView } from "./map_view";
import { MinimapEditReq } from "../server/client";

// interface EditClientToServerEvents {
//   addNode: ( data: NodeData )=>URI;
//   updateNode: ( uri: URI, data: NodeData )=>boolean;
//   getAllNodes: ()=>URI[];
//   getAllConnections: ()=>ConnectionData[];
//   getAllNodesData: ()=>any;
//   delNode: ( node: URI )=>boolean;
//   connectNodes: ( uri1: URI, uri2: URI )=>boolean;
//   disconnectNodes: ( uri1: URI, uri2: URI )=>boolean;
//   setDefNodeURI: ( uri: URI )=>boolean;
//   clearDB: ()=>boolean;
//   getDB: ()=>any;
//   saveDB: ( outFileName: string )=>boolean;
//   loadDB: ( db: any )=>boolean;
//   addDB: ( db: any )=>boolean;
// };
// 
// interface EditServerToClientEvents {
// };

export class MapEdit extends MapView {

  constructor() {
    super();
  }

  // Minimap edit req
  async editMinimap( req: MinimapEditReq ): Promise<boolean> {
    return (await this.socket.send("editMinimap", req)) as boolean;
  }

  async addNode( data: ServerNodeData ): Promise<URI> {
    return new URI(await this.socket.send("addNodeReq", data));
  }

  async updateNode( uri: URI, data: NodeData ): Promise<boolean> {
    let serverData: ServerNodeData = {
      name: data.name,
      skysphere: { path: data.skysphere.path, rotation: data.skysphere.rotation },
      position: data.position,
      floor: data.floor,
    };

    return this.socket.send("updateNodeReq", uri.id, serverData) as Promise<boolean>;
  }

  async getAllNodes(): Promise<URI[]> {
    return URI.fromArray( await this.socket.send("getAllNodesReq"));
  }

  async getAllConnections(): Promise<ConnectionData[]> {
    let cA = await this.socket.send("getAllConnectionsReq") as ServerConnectionData[];

    let outA = [];

    this.getDefNodeURI()
    for (let i = 0; i < cA.length; i++)
      outA[i] = {
        uri: null,
        first: new URI(cA[i].id1),
        second: new URI(cA[i].id2),
      };
    return outA;
  }

  async getAllNodesData() {
    return this.socket.send("getAllNodesDataReq");
  }

  async delNode( node: URI ) {
    return this.socket.send("delNodeReq", node);
  }

  async connectNodes( uri1: URI, uri2: URI ) {
    return this.socket.send("connectNodesReq", [uri1.id, uri2.id]);
  }

  async disconnectNodes( uri1: URI, uri2: URI ): Promise<boolean> {
    return this.socket.send("disconnectNodesReq", [uri1.id, uri2.id]) as Promise<boolean>;
  }

  async setDefNodeURI( uri: URI ): Promise<boolean> {
    return this.socket.send("setDefNodeURIReq", uri.id) as Promise<boolean>;
  }

  async clearDB() {
    return this.socket.send("clearDBReq");
  }

  async getDB() {
    return this.socket.send("getDBReq");
  }

  async saveDB( outFileName: string ) {
    let dbText = JSON.stringify(await this.getDB());
  
    var a = document.createElement('a');
    var file = new Blob([dbText], {type: "text/plain;charset=utf-8"});
    a.href = URL.createObjectURL(file);
    a.download = outFileName;
    a.click();
    return dbText;
  }

  async loadDB( db ) {
    return this.socket.send("loadDBReq", db);
  }

  async addDB( db ) {
    return this.socket.send("addDataReq", db);
  }
}