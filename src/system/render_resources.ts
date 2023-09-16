import {Vec2, Vec3, Mat4} from "./linmath";

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
}

/**
 * Shader representation class
 */
export class Shader {
  gl: WebGL2RenderingContext;
  program: WebGLShader;

  constructor(gl: WebGL2RenderingContext) {
    
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

    const formats = [gl.RED, gl.RG, gl.RGB, gl.RGBA];

    this.format = formats[componentCount];
    switch (componentType) {
      case TextureComponentType.HALF_FLOAT:
        const halfFloatInternals = [gl.R16F, gl.RG16F, gl.RGB16F, gl.RGBA16F];
        this.internalFormat = halfFloatInternals[componentCount];
        this.componentType = gl.HALF_FLOAT;
        break;

      case TextureComponentType.BYTE:
        const byteInternals = [gl.R8, gl.RG8, gl.RGB8, gl.RGBA8];
        this.internalFormat = halfFloatInternals[componentCount];
        this.componentType = gl.BYTE;
        break;
        
        case TextureComponentType.UINT:
        const uintInternals = [gl.R32UI, gl.RG32UI, gl.RGB32UI, gl.RGBA32UI];
        this.internalFormat = halfFloatInternals[componentCount];
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
    gl.texImage2D(gl.TEXTURE_2D, 0, result.format.internalFormat, width, height, 0, result.format.format, result.format.componentType, data);

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

  /**
   * Texture resize function
   * @param width  New texture width
   * @param height New texture height
   */
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format.internalFormat, width, height, 0, this.format.format, this.format.componentType, null);
  } /* resize */

  /**
   * Object to shader binding function
   * @param program Shader to bind to
   * @param block Block to bind object to shader to
   */
  bind(program: Shader, block: number): void {
    this.gl.activeTexture(this.gl.TEXTURE0 + block);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);

    let location = this.gl.getUniformLocation(program.program, `Texture${block}`);
    // No safety check to speedup
    this.gl.uniform1i(location, block);
  } /* bind */
} /* class Texture */

export class UniformBuffer implements ShaderBindable {
  gl: WebGL2RenderingContext;
  id: WebGLBuffer;
  size: number;
  
  static create(gl: WebGL2RenderingContext, size: number, data: ArrayBufferLike = null): UniformBuffer {
    let result: UniformBuffer = new UniformBuffer();
    
    result.gl = gl;
    result.id = gl.createBuffer();
    
    gl.bindBuffer(gl.UNIFORM_BUFFER, result.id);
    gl.bufferData(gl.UNIFORM_BUFFER, data, gl.STATIC_DRAW);
    
    return result;
  } /* create */

  /**
   * Object to shader binding function
   * @param program Shader to bind to
   * @param block Block to bind object to shader to
  */
 bind(program: Shader, block: number): void {
    this.gl.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, block, this.id);
  } /* bind */
} /* class UniformBuffer */

/**
 * Rendering target representation class
 */
export class Target {
  gl: WebGL2RenderingContext;
  framebuffer: WebGLFramebuffer;
  attachments: Texture[];
  depthAttachment: Texture;

  width: number;
  height: number;

  /**
   * Target create function
   * @param gl                   WebGL context
   * @param colorComponentNumber Count of color componetns
   * @returns Created target with this parameters
   */
  static create(gl: WebGL2RenderingContext, colorComponentNumber: number): Target {
    let result = new Target();

    result.gl = gl;
    result.framebuffer = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, result.framebuffer);

    let drawBuffers: number[] = [];
    for (let i = 0; i < colorComponentNumber; i++) {
      result.attachments.push(Texture.create(gl, result.width, result.height, TextureComponentType.UINT, 4));
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, result.attachments[i].tex, 0);
      drawBuffers[i] = gl.DRAW_BUFFER0 + i;
    }

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, result.depthAttachment, 0);
    result.depthAttachment = Texture.create(gl, result.width, result.height, TextureComponentType.DEPTH, 1);
    gl.drawBuffers(drawBuffers);
    
    return result;
  } /* create */
  
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
  } /* resize */

  /**
   * Target binding function
   */
  bind() {
    let gl = this.gl;
  
    gl.bindFramebuffer(gl.TEXTURE_2D, this.framebuffer);
  
    const colorClearValue = [0.00, 0.00, 0.00, 0.00];
    for (let i = 0, num = this.attachments.length; i < num; i++)
      gl.clearBufferfv(gl.COLOR, i, colorClearValue);
    gl.clearBufferfv(gl.DEPTH, 0, [1]);
  
    gl.viewport(0, 0, this.width, this.height);
  } /* bind */
} /* class Target */

export class Material {
  gl: WebGL2RenderingContext;
  shader: Shader;
  resources: ShaderBindable[];

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
    for (let i = 0, num = this.resources.length; i < num; i++)
      this.resources[i].bind(this.shader, i + blockOffset);
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

  static formVectors(position: Vec3, texCoord: Vec2, normal: Vec3): Vertex {
    return new Vertex(position.copy(), texCoord.copy(), normal.copy());
  } /* fromVertex */
} /* Vertex */

/**
 * Topology type class
 */
enum TopologyType {
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
      Vertex.fromCoord(-1, -1, 0, 0, 0),
      Vertex.fromCoord(-1,  1, 0, 0, 1),
      Vertex.fromCoord( 1, -1, 0, 1, 0),
      Vertex.fromCoord( 1,  1, 0, 1, 1)
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

  static sphere(radius: number, width: 24, height: 24): Topology {
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
      result[i++] = vt.texCoord.x;

      result[i++] = vt.normal.x;
      result[i++] = vt.normal.y;
      result[i++] = vt.normal.z;
    }

    return result;
  } /* toArray */
} /* Topology */

export class Primitive {
  gl: WebGL2RenderingContext;
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
   * @param topology Topology class
   * @returns Primitive from topology
   */
  static fromTopology(gl: WebGL2RenderingContext, topology: Topology): Primitive {
    let result = new Primitive();

    result.topologyType = topology.type;
    result.gl = gl;

    result.vertexArray = gl.createVertexArray();

    gl.bindVertexArray(result.vertexArray);
    let positionLocation = gl.getAttribLocation(result.material.shader, "inPosition");
    if (positionLocation != -1) {
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 8 * 4, 0);
      gl.enableVertexAttribArray(positionLocation);
    }

    let texCoordLocation = gl.getAttribLocation(result.material.shader, "inTexCoord");
    if (texCoordLocation != -1) {
      gl.vertexAttribPointer(texCoordLocation, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
      gl.enableVertexAttribArray(texCoordLocation);
    }

    let normalLocation = gl.getAttribLocation(result.material.shader, "inNormal");
    if (normalLocation != -1) {
      gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 8 * 4, 5 * 4);
      gl.enableVertexAttribArray(normalLocation);
    }

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

    return result;
  } /* fromTopology */

  /**
   * Primitive displaying function
   * @param cameraBuffer Camera uniform buffer
   */
  draw(cameraBuffer: UniformBuffer | null = null) {
    let gl = this.gl;

    this.material.apply(1);

    if (cameraBuffer !== null) {
      cameraBuffer.bind(this.material.shader, 0);
    }

    gl.bindVertexArray(this.vertexArray);

    if (this.indexBuffer !== null) {
      gl.drawElements(this.topologyType, this.indexNumber, gl.UNSIGNED_INT, 0);
    } else {
      gl.drawArrays(this.topologyType, 0, this.vertexNumber);
    }
  } /* draw */
} /* primitive */

/* render.ts */