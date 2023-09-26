import * as React from 'react'

import * as LinMath from '../system/linmath';
import { Topology, Material, Model, UniformBuffer, Texture } from "../system/render_resources";
import { System, Unit } from "../system/system";

export class Banner implements Unit {
  unitType: string = "Banner";
  doSuicide: boolean;

  letterHeight: number;

  private texture: Texture;
  private bannerText: string;

  get text(): string {
    return "amogus";
  }

  set text(newText: string) { 
    let canvas = document.createElement('canvas');

    canvas.width = 800;
    canvas.height = 600;
  } /* text */

  /**
   * Create function
   */
  static create(system: string): Banner {
    let unit = new Banner();

    return unit;
  } /* create */

  response(system: System): void {
    
  } /* response */
} /* Banner */
