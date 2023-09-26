import * as React from 'react'

import * as LinMath from '../system/linmath';
import { Topology, Material, Model, UniformBuffer } from "../system/render_resources";
import { System, Unit } from "../system/system";

export class BaseConstruction implements Unit {
  unitType: string = "BaseConstruction";
  doSuicide: boolean;

  material: Material;
  uniformBuffer: UniformBuffer;
  model: Model;

  color: LinMath.Vec3 = new LinMath.Vec3(1, 1, 1);
  floorHeight: number = 4.5;
  floorBase: number = 1.0;
  private cutHeight: number = Infinity;
  lightingDirection: LinMath.Vec3;

  constructor() {
    // super({});
  } /* constructor */

  static async create(system: System, modelPath: string): Promise<BaseConstruction> {
    let result = new BaseConstruction();

    result.uniformBuffer = system.createUniformBuffer();
    result.uniformBuffer.writeData(new Float32Array([1, 1, 1, result.cutHeight]));
    result.uniformBuffer.bufferName = "baseConstructionBuffer";

    result.material = await system.createMaterial("bin/shaders/baseConstruction");
    result.material.addResource(result.uniformBuffer);
    result.model = system.createModelFromTopology(await Topology.modelObj(modelPath), result.material);

    return result;
  } /* create */

  private currentTopFloor: number = 10.0;

  set topFloor(newTopFloor: number) {
    this.currentTopFloor = newTopFloor;

    this.currentTopFloor = newTopFloor;
    this.cutHeight = newTopFloor * this.floorHeight + this.floorBase;

    this.uniformBuffer.writeData(new Float32Array([this.color.x, this.color.y, this.color.z, this.cutHeight]));
  } /* set topFloor */

  get topFloor(): number {
    return this.currentTopFloor;
  } /* get topFloor */

  /**
   * Unit response function
   * @param system Class to response by
   */
  response(system: System): void {
    system.drawModel(this.model);
  } /* response */
} /* BaseConstruction */
