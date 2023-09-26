import * as LinMath from '../system/linmath';
import { Topology, Material, Model, UniformBuffer } from "../system/render_resources";
import { System, Unit } from "../system/system";

export class BaseConstruction implements Unit {
  doSuicide: boolean;

  material: Material;
  uniformBuffer: UniformBuffer;
  model: Model;

  floorHeight: number = 4.5;
  floorBase: number = 1.0;
  cutFloor: number = 5;

  private cutHeight: number = Infinity;

  lightingDirection: LinMath.Vec3;

  static async create(system: System, modelPath: string): Promise<BaseConstruction> {
    let result = new BaseConstruction();

    result.uniformBuffer = system.createUniformBuffer();
    result.uniformBuffer.writeData(new Float32Array([0, 1, 0, result.cutHeight]));
    result.uniformBuffer.bufferName = "baseConstructionBuffer";

    result.material = await system.createMaterial("bin/shaders/baseConstruction");
    result.material.addResource(result.uniformBuffer);
    result.model = system.createModelFromTopology(await Topology.modelObj(modelPath), result.material);

    return result;
  } /* create */

  setCutFloor(cutFloor: number) {
    this.cutFloor = cutFloor;
    this.cutHeight = cutFloor * this.floorHeight + this.floorBase;

    this.uniformBuffer.writeData(new Float32Array([0, 1, 0, this.cutHeight]));
  } /* setCutHeight */

  /**
   * Unit response function
   * @param system Class to response by
   */
  response(system: System): void {
    system.drawModel(this.model);
  } /* response */
} /* BaseConstruction */
