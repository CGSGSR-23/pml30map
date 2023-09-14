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
import { Vec2 } from "../src/system/math";
import { MongoDB } from "./mongodb";
import { Client, MapInfo } from "./client";

const app = express();
app.use(morgan("combined"));
app.use(fileupload());

const mapsConfig: MapInfo[] = [
  {
    name: "pml30map",
    dbName: "pml30map",
    minimapInfo: {
      name: 'minimap',
      firstFloor: -1,
      floorCount: 3,
      defFloor: -1,
      imgStartPos: new Vec2(0, 0),
      imgEndPos: new Vec2(1059, 781),
      modelStartPos: new Vec2(1, 1),
      modelEndPos: new Vec2(1, 1),
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
  }
];

//app.use('/bin/models/worldmap', (req, res, next )=>{
//  res.sendFile(path.normalize(__dirname + `/../bin/models/${availableDB[curDBIndex].name}.obj`));
//});

app.use('/bin', express.static("../bin"));

const enableKeys: number = 1; // 0 - no check
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

async function main() {
  const server = http.createServer(app);
  const io = new Server(server);
  var DB = new MongoDB;

  await DB.init("mongodb+srv://doadmin:i04J9b2t1X853Cuy@db-mongodb-pml30-75e49c39.mongo.ondigitalocean.com/admin?tls=true&authSource=admin", mapsConfig.map((e)=>{ return e.dbName; }));
  
  // For test
  io.on("connection", (socket) => {
    new Client(mapsConfig, DB, socket, getAccessLevel(socket.request));
  });

  server.listen(3047, () => {
    console.log(`Server started on port ${server.address().port}`);
  });
}

main();
