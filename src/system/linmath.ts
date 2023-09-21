export class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  /**
   * Vector constructor
   * @param x Vector component
   * @param y Vector component
   * @param z Vector component
   * @param w Vector component
   */
  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  } /* constructor */

  /**
   * Vector from object create function
   * @param object Object to create vec3 from
   * @returns Vector with {x, y, z} coordinates
   */
  static fromObject(object: { x: number, y: number, z: number, w: number }): Vec4 {
    return new Vec4(object.x, object.y, object.z, object.w);
  } /* fromObject */

  /**
   * vector copying function
   * @returns Copy of this vector
   */
  copy(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  } /* copy */

  /**
   * Vector adding function
   * @param rhs Right operand vector
   * @returns Sum of this and rhs vectors
   */
  add(rhs: Vec4): Vec4 {
    return new Vec4(
      this.x + rhs.x,
      this.y + rhs.y,
      this.z + rhs.z,
      this.w + rhs.w
    );
  } /* add */

  /**
   * Vector subscription function
   * @param rhs Right operand vector
   * @returns Difference of this and rhs vectors
   */
  sub(rhs: Vec4): Vec4 {
    return new Vec4(
      this.x - rhs.x,
      this.y - rhs.y,
      this.z - rhs.z,
      this.w - rhs.w
    );
  } /* sub */

  /**
   * Vector multiplication vector
   * @param rhs Right operand vector or number
   * @returns this multiplied by rhs
   */
  mul(rhs: Vec4 | number): Vec4 {
    if (rhs instanceof Vec4)
      return new Vec4(
        this.x * rhs.x,
        this.y * rhs.y,
        this.z * rhs.z,
        this.w * rhs.w
      );
    return new Vec4(
      this.x * rhs,
      this.y * rhs,
      this.z * rhs,
      this.w * rhs
    );
  } /* mul */

  /**
   * Vector length square getting function
   * @returns Length ** 2
   */
  length2(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  } /* length */

  /**
   * Vector length getting function
   * @returns Length
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  } /* length */

  /**
   * Distance between vectors getting function
   * @param rhs Vector to get distance with
   * @returns Distance
   */
  distance(rhs: Vec4): number {
    let
      dx = this.x - rhs.x,
      dy = this.y - rhs.y,
      dz = this.z - rhs.z,
      dw = this.w - rhs.w;

    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
  } /* distance */

  /**
   * Dot product getting fucntion
   * @param rhs Right operand
   * @returns Dot product
   */
  dot(rhs: Vec4): number {
    return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z + this.w * rhs.w;
  } /* dot */

  /**
   * Vector normalization function
   * @returns Vector with same direction, but 1 length
   */
  normalize(): Vec4 {
    let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);

    return new Vec4(this.x / len, this.y / len, this.z / len, this.w / len);
  } /* normalize */

  /**
   * Negative vector getting function
   * @returns -this
   */
  neg(): Vec4 {
    return new Vec4(-this.x, -this.y, -this.z, -this.w);
  } /* neg */
} /* class Vec4 */

/**
 * 3-component vector class
 */
export class Vec3 {
  x: number;
  y: number;
  z: number;

  /**
   * Vector constructor
   * @param x Vector component
   * @param y Vector component
   * @param z Vector component
   */
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  } /* constructor */

  /**
   * Vector from object create function
   * @param object Object to create vec3 from
   * @returns Vector with {x, y, z} coordinates
   */
  static fromObject(object: { x: number, y: number, z: number }): Vec3 {
    return new Vec3(object.x, object.y, object.z);
  } /* fromObject */

  /**
   * From polar coordinates construction function
   * @param spherical Spherical coordinates
   * @returns Converted vector
   */
  static fromSpherical(spherical: {azimuth: number, elevation: number, radius: number}): Vec3 {
    return new Vec3(
      spherical.radius * Math.sin(spherical.elevation) * Math.cos(spherical.azimuth),
      spherical.radius * Math.cos(spherical.elevation),
      spherical.radius * Math.sin(spherical.elevation) * Math.sin(spherical.azimuth)
    );
  } /* sphericalToCartesian */

  /**
   * Vector to spherical coords converting function
   * @returns Struct with azimuth, elevation and radius
   */
  toSpherical(): {azimuth: number, elevation: number, radius: number} {
    return {
      azimuth: Math.acos(this.y),
      elevation: this.z / Math.abs(this.z) * Math.acos(this.x / Math.sqrt(this.x * this.x + this.z * this.z)),
      radius: this.length(),
    };
  } /* toSpherical */

  /**
   * vector copying function
   * @returns Copy of this vector
   */
  copy(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  } /* copy */

  /**
   * Vector adding function
   * @param rhs Right operand vector
   * @returns Sum of this and rhs vectors
   */
  add(rhs: Vec3): Vec3 {
    return new Vec3(
      this.x + rhs.x,
      this.y + rhs.y,
      this.z + rhs.z,
    );
  } /* add */

  /**
   * Vector subscription function
   * @param rhs Right operand vector
   * @returns Difference of this and rhs vectors
   */
  sub(rhs: Vec3): Vec3 {
    return new Vec3(
      this.x - rhs.x,
      this.y - rhs.y,
      this.z - rhs.z
    );
  } /* sub */

  /**
   * Vector multiplication vector
   * @param rhs Right operand vector or number
   * @returns this multiplied by rhs
   */
  mul(rhs: Vec3 | number): Vec3 {
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

  /**
   * Vector length square getting function
   * @returns Length ** 2
   */
  length2(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  } /* length */

  /**
   * Vector length getting function
   * @returns Length
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  } /* length */

  /**
   * Distance between vectors getting function
   * @param rhs Vector to get distance with
   * @returns Distance
   */
  distance(rhs: Vec3): number {
    let
      dx = this.x - rhs.x,
      dy = this.y - rhs.y,
      dz = this.z - rhs.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  } /* distance */

  /**
   * Dot product getting fucntion
   * @param rhs Right operand
   * @returns Dot product
   */
  dot(rhs: Vec3): number {
    return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
  } /* dot */

  /**
   * Cross product getting function
   * @param rhs Right hand vector
   * @returns Result vector
   */
  cross(rhs: Vec3): Vec3 {
    return new Vec3(
      this.y * rhs.z - rhs.y * this.z,
      this.z * rhs.x - rhs.z * this.x,
      this.x * rhs.y - rhs.x * this.y
    );
  } /* cross */

  /**
   * Vector normalization function
   * @returns Vector with same direction, but 1 length
   */
  normalize(): Vec3 {
    let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    return new Vec3(this.x / len, this.y / len, this.z / len);
  } /* normalize */

  /**
   * Negative vector getting function
   * @returns -this
   */
  neg(): Vec3 {
    return new Vec3(-this.x, -this.y, -this.z);
  } /* neg */
} /* Vec3 */

export class Vec2 {
  x: number;
  y: number;

  /**
   * 2-component constructor
   * @param x X vector component
   * @param y Y vector component
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  } /* constructor */
  
  /**
   * From object create function
   * @param object Objet to get components from
   * @returns 2-component vector with {x, y} coordinates
   */
  static fromObject(object: { x: number, y: number }): Vec2 {
    return new Vec2(object.x, object.y);
  } /* fromObject */

  /**
   * 2-component vector copying function
   * @returns Another vector with same components
   */
  copy() {
    return new Vec2(this.x, this.y);
  } /* copy */

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

/**
 * 4x4 matrix class
 */
export class Mat4 {
  m: number[];

  /**
   * Matrix constructor
   * @param v00 0,0 matrix element
   * @param v01 0,1 matrix element
   * @param v02 0,2 matrix element
   * @param v03 0,3 matrix element
   * @param v10 1,0 matrix element
   * @param v11 1,1 matrix element
   * @param v12 1,2 matrix element
   * @param v13 1,3 matrix element
   * @param v20 2,0 matrix element
   * @param v21 2,1 matrix element
   * @param v22 2,2 matrix element
   * @param v23 2,3 matrix element
   * @param v30 3,0 matrix element
   * @param v31 3,1 matrix element
   * @param v32 3,2 matrix element
   * @param v33 3,3 matrix element
   */
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

  /**
   * Matrix copying function
   * @returns Matrix with exact same data
   */
  copy() {
    return new Mat4(
      this.m[ 0], this.m[ 1], this.m[ 2], this.m[ 3],
      this.m[ 4], this.m[ 5], this.m[ 6], this.m[ 7],
      this.m[ 8], this.m[ 9], this.m[10], this.m[11],
      this.m[12], this.m[13], this.m[14], this.m[15],
    );
  } /* copy */

  /**
   * Matrix transformation function
   * @param v Vector to transform
   * @returns transformed vector
   */
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