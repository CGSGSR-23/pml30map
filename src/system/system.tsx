import {Camera} from "./camera";
import {Vec2, Vec3, Mat4, Size} from "./linmath";
import {Shader} from "./render_resources";

/**
 * @brief Unit interface
 */
export interface Unit {
  /**
   * @brief Unit per-frame response function
   * @param {System} system System this unit is posessed by
   */
  response(system: System): void;
} /* Unit interface */

export class Timer {
  fpsMeasureDuration: number;
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
  } /* constructor */

  response() {

  }
} /* class Timer */

/**
 * @brief Unit response class. May be react element
 */
export class System {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  doRun: boolean = true;
  mainCycleTimeout: NodeJS.Timeout;

  /**
   * System constructor. Basically, should be only one system on client
   * @param {HTMLCanvasElement} canvas Canvas to render to
   */
  constructor(canvas: HTMLCanvasElement) {
    let gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    this.gl = gl;
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
      this.stopMainCycle();
    });
  } /* runMainCycle */
} /* System */

/* system.ts */