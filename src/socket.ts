import { io, Socket } from "socket.io-client";
import { Vec3 } from "./system/linmath";
import { getQuery } from "./components/support";


export interface ServerNodeData {
  name: string,
  skysphere: { path: string, rotation: number },
  position: Vec3,
  floor: number,
}

export interface NodeData {
  uri: URI;
  name: string;
  skysphere: { path: string, rotation: number },
  position: Vec3,
  floor: number,
}

export interface ServerConnectionData {
  id1: Uint8Array,
  id2: Uint8Array,
}

export interface ConnectionData {
  uri: URI;
  first: URI;
  second: URI;
};

export interface EventsMap {
  [event: string]: any;
}
export type EventNames<Map extends EventsMap> = keyof Map & (string | symbol);

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

export class Connection {
  socket: Socket;

  constructor() {
    console.log("Connected with server");

    this.socket = io({
      query: getQuery(),
    });

    this.socket.on("connect", () => {
      console.log("SOCKET ID: " + this.socket.id);

    });
  }

  async send( req: string, ...args) {
    return new Promise((resolve) => {
      this.socket.emit(req, ...args, ( response ) => {
        resolve(response);
      });
    });
  }
} /* Connection */

