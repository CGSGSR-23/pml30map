const http = require("http");
const express = require("express");
const morgan = require("morgan");
//const ws = require("ws");
//const path = require("path");
const { Server } = require("socket.io");
const fileupload = require('express-fileupload');
//const { MongoDB } = require('./mongodb.ts');
//const { MongoDBCollectionNamespace } = require("mongodb");
//const { allowedNodeEnvironmentFlags } = require("process");
import { Vec2 } from "../src/system/linmath";
import { MongoDB } from "./mongodb";
import { Client, MapInfo } from "./client";
import { ftpInit, getReadable } from "./storage";
import { ftp } from "./storage";
import * as fs from "fs";  
import { StringWriter } from "./storage";

const app = express();
app.use(morgan("combined"));
app.use(fileupload());

const mapsConfig: MapInfo[] = [
  {
    name: "pml30map",
    dbName: "pml30map",
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
          fileName: 'minimap/pml30map/f-1.png',
          floorIndex: -1,
        },
        {
          fileName: 'minimap/pml30map/f0.png',
          floorIndex: 0,
        },
        {
          fileName: 'minimap/pml30map/f1.png',
          floorIndex: 1,
        },
        {
          fileName: 'minimap/pml30map/f2.png',
          floorIndex: 2,
        },
        {
          fileName: 'minimap/pml30map/f3.png',
          floorIndex: 3,
        },
        {
          fileName: 'minimap/pml30map/f4.png',
          floorIndex: 4,
        },
      ],
    },
  },
  {
    name: "camp23map",
    dbName: "camp23map",
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
          fileName: 'minimap/camp23map/f0.png',
          floorIndex: 0,
        },
      ],
    },
  }
  
];

//app.use('/bin/models/worldmap', (req, res, next )=>{
//  res.sendFile(path.normalize(__dirname + `/../bin/models/${availableDB[curDBIndex].name}.obj`));
//});

app.use('/bin', express.static("../bin"));

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

async function ioInit() {
  const server = http.createServer(app);
  const io = new Server(server);
  const DB = new MongoDB;
  const ftpStorage = new ftp;

  await DB.init("mongodb+srv://doadmin:i04J9b2t1X853Cuy@db-mongodb-pml30-75e49c39.mongo.ondigitalocean.com/admin?tls=true&authSource=admin", mapsConfig.map((e)=>{ return e.dbName; }));
  await ftpStorage.connect("ftpupload.net", "if0_35095022", "e9cdJZmBzH");
  
  // For test
  io.on("connection", (socket) => {
    console.log('New connection');
    new Client(mapsConfig, DB, socket, getAccessLevel(socket.request));
  });

  // image storage
  app.post("/upload", async ( req, res )=>{
    console.log("IMAGE UPLOAD");
    const client = await ftpClient;
    const img = req.files.img;
  
    //console.log(img);
    await client.uploadFrom(getReadable(img.data), "camp23map/" + req.files.img.name);
    console.log('upload ended');
    res.send('success');
  });

  server.listen(3047, () => {
    console.log(`Server started on port ${server.address().port}`);
  });
}

const ftpClient = ftpInit();

app.post("/upload", async ( req, res )=>{
  console.log("IMAGE UPLOAD");
  const client = await ftpClient;
  const img = req.files.img;
  const imgName = 'storage/imgs/' + req.query.path + req.files.img.name;

  console.log('Load img to ' + imgName);
  console.log(img);
  await client.uploadFrom(getReadable(img.data), imgName);
  console.log('upload ended');
  res.send('success');
});

app.get("/imgget", async ( req, res )=>{
  console.log("Get img");
  console.log("Get img");
  console.log("Get img");
  const client = await ftpClient;

  const buf = new StringWriter();
  console.log('================');
  await client.downloadTo(buf, "storage/imgs/f2.png");
  console.log('================');
  console.log(buf.getBuf());
  res.send(buf.getBuf());
});
ioInit();
//ftpInit();