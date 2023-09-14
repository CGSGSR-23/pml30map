import { MongoDB } from "./mongodb";
import { MapSetInfo } from "../src/components/minimap";
import { Vec3 } from "../src/system/math";

export interface MapInfo {
  name: string,
  dbName: string
  minimapInfo: MapSetInfo,
}


export function LogMsg( msgName, input, output ) {
  console.log(`<--- MESSAGE '${msgName}' --->`);
  console.log("INPUT:");
  console.log(input);
  console.log("OUTPUT:");
  console.log(output);
}

export class Client {
  accessLevel: number;
  socket;
  db;
  mongodb: MongoDB;
  
  setupNodeRequests() {
    // Nodes

    this.socket.on("getNodeReq", async ( uri, res )=>{
      let outData = await this.db.getNode(uri);
      LogMsg("getNodeReq", uri, outData);
      res(outData);
    });

    this.socket.on("addNodeReq", async ( data, res )=>{
      let newURI = await this.db.addNode(data);
      LogMsg("addNodeReq", data, newURI);
      res(newURI);
    });

    this.socket.on("updateNodeReq", async ( uri, data, res )=>{
      let result = await this.db.updateNode(uri, data);
    
      if (result.modifiedCount === 1)
        result = true;
      else
        result = false;
      LogMsg("updateNodeReq", {uri, data}, result);
      res(result)
    });

    this.socket.on("delNodeReq", async ( uri, res )=>{
      let result = await this.db.delNode(uri);
      if (result.deletedCount === 1)
        result = true;
      else
        result = false;

      LogMsg("delNodeReq", uri, result);
      res(result);
    });

    // Connections

    this.socket.on("connectNodesReq", async ( uris, res )=>{
      let result = await this.db.addConnection(uris[0], uris[1]);
      LogMsg("connectNodesReq", uris, result);
      res(result);
    });

    this.socket.on("disconnectNodesReq", async ( uris, res )=>{
      let result = await this.db.delConnection(uris[0], uris[1]);
      LogMsg("disconnectNodesReq", uris, result);
      res(result);
    });

    // Graph info

    this.socket.on("getNodeConnectionsReq", async ( uri, res )=>{
      let cs = await this.db.getNodeConnections(uri);
      LogMsg("getNodeConnectionsReq", uri, cs);
      res(cs);
    });

    this.socket.on("getNeighboursReq", async ( uri, res )=>{
      let nNodes = await this.db.getNeighbours(uri);
      LogMsg("getNeighboursReq", uri, nNodes);
      res(nNodes);
    });

    this.socket.on("getAllNodesReq", async ( res )=>{
      let outData = await this.db.getAllNodeURIs();
      LogMsg("getAllNodesReq", "", outData);
      res(outData);
    });

    this.socket.on("getAllNodesDataReq", async ( res )=>{
      let outData = await this.db.getAllNodesData();
      LogMsg("getAllNodesDataReq", "", outData);
      res(outData);
    });

    this.socket.on("getAllConnectionsReq", async ( res )=>{
      let cs = await this.db.getAllConnections();
      LogMsg("getAllConnectionsReq", "", cs);
      res(cs);
    });

    // Def node 

    this.socket.on("setDefNodeURIReq", async ( uri, res )=>{
      let result = await this.db.setDefNodeURI(uri);
      LogMsg("setDefNodeURIReq", uri, result);
      res(result);
    });

    this.socket.on("getDefNodeURIReq", async ( res )=>{
      let outURI = await this.db.getDefNodeURI();
      LogMsg("getDefNodeURIReq", "", outURI);
      res(outURI);
    });
  } /* End of 'setupNodeRequests' function */

  constructor( mapsConfig: MapInfo[], newMongo: MongoDB, socket, newAccessLevel: number ) {
    this.mongodb = newMongo;
    console.log(`Client connected with id: ${socket.id}`);

    var accessLevel = newAccessLevel;
    this.socket = socket;
    console.log('AAAAAAAAAAAAAa');
    console.log(this.mongodb.dbs);
    this.db = this.mongodb.dbs[0];
    if (socket.request._query.map != undefined && this.mongodb.dbs[socket.request._query.map] != undefined)
      this.db = this.mongodb.dbs[socket.request._query.map];
    
    socket.on("ping", (value, res)=>{
      res(value);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected with id: ${socket.id}`);
    });

    // Global DB requests

    socket.on("getAvailableDBs", ( res )=>{
      let names = mapsConfig.map((e)=>{ return e.name; });
      LogMsg("getAvailableDBs", "", names);
      res(names);
    });

    socket.on("getDBInfo", async ( name: string, res )=>{
      let info = {};

      mapsConfig.map((e)=>{
        if (e.name == name)
          info = e;
      });

      LogMsg("getDBInfo", name, info);
      res(info);
    });

    socket.on("switchDB", async ( name, res )=>{
      let isValid = false;

      mapsConfig.map((e)=>{
        if (e.name == name)
          isValid = false;
      });

      if (isValid)
        this.db = this.mongodb.dbs[name];
      LogMsg("switchDB", name, isValid);
      res(isValid);
    });
    
    socket.on("clearDBReq", async ( res )=>{
      let result = await this.db.clearDB();
      LogMsg("getDefNodeURIReq", "", result);
      res(result);
    });

    socket.on("getDBReq", async ( res )=>{
      let db = await this.db.getDB();
      LogMsg("getDefNodeURIReq", "", db);
      res(db);
    });

    socket.on("loadDBReq", async ( db, res )=>{
      let result = await this.db.loadDB(db);
      LogMsg("getDefNodeURIReq", db, result);
      res(result);
    });

    socket.on("addDataReq", async ( db, res )=>{
      let result = await this.db.addDB(db);
      LogMsg("addDataReq", db, result);
      res(result);
    });

    socket.on("getNearestReq", async ( inPos, floor, res )=>{
      //let result = await DB.addDB(db);
      let pos = new Vec3(inPos.x, 0, inPos.z);
      let nodesData = await this.db.getAllNodesData();
      
      if (nodesData.length <= 0)
        return null;
  
      let nearest = nodesData[0];
  
      for (let i = 0; i < nodesData.length; i++)
      {
        let nPos = new Vec3(nearest.position.x, 0, nearest.position.z);
        let iPos = new Vec3(nodesData[i].position.x, 0, nodesData[i].position.z);
      
        if (pos.sub(iPos).length() < pos.sub(nPos).length() && nodesData[i].floor === floor)  
          nearest = nodesData[i];
      }
      let out = nearest._id.id;
      LogMsg("getNearestReq", pos, out);
      res(out);
    });

    this.setupNodeRequests();
  } /* End of 'contsructor' function */

} /* End of 'client' class */
