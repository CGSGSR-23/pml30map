import * as React from "react";
import {Camera} from "./camera";
import {Vec2, Vec3, Mat4, Size} from "./linmath";
import {Shader, Target, Texture, UniformBuffer, Topology, Model, Material, TextureComponentType} from "./render_resources";


interface UnitCreateFunction {
  (system: System, ...args: any): Unit;
}

interface UnitPromiseFunction {
  (system: System, ...args: any): Promise<Unit>;
}

/**
 * Unit interface
 */
export interface Unit {
  doSuicide: boolean;
  unitType: string;

  /**
   * @brief Unit per-frame response function
   * @param {System} system System this unit is posessed by
   */
  response(system: System): void;
} /* Unit interface */

/**
 * Timer implementation class
 */
export class Timer {
  fpsMeasureDuration: number;
  fpsLastMeasureTime: number;
  fpsCounter: number;

  initialTime: number;
  fps: number = 30.0;
  time: number = 0.0;
  deltaTime: number;

  /**
   * Current time getting function
   * @returns Current time in Seconds
   */
  private static getGlobalTime(): number {
    return Date.now() / 1000.0;
  } /* getCurrentTime */

  /**
   * Current time getting function (no response-controlled time getting function)
   * @returns Time right now
   */
  getCurrentTime(): number {
    return Timer.getGlobalTime() - this.initialTime;
  } /* getCurrentTime */

  /**
   * Timer constructor
   */
  constructor() {
    this.initialTime = this.time;
    this.time = 0;
    this.deltaTime = 0;
  } /* constructor */

  /**
   * Timer response functions
   */
  response() {
    let time = Timer.getGlobalTime() - this.initialTime;

    this.deltaTime = time - this.time;
    this.time = time;

    this.fpsCounter++;
    if (this.time - this.fpsLastMeasureTime > this.fpsMeasureDuration) {
      this.fps = this.fpsCounter / (this.time - this.fpsLastMeasureTime);
      this.fpsLastMeasureTime = this.time;
      this.fpsCounter = 0;
    }
  } /* response */
} /* class Timer */

class DisplayModel {
  model: Model;
  transform: Mat4;
  unitID: number;
}

/**
 * @brief Unit response class. May be react element
 */
export class System {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  doRun: boolean = true;
  mainLoopTimeout: NodeJS.Timeout;
  units: Unit[] = [];

  currentUnitID = 0;
  renderQueue: DisplayModel[] = [];
  defaultTarget: Target;
  target: Target;
  fsMaterial: Material;
  fsPrimitive: Model;
  timer: Timer;

  camera: Camera;
  cameraUniformbuffer: UniformBuffer;

  /**
   * Resource create functions
   */

  createUniformBuffer(): UniformBuffer {
    return UniformBuffer.create(this.gl);
  } /* createUnfiormBuffer */
  
  async createTextureFromURL(url: string): Promise<Texture> {
    return Texture.load(this.gl, url);
  } /* createTextureFromURL */
  
  createTexture(width: number, height: number, componentType: TextureComponentType, componentCount: number, data: TexImageSource = null): Texture {
    return Texture.create(this.gl, width, height, componentType, componentCount, data);
  } /*  createTexture */

  async createMaterial(materialShaderName: string): Promise<Material> {
    return Material.create(this.gl, materialShaderName);
  } /* createMaterial */

  createModelFromTopology(topology: Topology, material: Material): Model {
    return Model.fromTopology(this.gl, topology, material);
  } /* createModelFromTopology */

  /**
   * System constructor. Basically, should be only one system on client
   * @param {HTMLCanvasElement} canvas Canvas to render to
   */
  constructor(canvas: HTMLCanvasElement) {
    let gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

    let extensions = ["EXT_color_buffer_float"];
    for (let i = 0; i < extensions.length; i++)
      if (gl.getExtension(extensions[i]) == null)
        throw Error(`"${extensions[i]}" extension required`);

    this.canvas = canvas;
    this.gl = gl;
  } /* constructor */

  /**
   * System create function
   * @param canvas Canvas to create system on
   * @returns Promise of system
   */
  static async create(canvas: HTMLCanvasElement): Promise<System> {
    let result = new System(canvas);
    let gl = result.gl;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    result.target = Target.create(gl, 2);
    result.defaultTarget = Target.createDefault(gl);

    result.fsMaterial = await Material.create(gl, "bin/shaders/target");
    result.fsMaterial.resources = [...result.target.getAttachments()];
    result.fsPrimitive = Model.fromTopology(gl, Topology.square(), result.fsMaterial);

    // Create uniform buffer with ??? size.
    result.camera = new Camera();
    result.cameraUniformbuffer = UniformBuffer.create(gl);
    result.cameraUniformbuffer.bufferName = "cameraBuffer";
    result.cameraUniformbuffer.writeData(new Float32Array(36));

    result.timer = new Timer();

    return result;
  } /* create */

  resize(newWidth: number, newHeight: number) {
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;

    this.defaultTarget.resize(this.canvas.width, this.canvas.height);
    this.target.resize(this.canvas.width, this.canvas.height);
    this.camera.resize(newWidth, newHeight);
  } /* resize */

  /**
   * Model displaying function
   * @param model Model create function
   * @param transform Model transform
   */
  drawModel(model: Model, transform: Mat4 = Mat4.identity()) {
    this.renderQueue.push({
      model: model,
      transform: transform,
      unitID: this.currentUnitID
    });
  } /* drawModel */

  /**
   * Unit adding function
   * @param unit Unit to add
   */
  addUnit(unit: Unit) {
    this.units.push(unit);
  } /* addUnit */

  /**
   * Unit create function
   * @param fn Function to create unit by
   * @param constructionArguments Unit construction arguments (ACHTUNG! DYNAMIC TYPE)
   * @returns Created unit (as unit only((()
   */
  async createUnit(fn: UnitCreateFunction | UnitPromiseFunction, ...constructionArguments: any): Promise<Unit> {
    let system = this;
    return new Promise<Unit>((resolve) => {
      let unitPromise: Promise<Unit> = (async() => { return fn(this, ...constructionArguments); })();

      unitPromise.then((unit: Unit) => {
        system.units.push(unit);
        resolve(unit);
      });
    });
  } /* createUnit */

  /**
   * Main loop running function
   */
  stopMainLoop() {
    this.doRun = false;
    clearInterval(this.mainLoopTimeout);
  } /* stopMainLoop */

  getScreenUnitAndPosition(x: number, y: number): {unit: Unit | null, position: Vec3} {
    let v = this.target.getAttachmentValue(1, x, y);
    if (v.w >= 0 && v.w < this.units.length)
      return {
        unit: this.units[v.w],
        position: new Vec3(v.x, v.y, v.z)
      };
    return {
      unit: null,
      position: new Vec3(v.x, v.y, v.z),
    };
  } /* getUnitAndPosition */

  getScreenUnit(x: number, y: number): Unit | null {
    let unitIndex = this.target.getAttachmentValue(1, x, y).w;
    if (unitIndex >= 0 && unitIndex < this.units.length)
      return this.units[unitIndex];
    return null;
  } /* getUnitByCoord */

  getScreenPosition(x: number, y: number): Vec3 {
    let coord = this.target.getAttachmentValue(1, x, y);

    return new Vec3(coord.x, coord.y, coord.z);
  } /* getScreenPosition */

  responseUnits() {
    for (let i = 0, num = this.units.length; i < num; i++) {
      this.currentUnitID = i;
      this.units[i].response(this);
    }

    let newUnits: Unit[] = [];
    for (let unit of this.units)
      if (!unit.doSuicide)
        newUnits.push(unit);
    this.units = newUnits;
  } /* responseUnits */

  /**
   * Main loop running function
   */
  runMainLoop() {
    let gl = this.gl;
    this.doRun = true;

    this.mainLoopTimeout = setInterval(() => {
      this.timer.response();

      this.responseUnits();

      this.target.bind();

      this.cameraUniformbuffer.writeSubData(new Float32Array([
        ...this.camera.viewProj.m,
        this.camera.loc.x, this.camera.loc.y, this.camera.loc.z,
      ]), 0);

      for (let model of this.renderQueue) {
        // write per-model data (Unit ID, model transformation matrix etc.)
        this.cameraUniformbuffer.writeSubData(new Float32Array([model.unitID, ...model.transform.m]), 19 * 4);
        model.model.draw(this.cameraUniformbuffer);
      }
      gl.finish();

      this.defaultTarget.bind();
      this.fsPrimitive.draw(null);
      gl.finish();

      this.renderQueue = [];
    });
  } /* runMainLoop */
} /* System */

/* system.ts */