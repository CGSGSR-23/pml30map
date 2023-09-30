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
  unitType: string = "Skysphere";
  doSuicide: boolean;

  model: Model;

  skyTexture: Texture;
  material: Material;
  uniformBuffer: UniformBuffer;

  /**
   * Skysphere create function
   * @param system System this skysphere will belong to
   * @param image URL of initial image this sphere is setted to
   */
  static async create(system: System, image: string): Promise<Skysphere> {
    let result = new Skysphere();

    result.material = await system.createMaterial("bin/shaders/skysphere");

    result.skyTexture = await system.createTextureFromURL(image);
    result.material.addResource(result.skyTexture);
    result.model = system.createModelFromTopology(Topology.tetrahedron(), result.material);

    return result;
  } /* create */

  /**
   * Image to skysphere setting function
   * @param image image to set
   */
  setImage(image: HTMLImageElement) {
    this.skyTexture.setImage(image);
  } /* setImage */

  private _skyTexturePath: string;

  set skyTexturePath(path: string) {
    if (path !== this._skyTexturePath) {
      this.skyTexture.load(path);
      this._skyTexturePath = path;
    }
  } /* skyTexturePath */

  get skyTexturePath(): string {
    return this._skyTexturePath;
  } /* skyTexturePath */

  /**
   * Response function
   * @param system System reference
   */
  response(system: System): void {
    system.drawModel(this.model);
  } /* response */
} /* class Skysphere */

/* skysphere.ts */