import {Camera} from "./camera";
import {Vec2, Vec3, Mat4, Size} from "./math";

/**
 * @brief Unit interface
 */
export interface Unit {
  /**
   * @brief Unit per-frame response function
   * @param {System} system System this unit is posessed by
   */
  response(system: System): void;
}

/**
 * @brief Unit response class. May be react element
 */
export class System {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  doRun: boolean = true;

  /**
   * System constructor. Basically, should be only one system on client
   * @param {HTMLCanvasElement} canvas Canvas to render to
   */
  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
  } /* constructor */

  /**
   * Main cycle running function
   */
  runMainCycle() {
    let gl = this.gl;
    while (this.doRun) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.clearColor(0.30, 0.47, 0.80, 1.00);

      gl.finish();
    }
  } /* runMainCycle */
} /* System */

/* system.ts */