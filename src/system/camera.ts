import {Vec3, Mat4, Size} from "./linmath";

export class Camera {
  // camera projection shape params
  projSize: Size = new Size(1.0, 1.0);
  correctedProjSize: Size = new Size(0.01, 0.01);
  screenSize: Size;
  near: number = 0.01;
  far: number = 512.0;

  // current screen resolution

  // camera location
  loc: Vec3;
  at: Vec3;
  dir: Vec3;
  up: Vec3;
  right: Vec3;

  // camera projection matrices
  view: Mat4;
  proj: Mat4;
  viewProj: Mat4;

  constructor() {
    this.proj = Mat4.identity();
    this.set(new Vec3(0, 0, -1), new Vec3(0, 0, 0), new Vec3(0, 1, 0));
    this.resize(30, 30);
  } /* constructor */

  projSet(newNear: number, newFar: number, newProjSize: Size | undefined) {
    if (newProjSize instanceof Size) {
      this.projSize = newProjSize.copy();
    }
    this.near = newNear;
    this.far = newFar;
    this.correctedProjSize = this.projSize.copy();

    this.correctedProjSize.w *= this.near;
    this.correctedProjSize.h *= this.near;

    if (this.screenSize.w > this.screenSize.h) {
      this.correctedProjSize.w *= this.screenSize.w / this.screenSize.h;
    } else {
      this.correctedProjSize.h *= this.screenSize.h / this.screenSize.w;
    }

    this.proj = Mat4.frustum(
      -this.correctedProjSize.w / 2, this.correctedProjSize.w / 2,
      -this.correctedProjSize.h / 2, this.correctedProjSize.h / 2,
      this.near, this.far
    );
    this.viewProj = this.view.mul(this.proj);
  } /* projSet */

  /**
   * Camera resize function
   * @param newWidth  New frame width
   * @param newHeight New frame height
   */
  resize(newWidth: number, newHeight: number) {
    this.screenSize = new Size(newWidth, newHeight);
    this.projSet(this.near, this.far, this.projSize);
  } /* resize */

  set(loc: Vec3, at: Vec3, up: Vec3 = new Vec3(0, 1, 0)) {
    this.view = Mat4.view(loc, at, up);
    this.viewProj = this.view.mul(this.proj);

    this.loc = loc.copy();
    this.at = at.copy();

    this.right = new Vec3( this.view.m[ 0],  this.view.m[ 4],  this.view.m[ 8]);
    this.up    = new Vec3( this.view.m[ 1],  this.view.m[ 5],  this.view.m[ 9]);
    this.dir   = new Vec3(-this.view.m[ 2], -this.view.m[ 6], -this.view.m[10]);
  } /* set */
} /* Camera */