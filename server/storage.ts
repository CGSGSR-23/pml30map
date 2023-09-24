const ftp = require("basic-ftp");
const { Readable, Writable } = require("stream");

class CommandStack {
  stack: Array<()=>Promise<void>> = [];
  isCommitting = false;

  commitCycle() {
    //console.log("Cycle == " + this.stack.length);
    if (this.stack.length > 0)
    {
      this.stack[0]().then(()=>{ this.stack.shift(); }).then(()=>{ this.commitCycle(); });
    }
    else
      this.isCommitting = false;
  }

  commit() {
    if (this.isCommitting == true)
      return;
    //console.log("Commit");
    this.isCommitting = true;
    new Promise(()=>{ this.commitCycle(); });
  }

  async pushCommand( callBack: ()=>Promise<any> ) {
    const outP = new Promise((resolve)=>{
      this.stack.push(async ()=>{
        const id = Math.random();
        //console.log("Command " + id + "launched");
        await resolve(await callBack());
        //console.log("Command " + id + "finished");
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
  ftpCmdStack = new CommandStack;

  async connect( host: string, user: string, password: string ) {
    await this.client.access({
      host: host,
      user: user,
      password: password,
      secure: true
    });
  }

  setRootPath( newPath: string ) {
    this.rootPath = newPath;
  } 

  async uploadFile( fileData: Buffer, path: string, dest: string ): Promise<boolean> {
    console.log("FTP upload file " + this.rootPath + path + dest);
    console.log(fileData);

    const res = await this.ftpCmdStack.pushCommand(async ()=>{
      var res = undefined;
      try {
        res = (await this.client.uploadFrom(getReadStream(new Uint8Array(fileData)), this.rootPath + path + dest)).code;
      } catch (error) {
        console.log("FTP upload file ERROR -- " + error);
      }
      return res;
    });
    
    console.log(res == 226 ? "success" : "Something went wrong");
    return res == 226;
  }

  async downloadFile( fileName ): Promise<Buffer> {
    console.log("FTP download file " + this.rootPath + fileName);

    const buf = new WriteStream();

    await this.ftpCmdStack.pushCommand(async ()=>{
      try {
        await this.client.downloadTo(buf, this.rootPath + fileName);
      } catch (error) {
        console.log("FTP download file ERROR -- " + error);
      }
    });

    return buf.getBuf();
  }
}
