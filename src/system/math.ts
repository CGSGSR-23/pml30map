export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  copy() {
    return new Vec3(this.x, this.y, this.z);
  } /* copy */

  add(rhs: Vec3): Vec3 {
    return new Vec3(
      this.x + rhs.x,
      this.y + rhs.y,
      this.z + rhs.z,
    );
  } /* add */

  sub(rhs: Vec3): Vec3 {
    return new Vec3(
      this.x - rhs.x,
      this.y - rhs.y,
      this.z - rhs.z
    );
  } /* sub */

  mul(rhs: Vec3 | number) {
    if (rhs instanceof Vec3)
      return new Vec3(
        this.x * rhs.x,
        this.y * rhs.y,
        this.z * rhs.z
      );
    return new Vec3(
      this.x * rhs,
      this.y * rhs,
      this.z * rhs
    );
  } /* mul */

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  } /* length */

  distance(rhs: Vec3): number {
    let
      dx = this.x - rhs.x,
      dy = this.y - rhs.y,
      dz = this.z - rhs.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  } /* distance */

  dot(rhs: Vec3): number {
    return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
  } /* dot */

  cross(rhs: Vec3): Vec3 {
    return new Vec3(
      this.y * rhs.z - rhs.y * this.z,
      this.z * rhs.x - rhs.z * this.x,
      this.x * rhs.y - rhs.x * this.y
    );
  } /* cross */

  normalize(): Vec3 {
    let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    return new Vec3(this.x / len, this.y / len, this.z / len);
  } /* normalize */

  neg(): Vec3 {
    return new Vec3(-this.x, -this.y, -this.z);
  } /* neg */

  static fromSpherical(azimuth: number, elevation: number, radius: number = 1): Vec3 {
    return new Vec3(
      radius * Math.sin(elevation) * Math.cos(azimuth),
      radius * Math.cos(elevation),
      radius * Math.sin(elevation) * Math.sin(azimuth)
    );
  } /* sphericalToCartesian */
} /* Vec3 */

export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  } /* constructor */

  copy() {
    return new Vec2(0, 0);
  }

  add(rhs: Vec2): Vec2 {
    return new Vec2(this.x + rhs.x, this.y + rhs.y);
  } /* add */

  sub(rhs: Vec2): Vec2 {
    return new Vec2(this.x - rhs.x, this.y - rhs.y);
  } /* sub */

  mul(rhs: Vec2 | number): Vec2 {
    if (rhs instanceof Vec2)
      return new Vec2(this.x * rhs.x, this.y * rhs.y);
    return new Vec2(this.x * rhs, this.y * rhs);
  } /* mul */

  length2(): number {
    return this.x * this.x + this.y * this.y;
  } /* length2 */

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  } /* length */

  dot(rhs: Vec2): number {
    return this.x * rhs.x + this.y * rhs.y;
  } /* dot */

  cross(rhs: Vec2): number {
    return this.x * rhs.y - rhs.x * this.y;
  } /* cross */

  normalize(): Vec2 {
    let len = Math.sqrt(this.x * this.x + this.y * this.y);

    return new Vec2(this.x / len, this.y / len);
  } /* normalize */

  neg() {
    return new Vec2(-this.x, -this.y);
  } /* neg */

  left() {
    return new Vec2(-this.y, this.x);
  } /* right */

  right() {
    return new Vec2(this.y, -this.x);
  } /* right */
} /* Vec2 */

export class Size {
  w: number;
  h: number;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
  } /* Size */

  copy(): Size {
    return new Size(this.w, this.h);
  } /* copy */
} /* Size */

export class Mat4 {
  m: number[];

  constructor(v00: number, v01: number, v02: number, v03: number,
              v10: number, v11: number, v12: number, v13: number,
              v20: number, v21: number, v22: number, v23: number,
              v30: number, v31: number, v32: number, v33: number) {
    this.m = [
      v00, v01, v02, v03,
      v10, v11, v12, v13,
      v20, v21, v22, v23,
      v30, v31, v32, v33
    ];
  } /* constructor */

  copy() {
    return new Mat4(
      this.m[ 0], this.m[ 1], this.m[ 2], this.m[ 3],
      this.m[ 4], this.m[ 5], this.m[ 6], this.m[ 7],
      this.m[ 8], this.m[ 9], this.m[10], this.m[11],
      this.m[12], this.m[13], this.m[14], this.m[15],
    );
  } /* copy */

  transformPoint(v: Vec3): Vec3
  {
    return new Vec3(
      v.x * this.m[ 0] + v.y * this.m[ 4] + v.z * this.m[ 8] + this.m[12],
      v.x * this.m[ 1] + v.y * this.m[ 5] + v.z * this.m[ 9] + this.m[13],
      v.x * this.m[ 2] + v.y * this.m[ 6] + v.z * this.m[10] + this.m[14]
    );
  } /* transformPoint */

  transform4x4(v: Vec3): Vec3
  {
    let w = v.x * this.m[3] + v.y * this.m[7] + v.z * this.m[11] + this.m[15];
  
    return new Vec3(
      (v.x * this.m[ 0] + v.y * this.m[ 4] + v.z * this.m[ 8] + this.m[12]) / w,
      (v.x * this.m[ 1] + v.y * this.m[ 5] + v.z * this.m[ 9] + this.m[13]) / w,
      (v.x * this.m[ 2] + v.y * this.m[ 6] + v.z * this.m[10] + this.m[14]) / w
    );
  } /* transform4x4 */

  transpose(): Mat4 {
    return new Mat4(
      this.m[ 0], this.m[ 4], this.m[ 8], this.m[12],
      this.m[ 1], this.m[ 5], this.m[ 9], this.m[13],
      this.m[ 2], this.m[ 6], this.m[10], this.m[14],
      this.m[ 3], this.m[ 7], this.m[11], this.m[15]
    );
  } /* transpose */

  mul(rhs: Mat4): Mat4 {
    return new Mat4(
      this.m[ 0] * rhs.m[ 0] + this.m[ 1] * rhs.m[ 4] + this.m[ 2] * rhs.m[ 8] + this.m[ 3] * rhs.m[12],
      this.m[ 0] * rhs.m[ 1] + this.m[ 1] * rhs.m[ 5] + this.m[ 2] * rhs.m[ 9] + this.m[ 3] * rhs.m[13],
      this.m[ 0] * rhs.m[ 2] + this.m[ 1] * rhs.m[ 6] + this.m[ 2] * rhs.m[10] + this.m[ 3] * rhs.m[14],
      this.m[ 0] * rhs.m[ 3] + this.m[ 1] * rhs.m[ 7] + this.m[ 2] * rhs.m[11] + this.m[ 3] * rhs.m[15],

      this.m[ 4] * rhs.m[ 0] + this.m[ 5] * rhs.m[ 4] + this.m[ 6] * rhs.m[ 8] + this.m[ 7] * rhs.m[12],
      this.m[ 4] * rhs.m[ 1] + this.m[ 5] * rhs.m[ 5] + this.m[ 6] * rhs.m[ 9] + this.m[ 7] * rhs.m[13],
      this.m[ 4] * rhs.m[ 2] + this.m[ 5] * rhs.m[ 6] + this.m[ 6] * rhs.m[10] + this.m[ 7] * rhs.m[14],
      this.m[ 4] * rhs.m[ 3] + this.m[ 5] * rhs.m[ 7] + this.m[ 6] * rhs.m[11] + this.m[ 7] * rhs.m[15],

      this.m[ 8] * rhs.m[ 0] + this.m[ 9] * rhs.m[ 4] + this.m[10] * rhs.m[ 8] + this.m[11] * rhs.m[12],
      this.m[ 8] * rhs.m[ 1] + this.m[ 9] * rhs.m[ 5] + this.m[10] * rhs.m[ 9] + this.m[11] * rhs.m[13],
      this.m[ 8] * rhs.m[ 2] + this.m[ 9] * rhs.m[ 6] + this.m[10] * rhs.m[10] + this.m[11] * rhs.m[14],
      this.m[ 8] * rhs.m[ 3] + this.m[ 9] * rhs.m[ 7] + this.m[10] * rhs.m[11] + this.m[11] * rhs.m[15],

      this.m[12] * rhs.m[ 0] + this.m[13] * rhs.m[ 4] + this.m[14] * rhs.m[ 8] + this.m[15] * rhs.m[12],
      this.m[12] * rhs.m[ 1] + this.m[13] * rhs.m[ 5] + this.m[14] * rhs.m[ 9] + this.m[15] * rhs.m[13],
      this.m[12] * rhs.m[ 2] + this.m[13] * rhs.m[ 6] + this.m[14] * rhs.m[10] + this.m[15] * rhs.m[14],
      this.m[12] * rhs.m[ 3] + this.m[13] * rhs.m[ 7] + this.m[14] * rhs.m[11] + this.m[15] * rhs.m[15],
    );
  } /* mul */

  static identity(): Mat4 {
    return new Mat4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  } /* identity */

  static scale(s: Vec3): Mat4 {
    return new Mat4(
      s.x, 0,   0,   0,
      0,   s.y, 0,   0,
      0,   0,   s.z, 0,
      0,   0,   0,   1
    );
  } /* scale */

  static translate(t: Vec3): Mat4 {
    return new Mat4(
      1,   0,   0,   0,
      0,   1,   0,   0,
      0,   0,   1,   0,
      t.x, t.y, t.z, 1
    );
  } /* translate */

  static rotateX(angle: number): Mat4 {
    let s = Math.sin(angle), c = Math.cos(angle);

    return new Mat4(
      1, 0, 0, 0,
      0, c, s, 0,
      0,-s, c, 0,
      0, 0, 0, 1
    );
  } /* rotateX */

  static rotateY(angle: number): Mat4 {
    let s = Math.sin(angle), c = Math.cos(angle);

    return new Mat4(
      c, 0,-s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    );
  } /* rotateY */

  static rotateZ(angle: number): Mat4 {
    let s = Math.sin(angle), c = Math.cos(angle);

    return new Mat4(
      c, s, 0, 0,
     -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  } /* rotateZ */

  static rotate(angle: number, axis: Vec3): Mat4 {
    let v = axis.normalize();
    let s = Math.sin(angle), c = Math.cos(angle);

    return new Mat4(
      v.x * v.x * (1 - c) + c,         v.x * v.y * (1 - c) - v.z * s,   v.x * v.z * (1 - c) + v.y * s,   0,
      v.y * v.x * (1 - c) + v.z * s,   v.y * v.y * (1 - c) + c,         v.y * v.z * (1 - c) - v.x * s,   0,
      v.z * v.x * (1 - c) - v.y * s,   v.z * v.y * (1 - c) + v.x * s,   v.z * v.z * (1 - c) + c,         0,
      0,                               0,                               0,                               1
    );
  } /* rotate */

  static view(loc: Vec3, at: Vec3, up: Vec3): Mat4 {
    let
      dir = at.sub(loc).normalize(),
      rgh = dir.cross(up).normalize(),
      tup = rgh.cross(dir);

    return new Mat4(
      rgh.x,         tup.x,         -dir.x,       0,
      rgh.y,         tup.y,         -dir.y,       0,
      rgh.z,         tup.z,         -dir.z,       0,
      -loc.dot(rgh), -loc.dot(tup), loc.dot(dir), 1
    );
  } /* view */

  static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
    return new Mat4(
      2 * near / (right - left),       0,                               0,                              0,
      0,                               2 * near / (top - bottom),       0,                              0,
      (right + left) / (right - left), (top + bottom) / (top - bottom), (near + far) / (near - far),   -1,
      0,                               0,                               2 * near * far / (near - far),  0
    );
  } /* frustum */
} /* Mat4 */