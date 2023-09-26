import {Vec2, Vec3, Vec4, Mat4} from "./linmath";

/**
 * Shader-bindable object interface
 */
export interface ShaderBindable {
  /**
   * Object to shader binding function
   * @param program Shader to bind to
   * @param block Block to bind object to shader to
   */
  bind(program: Shader, block: number): void;
} /* ShaderBindable */

enum ShaderType {
  VERTEX = "vert",
  FRAGMENT = "frag",
} /* ShaderType */

function shaderTypeToGL(type: ShaderType): number {
  switch (type) {
    case ShaderType.VERTEX:   return WebGL2RenderingContext.VERTEX_SHADER;
    case ShaderType.FRAGMENT: return WebGL2RenderingContext.FRAGMENT_SHADER;
  }

  return 0;
} /* shaderTypeToGL */

/**
 * Shader representation class
 */
export class Shader {
  gl: WebGL2RenderingContext;
  program: WebGLShader;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  } /* constructor */

  static async loadShaderModule(gl: WebGL2RenderingContext, type: ShaderType, sourcePath: string): Promise<WebGLShader> {
    let source: string | null = await fetch(`${sourcePath}.${type}`).then(
      sourcePath => sourcePath.text(),
      error => null
    );

    if (source === null)
      return Promise.reject(`Can't open file ${sourcePath}`);

    let shader: WebGLShader = gl.createShader(shaderTypeToGL(type));

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let errorLog: string = `Shader compilation error: ${gl.getShaderInfoLog(shader)}`;
      return Promise.reject(errorLog);
    }

    return shader;
  } /* createShdaerModule */

  /**
   * Shader loading function
   * @param gl WebGL context
   * @param path Path to shader
   * @returns Promise of full-functional shader
   */
  static async load(gl: WebGL2RenderingContext, path: string): Promise<Shader> {
    let result = new Shader(gl);
    let
      vs: WebGLShader = null,
      fs: WebGLShader = null;

    await Promise.all([
      Shader.loadShaderModule(gl, ShaderType.VERTEX, path).then(shader => vs = shader, error => {}),
      Shader.loadShaderModule(gl, ShaderType.FRAGMENT, path).then(shader => fs = shader, error => {}),
    ]);

    if (vs === null || fs === null) {
      let log = `Shader loading error: Can't load shader module`;
      console.log(log);
      return Promise.reject(log);
    }

    result.program = gl.createProgram();
    gl.attachShader(result.program, vs);
    gl.attachShader(result.program, fs);

    gl.linkProgram(result.program);

    if (!gl.getProgramParameter(result.program, gl.LINK_STATUS)) {
      let log = `Program linking error: ${gl.getProgramInfoLog(result.program)}`;
      console.log(log);
      return Promise.reject(log);
    }

    return result;
  } /* load */

  /**
   * Program binding function
   */
  useProgram() {
    this.gl.useProgram(this.program);
  } /* useProgram */
} /* class Shader */

export enum TextureComponentType {
  HALF_FLOAT,
  BYTE,
  UINT,
  DEPTH,
} /* Type of texture component */

class TextureFormatData {
  componentType: number;
  format: number;
  internalFormat: number;

  constructor(componentType: TextureComponentType, componentCount: number) {
    const gl = WebGL2RenderingContext;

    switch (componentType) {
      case TextureComponentType.HALF_FLOAT:
        const halfFloatFormats = [gl.RED, gl.RG, gl.RGB, gl.RGBA];
        const halfFloatInternals = [gl.R16F, gl.RG16F, gl.RGB16F, gl.RGBA16F];

        this.format = halfFloatFormats[componentCount - 1];
        this.internalFormat = halfFloatInternals[componentCount - 1];
        this.componentType = gl.HALF_FLOAT;
        break;

      case TextureComponentType.BYTE:
        const byteFormats = [gl.RED, gl.RG, gl.RGB, gl.RGBA];
        const byteInternals = [gl.R8, gl.RG8, gl.RGB8, gl.RGBA8];

        this.format = byteFormats[componentCount - 1];
        this.internalFormat = byteInternals[componentCount - 1];
        this.componentType = gl.UNSIGNED_BYTE;
        break;

        case TextureComponentType.UINT:
        const uintFormats = [gl.RED_INTEGER, gl.RG_INTEGER, gl.RGB_INTEGER, gl.RGBA_INTEGER];
        const uintInternals = [gl.R32UI, gl.RG32UI, gl.RGB32UI, gl.RGBA32UI];

        this.format = uintFormats[componentCount - 1];
        this.internalFormat = uintInternals[componentCount - 1];
        this.componentType = gl.UNSIGNED_INT;
        break;

      case TextureComponentType.DEPTH:
        this.format = gl.DEPTH_COMPONENT;
        this.internalFormat = gl.DEPTH_COMPONENT24;
        this.componentType = gl.UNSIGNED_INT;
        break;
    }
  } /* constructor */
} /* TextureFormatData */

/**
 * Texture implementation class
 */
export class Texture implements ShaderBindable {
  private gl: WebGL2RenderingContext;
  private format: TextureFormatData;

  componentType: TextureComponentType;
  componentCount: number;

  width: number;
  height: number;
  tex: WebGLTexture;

  /**
   * Texture create function
   * @param gl             WebGL context
   * @param width          Texture width
   * @param height         Texture height
   * @param componentType  Type of texture color component
   * @param componentCount Count of texture color components
   * @param data           Texture data(default - null)
   * @returns Created texture
   */
  static create(gl: WebGL2RenderingContext, width: number, height: number, componentType: TextureComponentType, componentCount: number, data: TexImageSource = null): Texture {
    let result: Texture = new Texture();

    result.gl = gl;
    result.format = new TextureFormatData(componentType, componentCount);

    result.componentType = componentType;
    result.componentCount = componentCount;

    result.height = height;
    result.width = width;
    result.tex = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, result.tex);
    if (data === null)
      gl.texImage2D(gl.TEXTURE_2D, 0, result.format.internalFormat, width, height, 0, result.format.format, result.format.componentType, null);
    else {
      gl.texImage2D(gl.TEXTURE_2D, 0, result.format.internalFormat, result.format.format, result.format.componentType, data);
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    return result;
  } /* createTexture */

  /**
   * Texture loading function
   * @param gl WebGL context
   * @param url Texture file URL
   * @returns Promise of loaded texture
   */
  static load(gl: WebGL2RenderingContext, url: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      let image = new Image();

      image.src = url;
      image.onload = () => {
        resolve(Texture.create(gl, image.width, image.height, TextureComponentType.BYTE, 4, image));
      };
      image.onabort = () => {
        reject("Error creating image");
      };
    });
  } /* loadTexture */

  async load(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let gl = this.gl;

      let image = new Image();

      image.onload = () => {
        this.width = image.width;
        this.height = image.height;

        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format.internalFormat, this.format.format, this.componentType, image);
        resolve();
      };
      image.onabort = () => {
        reject();
      };
    });
  } /* load */

  /**
   * Texture resize function
   * @param width  New texture width
   * @param height New texture height
   */
  resize(width: number, height: number) {
    let gl = this.gl;

    this.width = width;
    this.height = height;

    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format.internalFormat, width, height, 0, this.format.format, this.format.componentType, null);
  } /* resize */

  /**
   * Object to shader binding function
   * @param program Shader to bind to
   * @param block Block to bind object to shader to
   */
  bind(program: Shader, block: number): void {
    let gl = this.gl;

    gl.activeTexture(gl.TEXTURE0 + block);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    let location = gl.getUniformLocation(program.program, `Tex${block}`);
    // No safety check to speedup
    gl.uniform1i(location, block);
  } /* bind */
} /* class Texture */

export class UniformBuffer implements ShaderBindable {
  gl: WebGL2RenderingContext;
  id: WebGLBuffer;
  size: number;
  bufferName: string = "materialUBO";

  /**
   * Buffer create function
   * @param gl WebGL rendering context
   * @returns 
   */
  static create(gl: WebGL2RenderingContext): UniformBuffer {
    let result: UniformBuffer = new UniformBuffer();

    result.gl = gl;
    result.id = gl.createBuffer();
    result.size = 0;

    return result;
  } /* create */

  /**
   * Object to shader binding function
   * @param program Shader to bind to
   * @param block Block to bind object to shader to
  */
  bind(program: Shader, block: number): void {
    let gl = this.gl;
    let location = gl.getUniformBlockIndex(program.program, this.bufferName);

    if (location != gl.INVALID_INDEX) {
      gl.uniformBlockBinding(program.program, location, block);
      gl.bindBufferBase(gl.UNIFORM_BUFFER, block, this.id);
    }
  } /* bind */
  
  /**
   * Data to buffer writing function
   * @param data Data to write
   */
  writeData(data: BufferSource) {
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.id);
    this.gl.bufferData(this.gl.UNIFORM_BUFFER, data, this.gl.STATIC_DRAW);
    this.size = data.byteLength;
  } /* writeData */

  /**
   * Data to buffer writing function
   * @param data Data to write
   */
  writeSubData(data: BufferSource, offset: number) {
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.id);
    this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, offset, data);
  } /* writeSubData */
} /* class UniformBuffer */

export interface Target {
  /**
   * Target resize function
   * @param width  New buffer width
   * @param height New buffer height
  */
  resize(width: number, height: number): void;
  /**
   * Target binding function
   */
  bind(): void;

  getAttachmentValue(attachmentIndex: number, x: number, y: number): Vec4;

  /**
   * Attachment array getting function
   * @returns Attachment texture array
   */
  getAttachments(): Texture[];
} /* interface Target */

/**
 * Rendering target representation class
 */
class RenderTarget implements Target {
  gl: WebGL2RenderingContext;
  framebuffer: WebGLFramebuffer;
  attachments: Texture[];
  depthAttachment: Texture;
  drawBuffers: number[] = [];

  width: number;
  height: number;

  /**
   * Target create function
   * @param gl                   WebGL context
   * @param colorComponentNumber Count of color componetns
   * @returns Created target with this parameters
   */
  static create(gl: WebGL2RenderingContext, colorComponentNumber: number): Target {
    let result = new RenderTarget();

    result.gl = gl;
    result.framebuffer = gl.createFramebuffer();

    // default size
    result.width = result.height = 30;

    gl.bindFramebuffer(gl.FRAMEBUFFER, result.framebuffer);

    result.attachments = [];
    for (let i = 0; i < colorComponentNumber; i++) {
      result.attachments.push(Texture.create(gl, result.width, result.height, TextureComponentType.HALF_FLOAT, 4));
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, result.attachments[i].tex, 0);

      result.drawBuffers.push(gl.COLOR_ATTACHMENT0 + i);
    }

    result.depthAttachment = Texture.create(gl, result.width, result.height, TextureComponentType.DEPTH, 1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, result.depthAttachment.tex, 0);

    return result;
  } /* create */

  getAttachmentValue(attachmentIndex: number, x: number, y: number): Vec4 {
    let gl = this.gl;

    let dst = new Float32Array(4);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE) {
      gl.readPixels(x, this.attachments[attachmentIndex].height - y, 1, 1, gl.RGBA, gl.HALF_FLOAT, dst);
    }

    return new Vec4(dst[0], dst[1], dst[2], dst[3]);
  } /* getAttachmentValue */

  /**
   * Target resize function
   * @param width  New buffer width
   * @param height New buffer height
  */
  resize(width: number, height: number) {
    let gl = this.gl;

    this.width = width;
    this.height = height;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    for (let i = 0, num = this.attachments.length; i < num; i++) {
      this.attachments[i].resize(width, height);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, this.attachments[i].tex, 0);
    }
    this.depthAttachment.resize(width, height);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthAttachment.tex, 0);

    gl.drawBuffers(this.drawBuffers);
  } /* resize */

  /**
   * Target binding function
   */
  bind() {
    let gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.viewport(0, 0, this.width, this.height);

    for (let i = 0, num = this.attachments.length; i < num; i++)
      gl.clearBufferfv(gl.COLOR, i, [0, 0, 0, NaN]);
    gl.clearBufferfi(gl.DEPTH_STENCIL, 0, 1, 0);

    gl.drawBuffers(this.drawBuffers);
  } /* bind */

  /**
   * Attachment array getting function
   */
  getAttachments(): Texture[] {
    return this.attachments;
  } /* getAttachments */
} /* class RenderTarget */

class DefaultTarget implements Target {
  width: number;
  height: number;
  gl: WebGL2RenderingContext;

  /**
   * Constructor
   */
  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.width = 300;
    this.height = 300;
  } /* constructor */

  /**
   * Target resize function
   * @param width  New buffer width
   * @param height New buffer height
  */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  } /* resize */

  getAttachmentValue(attachmentIndex: number, x: number, y: number): Vec4 {
    return new Vec4(0, 0, 0, 0);
  } /* getAttachmentValue */


  /**
   * Target binding function
   */
  bind(): void {
    let gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.viewport(0, 0, this.width, this.height);
  } /* bind */

  /**
   * Attachment array getting function
   * @returns Attachment texture array
   */
  getAttachments(): Texture[] {
    return [];
  } /* getAttachments */
} /* class DefaultTarget */

export namespace Target {
  export function create(gl: WebGL2RenderingContext, colorComponentNumber: number): Target {
    return RenderTarget.create(gl, colorComponentNumber);
  } /* create */

  /**
   * Default target create function
   * @param gl WebGL context
   * @returns Default target
   */
  export function createDefault(gl: WebGL2RenderingContext): Target {
    return new DefaultTarget(gl);
  } /* createDefault */
} /* namespace Target */

export class Material {
  gl: WebGL2RenderingContext;
  shader: Shader;
  resources: ShaderBindable[] = [];

  static async create(gl: WebGL2RenderingContext, shaderPath: string): Promise<Material> {
    let result = new Material();

    result.gl = gl;
    result.shader = await Shader.load(gl, shaderPath);

    return result;
  } /* create */

  /**
   * Resource to material adding function
   * @param resource Resource to add to material bindings
   */
  addResource(resource: ShaderBindable) {
    this.resources.push(resource);
  } /* addResource */

  /**
   * Material applying function
   * @param blockOffset Offset of first block in shader units
   */
  apply(blockOffset: number = 0) {
    this.shader.useProgram();
    for (let i = 0, num = this.resources.length; i < num; i++) {
      this.resources[i].bind(this.shader, i + blockOffset);
    }
  } /* apply */
} /* Material */

export class Vertex {
  position: Vec3;
  texCoord: Vec2;
  normal: Vec3;

  /**
   * Constructor. Grabs arguments
   * @param position Position
   * @param texCoord Texture coorinate
   * @param normal   Surface normal
   */
  constructor(position: Vec3, texCoord: Vec2, normal: Vec3) {
    this.position = position;
    this.texCoord = texCoord;
    this.normal = normal;
  } /* constructor */

  static fromCoord(
    px: number, py: number, pz: number,
    ptu: number = 0, ptv: number = 0,
    pnx: number = 0, pny: number = 0, pnz: number = 0
  ): Vertex {
    return new Vertex(new Vec3(px, py, pz), new Vec2(ptu, ptv), new Vec3(pnx, pny, pnz));
  } /* fromCoord */

  static fromVectors(position: Vec3, texCoord: Vec2, normal: Vec3): Vertex {
    return new Vertex(position.copy(), texCoord.copy(), normal.copy());
  } /* fromVertex */
} /* Vertex */

/**
 * Topology type class
 */
export enum TopologyType {
  LINES          = WebGL2RenderingContext.LINES,
  LINE_STRIP     = WebGL2RenderingContext.LINE_STRIP,
  LINE_LOOP      = WebGL2RenderingContext.LINE_LOOP,

  POINTS         = WebGL2RenderingContext.POINTS,

  TRIANGLES      = WebGL2RenderingContext.TRIANGLES,
  TRIANGLE_STRIP = WebGL2RenderingContext.TRIANGLE_STRIP,
  TRIANGLE_FAN   = WebGL2RenderingContext.TRIANGLE_FAN,
} /* TopologyType */

export class Topology {
  vtx: Vertex[];
  idx: number[];

  type: TopologyType;

  static square(): Topology {
    let tpl = new Topology();
    tpl.vtx = [
      Vertex.fromCoord(-1, -1, 0,   0, 0,   0, 1, 0),
      Vertex.fromCoord(-1,  1, 0,   0, 1,   0, 1, 0),
      Vertex.fromCoord( 1, -1, 0,   1, 0,   0, 1, 0),
      Vertex.fromCoord( 1,  1, 0,   1, 1,   0, 1, 0),
    ];

    tpl.idx = [0, 1, 2, 3];
    tpl.type = TopologyType.TRIANGLE_STRIP;

    return tpl;
  } /* square */

  private static indexedPlane(width: number, height: number): Topology {
    let tpl = new Topology();

    tpl.type = TopologyType.TRIANGLE_STRIP;
    tpl.vtx = [];
    tpl.idx = [];

    let i = 0;
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width; x++) {
        tpl.idx[i++] = y * width + x;
        tpl.idx[i++] = (y + 1) * width + x;
      }
      tpl.idx[i++] = -1;
    }

    return tpl;
  } /* indexedPlane */

  static tetrahedron(): Topology {
    let tpl = new Topology();

    tpl.vtx = [
      Vertex.fromCoord( 0.5773502691896, -0.4082482904638,  0.0),
      Vertex.fromCoord(-0.2886751345948, -0.4082482904638,  0.5),
      Vertex.fromCoord(-0.2886751345948, -0.4082482904638, -0.5),
      Vertex.fromCoord( 0.0000000000000,  0.4082482904638,  0.0),
    ];
    tpl.idx = [0, 1, 3, 2, 0, 1];
    tpl.type = TopologyType.TRIANGLE_STRIP;

    return tpl;
  } /* tetrahedron */

  static plane(width: number, height: number): Topology {
    let tpl = this.indexedPlane(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        tpl.vtx[y * width + x] = Vertex.fromCoord(
          x, 0, y,
          x / (width - 1), y / (height - 1),
          0, 1, 0
        );
      }
    }

    return tpl;
  } /* plane */

  static cylinder(size: number = 24): Topology {
    let tpl = Topology.indexedPlane(size, 2);

    tpl.type = TopologyType.TRIANGLE_STRIP;

    for (let i = 0; i <= size; i++) {
      let a = i / (size - 2) * Math.PI * 2;
      let ca = Math.cos(a), sa = Math.sin(a);

      tpl.vtx.push(Vertex.fromCoord(ca, 0, sa));
      tpl.vtx.push(Vertex.fromCoord(ca, 1, sa));
    }

    return tpl;
  } /* cylinder */

  static sphere(radius: number, width: number = 24, height: number = 24): Topology {
    let tpl = Topology.indexedPlane(width, height);

    for (let y = 0; y < height; y++) {
      let theta = Math.PI * y / (height - 1);
      let stheta = Math.sin(theta);
      let ctheta = Math.cos(theta);

      for (let x = 0; x < width; x++) {
        let phi = 2 * Math.PI * x / (width - 1);

        let nx = stheta * Math.sin(phi);
        let ny = ctheta;
        let nz = stheta * Math.cos(phi);

        tpl.vtx[y * width + x] = Vertex.fromCoord(
          radius * nx, radius * ny, radius * nz,
          x / (width - 1), y / (height - 1),
          nx, ny, nz
        );
      }
    }

    return tpl;
  } /* sphere */

  /**
   * OBJ model loading function
   * @param path OBJ file URL
   * @returns Promise of model topology
   */
  static async modelObj(path: string): Promise<Topology> {
    let tpl = new Topology();
    tpl.vtx = [];
    tpl.type = TopologyType.TRIANGLES;

    const src = await fetch(path).then(response => response.text());
    let lines = src.split("\n");
    let positions = [];
    let texCoords = [];
    let normals = [];

    for (let li = 0, lineCount = lines.length; li < lineCount; li++) {
      let segments = lines[li].split(" ");

      switch (segments[0]) {
        case "v":
          positions.push(new Vec3(
            parseFloat(segments[1]),
            parseFloat(segments[2]),
            parseFloat(segments[3])
          ));
          break;

        case "vt":
          texCoords.push(new Vec2(
            parseFloat(segments[1]),
            parseFloat(segments[2])
          ));
          break;

        case "vn":
          normals.push(new Vec3(
            parseFloat(segments[1]),
            parseFloat(segments[2]),
            parseFloat(segments[3])
          ));
          break;

        case "f":
          {
            let vtd = segments[1].split("/");
            let i0 = parseInt(vtd[0]), i1 = parseInt(vtd[1]), i2 = parseInt(vtd[2]);

            tpl.vtx.push(new Vertex(
              Number.isNaN(i0) ? new Vec3(0, 0, 0) : positions[i0 - 1],
              Number.isNaN(i1) ? new Vec2(0, 0) : texCoords[i1 - 1],
              Number.isNaN(i2) ? new Vec3(0, 0, 0) : normals[i2 - 1]
            ));
          }
          {
            let vtd = segments[2].split("/");
            let i0 = parseInt(vtd[0]), i1 = parseInt(vtd[1]), i2 = parseInt(vtd[2]);

            tpl.vtx.push(new Vertex(
              Number.isNaN(i0) ? new Vec3(0, 0, 0) : positions[i0 - 1],
              Number.isNaN(i1) ? new Vec2(0, 0) : texCoords[i1 - 1],
              Number.isNaN(i2) ? new Vec3(0, 0, 0) : normals[i2 - 1]
            ));
          }
          {
            let vtd = segments[3].split("/");
            let i0 = parseInt(vtd[0]), i1 = parseInt(vtd[1]), i2 = parseInt(vtd[2]);

            tpl.vtx.push(new Vertex(
              Number.isNaN(i0) ? new Vec3(0, 0, 0) : positions[i0 - 1],
              Number.isNaN(i1) ? new Vec2(0, 0) : texCoords[i1 - 1],
              Number.isNaN(i2) ? new Vec3(0, 0, 0) : normals[i2 - 1]
            ));
          }
        break;
      }
    }
    tpl.idx = [];

    return tpl;
  } /* model_obj */

  toArray(): Float32Array {
    let result: Float32Array = new Float32Array(this.vtx.length * 8);
    let i = 0;

    for (let vt of this.vtx) {
      result[i++] = vt.position.x;
      result[i++] = vt.position.y;
      result[i++] = vt.position.z;

      result[i++] = vt.texCoord.x;
      result[i++] = vt.texCoord.y;

      result[i++] = vt.normal.x;
      result[i++] = vt.normal.y;
      result[i++] = vt.normal.z;
    }

    return result;
  } /* toArray */
} /* Topology */

export interface Model {
  /**
   * Primitive displaying function
   * @param cameraBuffer Camera uniform buffer
   */
  draw(cameraBuffer: UniformBuffer | null);
} /* Primitive */

class SingleMeshPrimitive {
  private gl: WebGL2RenderingContext;
  vertexArray: WebGLVertexArrayObject;
  indexBuffer: WebGLBuffer | null = null;
  vertexBuffer: WebGLBuffer;

  vertexNumber: number;
  indexNumber: number;

  topologyType: TopologyType;
  material: Material;

  /**
   * Primitive from topology create function
   * @param gl       WebGL context
   * @param topology Primitive topology
   * @param material Primitive material
   * @returns Primitive from topology
   */
  static fromTopology(gl: WebGL2RenderingContext, topology: Topology, material: Material): SingleMeshPrimitive {
    let result = new SingleMeshPrimitive();

    result.topologyType = topology.type;
    result.gl = gl;
    result.material = material;

    result.vertexArray = gl.createVertexArray();
    gl.bindVertexArray(result.vertexArray);

    /* create vertex buffer */
    result.vertexBuffer = gl.createBuffer();
    result.vertexNumber = topology.vtx.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, result.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, topology.toArray(), gl.STATIC_DRAW);

    /* create index buffer */
    if (topology.idx.length == 0) {
      result.indexBuffer = null;
      result.indexNumber = 0;
    } else {
      result.indexBuffer = gl.createBuffer();
      result.indexNumber = topology.idx.length;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(topology.idx), gl.STATIC_DRAW);
    }


    let positionLocation = gl.getAttribLocation(result.material.shader.program, "inPosition");
    if (positionLocation != -1) {
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * 4, 0);
    }
    
    let texCoordLocation = gl.getAttribLocation(result.material.shader.program, "inTexCoord");
    if (texCoordLocation != -1) {
      gl.enableVertexAttribArray(texCoordLocation);
      gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 8 * 4, 3 * 4);
    }

    let normalLocation = gl.getAttribLocation(result.material.shader.program, "inNormal");
    if (normalLocation != -1) {
      gl.enableVertexAttribArray(normalLocation);
      gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 8 * 4, 5 * 4);
    }

    return result;
  } /* fromTopology */

  /**
   * Primitive displaying function
   * @param cameraBuffer Camera uniform buffer
   */
  draw(cameraBuffer: UniformBuffer | null = null) {
    let gl = this.gl;

    this.material.apply(1);

    if (cameraBuffer !== null)
      cameraBuffer.bind(this.material.shader, 0);

    gl.bindVertexArray(this.vertexArray);
    
    if (this.indexBuffer === null)
      gl.drawArrays(this.topologyType, 0, this.vertexNumber);
    else
      gl.drawElements(this.topologyType, this.indexNumber, gl.UNSIGNED_INT, 0);
  } /* draw */
} /* SingleMeshPrimitive */

export namespace Model {
  /**
   * Model from topology create function
   * @param gl       WebGL context
   * @param topology Topology
   * @param mateiral Material class
   * @returns Model
   */
  export function fromTopology(gl: WebGL2RenderingContext, topology: Topology, material: Material): Model {
    let prim = SingleMeshPrimitive.fromTopology(gl, topology, material);
    prim.material = material;
    return prim;
  } /* fromTopology */
} /* Primitive */

/* render.ts */
