const ftpLib = require("basic-ftp");
const { Readable, Writable } = require("stream");


const client = new ftpLib.Client();

export class StringWriter extends Writable {
  buf = Buffer.alloc(0);

  _write( chunk: Buffer | string | any, a: string, callback: (error: Error | null) => void ) {
      if (chunk instanceof Buffer) {
        this.buf = Buffer.concat([this.buf, chunk]);
        callback(null);
      }
      else
        callback(new Error("StringWriter expects chunks of type 'Buffer'."));

      console.log("Write to buf");
  }

  getText() {
      return this.buf.toString();
  }

  getBuf() {
    return this.buf;
  }
}

export function getReadable( data ) {
  const readable = new Readable();
  readable.push(data);
  readable.push(null);
  return readable;
}

export async function ftpInit() {
  console.log("LOGGING...");
  await client.access({
    host: "ftpupload.net",
    user: "if0_35095022",
    password: "e9cdJZmBzH",
    secure: true
  });
  console.log("SUCCESS!!!");

  //console.log(await client.list());

  return client;
}

export class ftp {

  client;

  async connect( host: string, user: string, password: string ) {
    await client.access({
      host: host,
      user: user,
      password: password,
      secure: true
    });
  }

  async uploadFile( fileData: File, dest: string ): Promise<boolean> {
    //console.log(img);
    console.log("UPLOADING FILE " + dest);
    const res = await client.uploadFrom(getReadable(fileData), dest);
    console.log(res);
    return true;
  }

  async getFile( fileName ): Promise<Buffer> {
    console.log("GET FILE " + fileName);
    
    const buf = new StringWriter();
    await client.downloadTo(buf, fileName);
    return buf.getBuf();
  }
}
