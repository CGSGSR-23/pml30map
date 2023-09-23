/**
 * Skysphere unit implementation module
 */

import {Topology, Model, UniformBuffer, Material, Texture} from '../system/render_resources';
import {System, Unit} from '../system/system';
import {Vec3} from '../system/linmath';

/**
 * Skysphere class
 */
export class Skysphere implements Unit {
  doSuicide: boolean;

  model: Model;

  skyTexture: Texture;
  material: Material;
  uniformBuffer: UniformBuffer;

  /**
   * Skysphere create function
   * @param system System this skysphere will belong to
   * @param imageURL URL of initial image this sphere is setted to
   */
  static async create(system: System, imageURL: string): Promise<Skysphere> {
    console.log(imageURL);
    let result = new Skysphere();

    result.material = await system.createMaterial("bin/shaders/skysphere");
    result.skyTexture = await system.createTextureFromURL(imageURL);
    result.material.addResource(result.skyTexture);
    result.model = system.createModelFromTopology(Topology.tetrahedron(), result.material);

    return result;
  } /* create */

  setImage(path: string) {
    this.skyTexture.load(path);
  } /* setImage */

  /**
   * Response function
   * @param system System reference
   */
  response(system: System): void {
    system.drawModel(this.model);
  } /* response */
} /* class Skysphere */

/* skysphere.ts */