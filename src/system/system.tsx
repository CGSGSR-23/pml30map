import {Camera} from "./camera";
import {Vec2, Vec3, Mat4, Size} from "./linmath";
import {Shader, Target, Texture, UniformBuffer, Topology, Primitive, Material} from "./render_resources";

/**
 * @brief Unit interface
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

/**
 * @brief Unit response class. May be react element
 */
export class System {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  doRun: boolean = true;
  mainCycleTimeout: NodeJS.Timeout;

  target: Target;
  fsMaterial: Material;
  fsPrimitive: Primitive;

  /**
   * System constructor. Basically, should be only one system on client
   * @param {HTMLCanvasElement} canvas Canvas to render to
   */
  constructor(canvas: HTMLCanvasElement) {
    let gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    this.gl = gl;

    this.target = Target.create(gl, 3);
    // this.fsPrimitive.material = 
    this.fsPrimitive = Primitive.fromTopology(gl, Topology.square());

  } /* constructor */

  /**
   * Main cycle running function
   */
  stopMainCycle() {
    clearTimeout(this.mainCycleTimeout);
  } /* stopMainCycle */

  /**
   * Main cycle running function
   */
  runMainCycle() {
    let gl = this.gl;

    this.mainCycleTimeout = setInterval(() => {

    });
  } /* runMainCycle */
} /* System */

/* system.ts */