import { Connection, URI, NodeData, ConnectionData } from "./socket";
import { Vec3 } from "./system/linmath";
import { MapConfig } from "../server/map_config";
import { loadImg } from "./components/support";
import fetchAbsolute from "fetch-absolute";

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
    this.mapConfig = await this.getMapConfig();
  }

  async loadImg( fileName: string ) {
    console.log("1");
    
    var img = new Image();
    //console.log(this.mapConfig.storageURL + fileName);
    img.src = "download?file=" + "maps/" + this.mapConfig.name + "/" + fileName;
    return new Promise( async (resolve) => {
      img.onload = ()=>{
        console.log("SDFJSDFLK");
        resolve(img);
      };
      img.onabort = ()=>{
        console.log('FuCK');
      }
    });
  }

  async loadRes( fileName: string ) {
    console.log(this.mapConfig.storageURL + fileName);
    return fetchAbsolute(this.mapConfig.storageURL + fileName);
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
    return this.socket.send("getNodeReq", uri.id) as Promise<NodeData>;
  }


  async getNodeConnections( uri: URI ): Promise<ConnectionData[]> {
    let cA = await this.socket.send("getNodeConnectionsReq", uri.id) as ConnectionData[];

    let outA = [];
    
    for (let i = 0; i < cA.length; i++)
      outA[i] = [new URI(cA[i].id1), new URI(cA[i].id2)];
    return outA;
  }

  async getNeighbours( uri: URI): Promise<URI[]> {
    return URI.fromArray(await this.socket.send("getNeighboursReq", uri.id));
  }

  async getDefNodeURI(): Promise<URI> {
    return new URI(await this.socket.send("getDefNodeURIReq"));
  }

  async getNearest( pos: Vec3, floor: number ) {
    return new URI(await this.socket.send("getNearestReq", pos, floor));
  }
}