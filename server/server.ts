const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const fileupload = require('express-fileupload');
import { Vec2 } from "../src/system/linmath";
import { MongoDB } from "./mongodb";
import { Client } from "./client";
import { Config, MapConfig } from "./map_config";
//import * as fs from "fs";  
const fs = require("fs");
import { FtpConnection, LocalConnection, Connection } from "./storage";
// import { Server } from "socket.io";

const app = express();
app.use(morgan("combined"));
app.use(fileupload());

/* Server configuration data. */
interface ServerConfigData {
  serverPort: number,
  useLocalStorage: boolean;
  localStoragePath: string | undefined;
  databaseURL: string;
  ftpStorageData: { url: string, login: string, password: string, root: string } | undefined,
}

function readConfigFile(path: string): ServerConfigData | null {
  let rawConfig: ServerConfigData;
  try {
    rawConfig = JSON.parse(fs.readFileSync(path, "utf-8")) as ServerConfigData;
  } catch (error) {
    return null;
  }

  const defaultConfig: ServerConfigData = {
    serverPort: 3047,
    useLocalStorage: true,
    localStoragePath: ".ftpData",
    databaseURL: "",
    ftpStorageData: { url: "", login: "", password: "", root: "" },
  };

  let resultConfig = {};
  for (let [key, value] of Object.entries(defaultConfig)) {
    if (rawConfig[key] === undefined || typeof(rawConfig[key]) !== typeof(defaultConfig[key])) {
      resultConfig[key] = defaultConfig[key];
    } else {
      resultConfig[key] = rawConfig[key];
    }
  }

  return resultConfig as ServerConfigData;
} /* readConfigFile */

// read server configuration file
const serverConfig = readConfigFile("../config/server_config.json");

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

  let fileStorage: Connection;
  if (serverConfig.useLocalStorage) {
    fileStorage = new LocalConnection("../" + serverConfig.localStoragePath);
  } else {
    console.log('initializing FTP connection...');
    let connection = new FtpConnection(serverConfig.ftpStorageData.url, serverConfig.ftpStorageData.login, serverConfig.ftpStorageData.password);
    connection.setRootPath(serverConfig.ftpStorageData.root);
    fileStorage = connection;
  }

  const config: Config = JSON.parse((await fileStorage.downloadFile(configFileName)).toString());

  console.log('---------------');
  console.log(JSON.stringify(config));
  console.log('---------------');

  const saveConfig = async ()=>{
    const cStr = JSON.stringify(config);
    console.log("SAVE CONFIG:");
    console.log(cStr);

    await fileStorage.uploadFile(Buffer.from(cStr), "", configFileName);
  };
  
  // await DB.init("mongodb+srv://doadmin:i04J9b2t1X853Cuy@db-mongodb-pml30-75e49c39.mongo.ondigitalocean.com/admin?tls=true&authSource=admin", config.maps.map((e)=>{ return e.dbName; }));
  // !!!LOCAL
  await DB.init(serverConfig.databaseURL, config.maps.map((e)=>{ return e.dbName; }));

  // For test
  io.on("connection", async (socket) => {
    console.log('New connection');
    
    // console.log(JSON.parse(config.toString()));
    // console.log(JSON.stringify(mapsConfig));
    new Client(config, saveConfig, DB, socket, getAccessLevel(socket.request));
  });
  
  // image storage
  app.post("/upload", async ( req, res )=>{
    console.log("IMAGE UPLOAD");

    const imgData = req.files.file.data;
    const imgName = req.files.file.name;
    const imgPath = req.query.path;

    // console.log(img);
    const result = await fileStorage.uploadFile(imgData, imgPath, imgName);
    console.log('upload ended');
    res.send(result);
  });

  app.post("/saveConfig", async ()=>{
    saveConfig();
  });

  app.get("/download", async ( req, res )=>{
    res.send(await fileStorage.downloadFile((req.query.file as string).split('?')[0]));
  });


  // app.use((req, res, next) => {
  //   console.log('CORS ====== ' + req.url);
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  //   next();
  // });

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
            // neve gona giv'u up
            res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
          else
            res.sendStatus(404);
          return;
        }
      }
    }
    next(); 
  }, express.static("../dist"));
  
  server.listen(serverConfig.serverPort, () => {
    console.log(`Server started on port ${server.address().port}`);
  });
}

ioInit();
//ftpInit();