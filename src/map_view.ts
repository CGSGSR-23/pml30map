import { Connection, URI, ServerNodeData, ServerConnectionData, NodeData, ConnectionData } from "./socket";
import { Vec3 } from "./system/linmath";
import { MapConfig } from "../server/map_config";
import { loadImg } from "./components/support";

// interface ViewClientToServerEvents {
//   ping: ( value: number )=>number;
//   getAccessLevel: ()=>number;
//   getNode: ( uri: URI )=>NodeData;
//   getNodeConnections: ( uri: URI )=>ConnectionData[];
//   getNeighbours: ( uri: URI )=>URI[];
//   getDefNodeURI: ()=>URI;
//   getNearest: ( pos: Vec3, floor: number )=>URI;
// };
// 
// interface ViewServerToClientEvents {};

export class MapView {
  socket: Connection;
  mapConfig: MapConfig;

  constructor() {
    this.socket = new Connection();
  }

  async init() {
    await this.updateConfig();
  }

  getStoragePath( path: string ): string {
    return "download?file=" + "maps/" + this.mapConfig.name + "/" + path;
  }

  async loadImg( fileName: string ): Promise<HTMLImageElement> {
    console.log("1");
    
    var img = new Image();
    img.src = this.getStoragePath(fileName);
    return new Promise( async (resolve) => {
      img.onload = ()=>{
        // Tut byl 'SDFJSDFLK'
        resolve(img);
      };
      img.onabort = ()=>{
        // Tut byl 'FuCK'
      }
    });
  }

  async loadRes( fileName: string ) {
    return fetch(this.getStoragePath(fileName));
  }

  async updateConfig(): Promise<void> {
    this.mapConfig = await this.getMapConfig();
  }

  async getMapConfig(): Promise<MapConfig> {
    return this.socket.send("getMapConfigReq") as Promise<MapConfig>;
  }

  async ping( value: number ): Promise<number> {
    return this.socket.send("ping", value) as Promise<number>;
  }

  async getAccessLevel(): Promise<number> {
    return this.socket.send("getAccessLevelReq") as Promise<number>;
  }

  async getNode( uri: URI ): Promise<NodeData> {
    return new Promise<NodeData>(async (resolve, reject) => {
      let data = await this.socket.send("getNodeReq", uri.id) as ServerNodeData;

      resolve({
        uri: uri,
        name: data.name,
        skysphere: data.skysphere,
        position: Vec3.fromObject(data.position),
        floor: data.floor,
      });
    });
  }

  async getNodeConnections( uri: URI ): Promise<ConnectionData[]> {
    let cA = await this.socket.send("getNodeConnectionsReq", uri.id) as ServerConnectionData[];

    let outA = [];
    
    for (let i = 0; i < cA.length; i++)
      outA[i] = {
        uri: new URI([]), // !!!ACHTUNG!!!
        first: cA[i].id1,
        second: cA[i].id1,
      };
    return outA;
  }

  async getNeighbours( uri: URI): Promise<URI[]> {
    return URI.fromArray(await this.socket.send("getNeighboursReq", uri.id));
  }

  async getNeighboursData( uri: URI): Promise<URI[]> {
    return URI.fromArray(await this.socket.send("getNeighboursDataReq", uri.id));
  }


  async getDefNodeURI(): Promise<URI> {
    return new URI(await this.socket.send("getDefNodeURIReq"));
  }

  async getNearest( pos: Vec3, floor: number ) {
    return new URI(await this.socket.send("getNearestReq", pos, floor));
  }
}