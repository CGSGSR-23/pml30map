/**
 * Skysphere unit implementation module
 */

import {Topology, Model, UniformBuffer, Material, Texture, TextureComponentType} from '../system/render_resources';
import {System, Unit} from '../system/system';
import {Vec3} from '../system/linmath';
import { promises } from 'fs';

/**
 * Skysphere class
 */
export class Skysphere implements Unit {
  private system: System;

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
    result.translateTexture = system.createTexture(4, 4, TextureComponentType.BYTE, 3, null);

    result.model = system.createModelFromTopology(Topology.tetrahedron(), result.material);

    result.uniformBuffer = system.createUniformBuffer();
    result.uniformBuffer.writeData(new Float32Array([0.0, 0.0, 0.0, 0.0]));
    
    result.uniformBuffer.bufferName = "translateBuffer";
    
    result.system = system;
    
    result.material.addResource(result.skyTexture);
    result.material.addResource(result.uniformBuffer);

    return result;
  } /* create */

  private translateTexture: Texture;
  private isTranslate: boolean;
  private translateStart: number;
  private translateLength: number = 1.0;
  
  async translateSkyTexture(path: string) {
    this.uniformBuffer.writeData(new Float32Array([1.0, 0.0, 0.0, 0.0]));
    
    await this.translateTexture.load(path);
    this.translateStart = this.system.timer.getCurrentTime();
    this.material.resources = [this.skyTexture, this.translateTexture, this.uniformBuffer];
    this.isTranslate = true;
  } /* translateSkyTexture */
  
  private endTranslate() {
    this.isTranslate = false;

    // swap textures
    let tmp = this.translateTexture;
    this.translateTexture = this.skyTexture;
    this.skyTexture = tmp;

    this.material.resources = [this.skyTexture, this.translateTexture, this.uniformBuffer];
    this.uniformBuffer.writeSubData(new Float32Array([0.0]), 0);
  } /* endTranslate */

  private _skyTexturePath: string;
  async loadSkyTexture(path: string) {
    if (path !== this._skyTexturePath) {
      await this.skyTexture.load(path);
      this._skyTexturePath = path;
    }
  } /* loadSkyTexture */
  
  set skyTexturePath(path: string) {
    this.loadSkyTexture(path);
  } /* skyTexturePath */

  get skyTexturePath(): string {
    return this._skyTexturePath;
  } /* skyTexturePath */
  
  /**
   * Response function
   * @param system System reference
  */
  response(system: System): void {
    if (this.isTranslate) {
      let translateCoef = (system.timer.time - this.translateStart) / this.translateLength;

      if (translateCoef <= 1)
        this.uniformBuffer.writeSubData(new Float32Array([translateCoef]), 4);
      else
        this.endTranslate();
    }

    system.drawModel(this.model);
  } /* response */
} /* class Skysphere */

/* skysphere.ts */