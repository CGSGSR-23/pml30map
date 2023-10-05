import * as React from 'react'

import * as LinMath from '../system/linmath';
import { Topology, Material, Model, UniformBuffer, Texture, TextureComponentType } from "../system/render_resources";
import { System, Unit } from "../system/system";

export class Banner implements Unit {
  unitType: string = "Banner";
  doSuicide: boolean;

  letterHeight: number = 1.0;
  position: LinMath.Vec3 = new LinMath.Vec3(0.0, 0.0, 0.0);
  hidden: boolean = false;

  private texture: Texture;
  private material: Material;
  private bannerBuffer: UniformBuffer;
  private model: Model;
  private bannerText: string = "unknown";

  /**
   * Create function
   */
  static async create(system: System, initialText: string = "undefined"): Promise<Banner> {
    let unit = new Banner();

    unit.material = await system.createMaterial("bin/shaders/banner");
    
    unit.texture = system.createTexture(1, 1, TextureComponentType.BYTE, 4);
    unit.material.resources.push(unit.texture);
    
    unit.bannerBuffer = system.createUniformBuffer();
    unit.bannerBuffer.bufferName = "bannerBuffer";
    unit.material.resources.push(unit.bannerBuffer);

    unit.model = system.createModelFromTopology(Topology.square(), unit.material);
    unit.text = initialText;

    return unit;
  } /* create */

  get text(): string {
    return this.bannerText;
  } /* get text */

  set text(newText: string) { 
    let ctx = document.createElement('canvas').getContext("2d");

    ctx.canvas.width = 40 * newText.length;
    ctx.canvas.height = 120;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = `${ctx.canvas.height * 0.5}px consolas`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = '#FFFFFF';

    ctx.fillText(newText, ctx.canvas.width / 2, ctx.canvas.height / 2);

    let image = document.createElement("img") as HTMLImageElement;
    image.src = ctx.canvas.toDataURL();

    image.onload = () => {
      this.texture.setImage(image);
    };

    image.remove();
    ctx.canvas.remove();

    this.bannerText = newText;
  } /* set text */

  response(system: System): void {
    if (!this.hidden) {
      let up = system.camera.up;
      let rgh = system.camera.right.mul(this.text.length / 3.0);
      let pos = this.position;
      let data = new Float32Array([
        up.x,  up.y,  up.z,  1,
        rgh.x, rgh.y, rgh.z, 1,
        pos.x, pos.y, pos.z, this.letterHeight,
      ]);
  
      this.bannerBuffer.writeData(data);
      system.drawModel(this.model);
    }
} /* response */
} /* Banner */
