import { io } from "socket.io-client";
import { Vec3 } from "./system/math";

export class URI {
  id: Uint8Array;

  toStr(): string {
    if (this.id != undefined)
      return "[" + this.id.toString() + "]";
  }

  fromStr( str: string ) {
    this.id = new Uint8Array(JSON.parse(str));
  }

  static fromArray( inA ) {
    let outA = [];
    for (let i = 0; i < inA.length; i++)
      outA[i] = new URI(inA[i]);
    return outA;
  }
  

  constructor( data ) {
    // console.log("URI in:");
    // console.log(data);
    if (typeof(data) == 'string')
      this.fromStr(data);
    else if (data instanceof ArrayBuffer)
      this.id = new Uint8Array(data);
    else if (data instanceof Uint8Array)
      this.id = data;
    else
    {
      console.log("WRONG URI TYPEL:");
      console.log(data);
    }
  }
} /* End of 'URI' class */

interface NodeData {
  name: string,
  imageName: string,
  pos: Vec3,
}

interface ConnectionData {
  id1: Uint8Array,
  id2: Uint8Array,
}

export class Connection {
  socket;

  constructor() {
    console.log("Connected with server");

    this.socket = io();

    this.socket.on("connect", () => {
      console.log("SOCKET ID: " + this.socket.id);

    });
  }

  async send( req, ...args ) {
    return new Promise((resolve) => {
      this.socket.emit(req, ...args, ( response ) => {
        console.log("TEST OUT:");
        console.log(response);
        resolve(response);
      });
    });
  }

  async ping( value: number ): Promise<number> {
    return this.send("ping", value) as Promise<number>;
  }

  async getNode( uri: URI ): Promise<NodeData> {
    return this.send("getNodeReq", uri.id) as Promise<NodeData>;
  }

  async addNode( data: NodeData ): Promise<URI> {
    return new URI(await this.send("addNodeReq", data));
  }

  async updateNode( uri: URI, data: NodeData ): Promise<boolean> {
    return this.send("updateNodeReq", uri.id, data) as Promise<boolean>;
  }

  async getAllNodes(): Promise<URI[]> {
    return URI.fromArray( await this.send("getAllNodesReq"));
  }

  async getAllConnections(): Promise<ConnectionData[]> {
    let cA = await this.send("getAllConnectionsReq") as ConnectionData[];

    let outA = [];

    for (let i = 0; i < cA.length; i++)
      outA[i] = [new URI(cA[i].id1), new URI(cA[i].id2)];
    return outA;
  }

  async getAllNodesData() {
    return this.send("getAllNodesDataReq");
  }

  async delNode( node: URI ) {
    return this.send("delNodeReq", node);
  }

  async connectNodes( uri1: URI, uri2: URI ) {
    return this.send("connectNodesReq", [uri1.id, uri2.id]);
  }

  async getNodeConnections( uri: URI ): Promise<ConnectionData[]> {
    let cA = await this.send("getNodeConnectionsReq", uri.id) as ConnectionData[];

    let outA = [];
    
    for (let i = 0; i < cA.length; i++)
      outA[i] = [new URI(cA[i].id1), new URI(cA[i].id2)];
    return outA;
  }

  async getNeighbours( uri: URI): Promise<URI[]> {
    return URI.fromArray(await this.send("getNeighboursReq", uri.id));
  }

  async disconnectNodes( uri1: URI, uri2: URI ): Promise<boolean> {
    return this.send("disconnectNodesReq", [uri1.id, uri2.id]) as Promise<boolean>;
  }

  async setDefNodeURI( uri: URI ): Promise<boolean> {
    return this.send("setDefNodeURIReq", uri.id) as Promise<boolean>;
  }

  async getDefNodeURI(): Promise<URI> {
    return new URI(await this.send("getDefNodeURIReq"));
  }

  async clearDB() {
    return this.send("clearDBReq");
  }

  async getDB() {
    return this.send("getDBReq");
  }

  async saveDB( outFileName ) {
    let dbText = JSON.stringify(await this.getDB());
  
    var a = document.createElement('a');
    var file = new Blob([dbText], {type: "text/plain;charset=utf-8"});
    a.href = URL.createObjectURL(file);
    a.download = outFileName;
    a.click();
    return dbText;
  }

  async loadDB( db ) {
    return this.send("loadDBReq", db);
  }

  async addDB( db ) {
    return this.send("addDataReq", db);
  }
  async getNearest( pos, floor ) {
    return new URI(await this.send("getNearestReq", pos, floor));
  }
} /* Connection */
