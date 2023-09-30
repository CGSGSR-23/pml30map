const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const fileupload = require('express-fileupload');
import { Vec2 } from "../src/system/linmath";
import { MongoDB } from "./mongodb";
import { Client } from "./client";
import { MapConfig } from "./map_config";
import * as fs from "fs";  
import { FtpConnection } from "./storage";

const app = express();
app.use(morgan("combined"));
app.use(fileupload());

const mapsConfig: MapConfig[] = [
  {
    name: "pml30map",
    dbName: "pml30map",
    storageURL: "http://pml30map.rf.gd/storage/maps/pml30map/",
    minimapInfo: {
      name: 'PML 30',
      firstFloor: -1,
      floorCount: 3,
      defFloor: -1,
      imgStartPos: new Vec2(9, 31),
      imgEndPos: new Vec2(969, 758),
      modelStartPos: new Vec2(-31.369, -15.889),
      modelEndPos: new Vec2(11.499, 16.445),
      floors: [
        {
          fileName: 'imgs/minimap/f-1.png',
          floorIndex: -1,
        },
        {
          fileName: 'imgs/minimap/f0.png',
          floorIndex: 0,
        },
        {
          fileName: 'imgs/minimap/f1.png',
          floorIndex: 1,
        },
        {
          fileName: 'imgs/minimap/f2.png',
          floorIndex: 2,
        },
        {
          fileName: 'imgs/minimap/f3.png',
          floorIndex: 3,
        },
        {
          fileName: 'imgs/minimap/f4.png',
          floorIndex: 4,
        },
      ],
    },
  },
  {
    name: "camp23map",
    dbName: "camp23map",
    storageURL: "http://pml30map.rf.gd/storage/camp23map/",
    minimapInfo: {
      name: 'Sum 23 camp',
      firstFloor: 0,
      floorCount: 1,
      defFloor: 0,
      imgStartPos: new Vec2(198, 40),
      imgEndPos: new Vec2(527, 850),
      modelStartPos: new Vec2(-28.336, -34.717),
      modelEndPos: new Vec2(-7.370, 17.2),
      floors: [
        {
          fileName: 'imgs/minimap/f0.png',
          floorIndex: 0,
        },
      ],
    },
  }
  
];


const enableKeys: number = 2;
                      // 0 - no check
                      // 1- simple 404 page
                      // 2 - redirect to rickroll

const studentKey = "R1BNTDMwTUFQX0FDQ0VTU19LRVlfQURNSU4=";
const adminKey = "R1BNTDMwTUFQX0FDQ0VTU19LRVlfU1RVREVOVA==";

const pages: { page: string,  source: string, accessLevel: number }[] = [
  {
    page: '/server.html',
    source: '../dist/server.html',
    accessLevel: 2,
  },
  {
    page: '/editor.html',
    source: '../dist/editor.html',
    accessLevel: 2,
  },
  {
    page: '/viewer.html',
    source: '../dist/editor.html',
    accessLevel: 0,
  },  
];

function getAccessLevel( req ): number {
  var accessLevel = 0;

  var query = req._query;

  if (query == undefined)
    query = req.query;
  if (query == undefined)
    return 0;

  // 0 - guest
  // 1 - student
  // 2 - admin

  if (query.key === studentKey)
    accessLevel = 1; // Student
  else if (query.key === adminKey)
    accessLevel = 2; // Admin
    
  console.log('Access level: ' + accessLevel);
  return accessLevel;
}

async function ioInit() {
  const server = http.createServer(app);
  const io = new Server(server);
  const DB = new MongoDB;
  const configFileName = 'config.json';
  const ftpStorage = new FtpConnection("ftpupload.net", "if0_35095022", "e9cdJZmBzH");

  await DB.init("mongodb+srv://doadmin:i04J9b2t1X853Cuy@db-mongodb-pml30-75e49c39.mongo.ondigitalocean.com/admin?tls=true&authSource=admin", mapsConfig.map((e)=>{ return e.dbName; }));
  //await ftpStorage.connect();
  ftpStorage.setRootPath("pml30map.rf.gd/htdocs/storage/");
  const config = JSON.parse((await ftpStorage.downloadFile(configFileName)).toString());

  console.log('---------------');
  console.log(JSON.stringify(config));
  console.log('---------------');
  const saveConfig = async ()=>{
    const cStr = JSON.stringify(config);
    console.log("SAVE CONFIG:");
    console.log(cStr);

    await ftpStorage.uploadFile(Buffer.from(cStr), "", configFileName);
  };
  
  // For test
  io.on("connection", async (socket) => {
    console.log('New connection');
    
    // console.log(JSON.parse(config.toString()));
    // console.log(JSON.stringify(mapsConfig));
    new Client(ftpStorage, config, saveConfig, DB, socket, getAccessLevel(socket.request));
  });
  
  // image storage
  app.post("/upload", async ( req, res )=>{
    console.log("IMAGE UPLOAD");

    const imgData = req.files.file.data;
    const imgName = req.files.file.name;
    const imgPath = req.query.path;

    // console.log(img);
    const result = await ftpStorage.uploadFile(imgData, imgPath, imgName);
    console.log('upload ended');
    res.send(result);
  });

  app.post("/saveConfig", async ()=>{
    saveConfig();
  });

  app.get("/download", async ( req, res )=>{
    res.send(await ftpStorage.downloadFile((req.query.file as string).split('?')[0]));
  });

  app.use('/bin', express.static("../bin"));

  app.use('/', (req, res, next )=>{
    if (req.path == '/')
    {
      res.redirect('viewer.html');
      return;
    }

    if (enableKeys > 0)
    {
      for (var i = 0; i < pages.length; i++)
      {
        if (req.path != pages[i].page)
          continue;

        if (getAccessLevel(req) < pages[i].accessLevel)
        {
          console.log("Access denied!!!!!!");
          if (enableKeys == 2)
            res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
          else
            res.sendStatus(404);
          return;
        }
      }
    }
    next(); 
  }, express.static("../dist"));
  
  server.listen(3047, () => {
    console.log(`Server started on port ${server.address().port}`);
  });
}

ioInit();
//ftpInit();