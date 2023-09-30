import { MongoDB } from "./mongodb";
import { FloorInfo, MinimapInfo } from "./map_config";
import { Vec2, Vec3 } from "../src/system/linmath";
import { MapConfig } from "./map_config";
import { FtpConnection } from "./storage";
import { Socket } from "socket.io";

const defaultMapName = 'pml30map';

export function LogMsg( msgName, input, output ) {
  console.log(`<--- MESSAGE '${msgName}' --->`);
  console.log("INPUT:");
  console.log(input);
  console.log("OUTPUT:");
  console.log(output);
}

// Minimap edit request

export enum MinimapEditReqType {
  addFloor = 'addFloor',
  delFloor = 'delFloor',
  setImgPos = 'setImgPos',
  setModelPos = 'setModelPos',
  setFloorImgPos = 'setFloorImgPos',
}
export enum MinimapPosType {
  Start = 'Start',
  End = 'End',
}

export interface MinimapSetPosData {
  floor?: number,
  posType: MinimapPosType,
  pos: Vec2,
}

export interface MinimapEditReq {
  type: MinimapEditReqType,
  data: number | MinimapSetPosData
}

export class Client {
  accessLevel: number;
  socket;
  db;
  dbName: string;
  mongodb: MongoDB;
  curMapConfig: MapConfig = undefined;

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

  constructor( ftpStorage: FtpConnection, mapsConfig: MapConfig[], saveConfig: ()=>void, newMongo: MongoDB, socket, newAccessLevel: number ) {
  
    this.mongodb = newMongo;
    console.log(`Client connected with id: ${socket.id}`);

    this.accessLevel = newAccessLevel;
    this.socket = socket;

    // Map
    this.dbName = socket.request._query.map != undefined ? this.mongodb.dbs[socket.request._query.map] != undefined ? socket.request._query.map : defaultMapName : defaultMapName;
    console.log("Active map - " + this.dbName);
    this.db = this.mongodb.dbs[this.dbName];

    console.log(this.dbName);
    for (let i = 0; i < mapsConfig.length; i++)
      if (mapsConfig[i].name == this.dbName)
      {
        this.curMapConfig = mapsConfig[i];
        break;
      }
    
    // Minimap
    socket.on("editMinimap", ( req: MinimapEditReq, res )=>{
      var result: boolean = false;
      var floorIndex: number = 0;
      var setPosData: MinimapSetPosData = undefined;

      switch (req.type) {
        case MinimapEditReqType.addFloor:
          floorIndex = req.data as number;
          
          result = true;
          for (let i = 0; i < this.curMapConfig.minimapInfo.floors.length; i++)
            if (this.curMapConfig.minimapInfo.floors[i].floorIndex == floorIndex) {
              result = false;
              break;
            }
          if (!result)
            break;

          this.curMapConfig.minimapInfo.floors.push({
            floorIndex: floorIndex,
            fileName: `imgs/minimap/f${floorIndex}.png`,
          });
          this.curMapConfig.minimapInfo.floorCount++;
          if (floorIndex < this.curMapConfig.minimapInfo.firstFloor)
            this.curMapConfig.minimapInfo.firstFloor = floorIndex;
          result = true;
          break;
        case MinimapEditReqType.delFloor:
          floorIndex = req.data as number;

          console.log("Del floor");
          console.log(this.curMapConfig.minimapInfo.floors);
          for (let i = 0; i < this.curMapConfig.minimapInfo.floors.length; i++)
            if (this.curMapConfig.minimapInfo.floors[i].floorIndex == floorIndex) {
              result = true;
              this.curMapConfig.minimapInfo.floors.splice(i, 1);
              this.curMapConfig.minimapInfo.floorCount--;
              if (this.curMapConfig.minimapInfo.floorCount == 0) {
                this.curMapConfig.minimapInfo.firstFloor = 0;
                break;
              }

              if (this.curMapConfig.minimapInfo.firstFloor == floorIndex) {
                var lowestFloor = this.curMapConfig.minimapInfo.floors[0].floorIndex;
                this.curMapConfig.minimapInfo.floors.map((e)=>{
                  if (e.floorIndex < lowestFloor)
                    lowestFloor = e.floorIndex;
                });
                this.curMapConfig.minimapInfo.firstFloor = lowestFloor;
              }
              break;
            }
          break;
        case MinimapEditReqType.setFloorImgPos:
          setPosData = req.data as MinimapSetPosData;

          for (let f in this.curMapConfig.minimapInfo.floors)
            if (this.curMapConfig.minimapInfo.floors[f].floorIndex == setPosData.floor)
            {
              result = true;
              switch (setPosData.posType) {
                case MinimapPosType.Start:
                  this.curMapConfig.minimapInfo.floors[f].startPos = setPosData.pos;
                  break;
                case MinimapPosType.End:
                  this.curMapConfig.minimapInfo.floors[f].endPos = setPosData.pos;
                  break;
              }
              break;
            }
          break;
        case MinimapEditReqType.setImgPos:
          setPosData = req.data as MinimapSetPosData;

          result = true;
          switch (setPosData.posType) {
            case MinimapPosType.Start:
              this.curMapConfig.minimapInfo.imgStartPos = setPosData.pos;
              break;
            case MinimapPosType.End:
              this.curMapConfig.minimapInfo.imgEndPos = setPosData.pos;
              break;
          }
          break;
        case MinimapEditReqType.setModelPos:
          setPosData = req.data as MinimapSetPosData;

          result = true;
          switch (setPosData.posType) {
            case MinimapPosType.Start:
              this.curMapConfig.minimapInfo.modelStartPos = setPosData.pos;
              break;
            case MinimapPosType.End:
              this.curMapConfig.minimapInfo.modelEndPos   = setPosData.pos;
              break;
          }
          break;
      }

      if (result)
        saveConfig();

      LogMsg("editMinimap", req, result);
      res(result);
    });
    
    // Base requests
    
    socket.on("ping", ( value, res )=>{
      res(value);
    });

    socket.on("getAccessLevelReq", (res)=>{
      LogMsg("getAccessLevelReq", "", this.accessLevel);
      res(this.accessLevel);
    });

    socket.on("getAllMapsReq", (res)=>{
      var maps: string[] = mapsConfig.map((e)=>{ return e.name; });
      LogMsg("getAllMapsReq", "", maps);
      res(maps);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected with id: ${socket.id}`);
    });

    // Minimap requests
    socket.on("getMapConfigReq", ( res )=>{
      LogMsg("getMapConfigReq", "", this.curMapConfig);
      res(this.curMapConfig);
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
