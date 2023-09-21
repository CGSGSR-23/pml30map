import * as React from "react";
import {Camera} from "./camera";
import {Vec2, Vec3, Mat4, Size} from "./linmath";
import {Shader, Target, Texture, UniformBuffer, Topology, Model, Material} from "./render_resources";

/**
 * Unit interface
 */
export interface Unit {
  doSuicide: boolean;

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
   * @returns Current time in Milliseconds
   */
  static getCurrentTime(): number {
    return (new Date()).getMilliseconds() / 10e6;
  } /* getCurrentTime */

  /**
   * Timer constructor
   */
  constructor() {
    this.time = Timer.getCurrentTime();
    this.initialTime = this.time;
    this.deltaTime = 0;
  } /* constructor */

  /**
   * Timer response functions
   */
  response() {
    let time = Timer.getCurrentTime();

    this.deltaTime = time - this.time;
    this.time = time - this.initialTime;

    this.fpsCounter++;
    if (this.time - this.fpsLastMeasureTime > this.fpsMeasureDuration) {
      this.fps = this.fpsCounter / (this.time - this.fpsLastMeasureTime);
      this.fpsLastMeasureTime = this.time;
      this.fpsCounter = 0;
    }
  } /* response */
} /* class Timer */

// uniform cameraBuffer
// {
//   mat4 transformWorld;
//   mat4 transformViewProj;
//   vec3 cameraLocation;
//   float currentID;
// };

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

  camera: Camera;
  cameraUniformbuffer: UniformBuffer;

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

    result.target = Target.create(gl, 2);
    result.defaultTarget = Target.createDefault(gl);

    result.fsMaterial = await Material.create(gl, "bin/shaders/target");
    result.fsMaterial.resources = [...result.target.getAttachments()];
    result.fsPrimitive = Model.fromTopology(gl, Topology.square(), result.fsMaterial);

    result.cameraUniformbuffer = UniformBuffer.create(gl, 36 * 4);

    return result;
  } /* create */

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
   * Main loop running function
   */
  stopMainLoop() {
    this.doRun = false;
    clearInterval(this.mainLoopTimeout);
  } /* stopMainLoop */

  /**
   * Main loop running function
   */
  runMainLoop() {
    let gl = this.gl;
    this.doRun = true;

    this.mainLoopTimeout = setInterval(() => {
      for (let i = 0, num = this.units.length; i < num; i++) {
        this.currentUnitID = i;
        this.units[i].response(this);
      }

      let newUnits: Unit[] = [];
      for (let unit of this.units)
        if (!unit.doSuicide)
          newUnits.push(unit);
      this.units = newUnits;

      this.target.bind();

      // Write main data 
      this.cameraUniformbuffer.writeSubData(new Float32Array([
        ...this.camera.viewProj.m,
        this.camera.loc.x, this.camera.loc.y, this.camera.loc.z,
      ]), 0);

      for (let model of this.renderQueue) {
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