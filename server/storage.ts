const ftp = require("basic-ftp");
const { Readable, Writable } = require("stream");
const fs = require("fs");

class CommandStack {
  stack: Array<()=>Promise<void>> = [];
  isCommitting = false;

  commitCycle() {
    if (this.stack.length > 0)
      this.stack[0]().then(()=>{ this.stack.shift(); }).then(()=>{ this.commitCycle(); });
    else
      this.isCommitting = false;
  }

  commit() {
    if (this.isCommitting == true)
      return;
    this.isCommitting = true;
    new Promise(()=>{ this.commitCycle(); });
  }

  async pushCommand( callBack: ()=>Promise<any> ) {
    const outP = new Promise((resolve)=>{
      this.stack.push(async ()=>{
        const id = Math.random();
        await resolve(await callBack());
      });
    });
    this.commit();
    return outP;
  }
}

// Streams

export class WriteStream extends Writable {
  buf = Buffer.alloc(0);

  _write( chunk: Buffer | string | any, a: string, callback: (error: Error | null) => void ) {
      if (chunk instanceof Buffer) {
        this.buf = Buffer.concat([this.buf, chunk]);
        callback(null);
      }
      else
        callback(new Error("StringWriter expects chunks of type 'Buffer'."));
      process.stdout.write(".");
  }

  getText() {
    return this.buf.toString();
  }

  getBuf() {
    return this.buf;
  }
} /* End of 'WriteStream' class */

export function getReadStream( data ) {
  const readable = new Readable();
  readable.push(data);
  readable.push(null);
  return readable; 
} /* End of 'getReadStream' function */

export class FtpConnection {
  protected client = new ftp.Client();
  protected rootPath: string = "";
  protected ftpCmdStack = new CommandStack;
  protected host: string;
  protected user: string;
  protected password: string;
  curPath: string;

  constructor( newHost: string, newUser: string, newPassword: string ) {
    this.host = newHost;
    this.user = newUser;
    this.password = newPassword;
  }

  // Connect 
  async connect() {
    await this.client.access({
      host: this.host,
      user: this.user,
      password: this.password,
      secure: true
    });
  }

  protected async checkReconnectUnsafe() {
    if (this.client.closed)
      await this.connect();
  }
  
  // cd

  protected async cdUnsafe( path: string ) {
    if (this.curPath == path)
    {
      //console.log('PPPPPPPPPPPPPPPPPPPPPPPPPAAAAAAAAAAAAAAAAAATTTTTTTTTTTTTTTH: ' + this.curPath + '!=' + path);
      return;
    }

    const res = await this.client.cd('/' + path);
    this.curPath = path;
    
    return res;
  }

  protected async goToRootDirUnsafe() {
    await this.cdUnsafe(this.rootPath);
  }

  async setRootPath( newPath: string ) {
    await this.ftpCmdStack.pushCommand(async ()=>{
      console.log('Set root path to ' + newPath);
      await this.checkReconnectUnsafe();
      this.rootPath = newPath;
      return this.goToRootDirUnsafe();
    });
  } 

  // Ensure

  protected async ensureDirUnsafe( path: string ) {
    this.curPath = path;
    return this.client.ensureDir(path);
  }

  private async ensureDir( path: string ) {
    await this.ftpCmdStack.pushCommand(async ()=>{
      try {
        //await this.goToRootDirUnsafe();
        await this.checkReconnectUnsafe();
        const res = await this.ensureDirUnsafe(path);
      } catch (error) {
        console.log("FTP ensure dir ERROR -- " + error);
        console.log('Cur path: ' + this.curPath);
      }
    });
  }

  // Upload

  async uploadFile( fileData: Buffer, path: string, dest: string ): Promise<boolean> {
    console.log("FTP upload file " + this.rootPath + path + dest);
    //console.log(fileData);

    const pRes = await this.ftpCmdStack.pushCommand(async ()=>{
      var res = undefined;
      try {
        await this.checkReconnectUnsafe();
        await this.ensureDirUnsafe('/' + this.rootPath + path);
        res = (await this.client.uploadFrom(getReadStream(new Uint8Array(fileData)), dest)).code;
      } catch (error) {
        console.log("FTP upload file ERROR -- " + error);
        console.log('Cur path: ' + this.curPath);
      }
      return res;
    });
    
    console.log(pRes == 226 ? "success" : "Something went wrong");
    return pRes == 226;
  }
  
  // Download

  async downloadFile( fileName ): Promise<Buffer> {
    console.log("FTP download file " + fileName);

    const buf = new WriteStream();

    await this.ftpCmdStack.pushCommand(async ()=>{
      try {
        await this.checkReconnectUnsafe();
        await this.goToRootDirUnsafe();
        await this.client.downloadTo(buf, fileName);
      } catch (error) {
        console.log("FTP download file ERROR -- " + error);
      }
    });

    return buf.getBuf();
  }
}

// Dummy pseudo-ftp file
export class LocalConnection {
  baseDirectory

  constructor(baseDirectory: string = "../!FTPData/") {
    this.baseDirectory = baseDirectory;
  } /* constructor */

  async uploadFile( fileData: Buffer, path: string, dest: string ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      try {
        fs.writeFileSync(this.baseDirectory + dest, 'binary')
        resolve(true);
      } catch (error) {
        console.log("File reading ERROR -- " + error);
        resolve(false);
      }
    });
  } /* uploadFile */

  async downloadFile(path: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const globalPath = this.baseDirectory + path;

      console.log(`Reading file ${globalPath}`);
      try {
        resolve(fs.readFileSync(globalPath));
      } catch (error) {
        console.log("File reading ERROR -- " + error);
        reject(); 
      }
    })
  } /* downloadFile */
} /* FtpConnectionReplacer */