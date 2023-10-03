import {System, Unit} from '../system/system';
import {Vec3, Size} from '../system/linmath';

export class Arcball implements Unit {
  unitType: string = "ArcballCameraController";
  doSuicide: boolean;

  constructor(system: System) {
    system.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      if (event.altKey || event.shiftKey)
        return;

      let
        mdx = event.movementX / 200.0,
        mdy = event.movementY / 200.0;
      if ((event.buttons & 1) == 1) {
        let spherical = system.camera.loc.sub(system.camera.at).toSpherical();

        spherical.elevation = spherical.elevation + mdx;
        spherical.azimuth = Math.min(Math.max(spherical.azimuth - mdy, 0.01), Math.PI - 0.01);

        system.camera.set(system.camera.at.add(spherical.toVec3()), system.camera.at);
      }

      if ((event.buttons & 2) == 2) {
        let directionLength = system.camera.loc.distance(system.camera.at);
        let delta = system.camera.right.mul(-mdx).add(system.camera.up.mul(mdy)).mul(directionLength / 5.0);

        system.camera.set(system.camera.loc.add(delta), system.camera.at.add(delta));
      }
    });

    system.canvas.addEventListener("wheel", (event: WheelEvent) => {
      if (event.altKey || event.shiftKey)
        return;

        let wd = event.deltaY / 600.0;
        let delta = system.camera.loc.sub(system.camera.at);
        let deltalength = delta.length();
        let newlength = Math.max((wd + 1) * deltalength, 0.01);

        system.camera.set(
          system.camera.at.add(delta.mul(newlength / deltalength)),
          system.camera.at
        );
    });
  } /* constructor */

  /**
   * Create function
   * @param system System reference
   */
  static create(system: System): Arcball {
    return new Arcball(system);
  } /* create */

  response(system: System) {

  } /* create */
} /* FlyCamera */

/**
 * Fixed arcball camera
 */
export class FixedArcball implements Unit {
  unitType: string = "FixedArcballCameraController";
  doSuicide: boolean;
  system: System;
  distance: number = 3.0;
  minProjSize: number = 0.1;
  maxProjSize: number = 2.0;

  static create(system: System): FixedArcball {
    let camera = new FixedArcball();

    camera.system = system;
    system.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (event.altKey || event.shiftKey)
        return;

      let
        mdx = event.movementX / 200.0,
        mdy = event.movementY / 200.0;

        if ((event.buttons & 1) == 1) {
          let spherical = system.camera.loc.sub(system.camera.at).toSpherical();
  
          spherical.elevation = spherical.elevation - mdx;
          spherical.azimuth = Math.min(Math.max(spherical.azimuth + mdy, 0.01), Math.PI - 0.01);
          spherical.radius = camera.distance;
  
          system.camera.set(system.camera.at.add(spherical.toVec3()), system.camera.at);
        }
      });

    system.canvas.addEventListener('wheel', (event: WheelEvent) => {
      let mdw = event.deltaY / 100.0;

      let d = (system.camera.projSize.w - camera.minProjSize) / (camera.maxProjSize - camera.minProjSize);

      d += mdw / 10.0;
      d = Math.min(0.99, Math.max(0.01, d));
      d = d * (camera.maxProjSize - camera.minProjSize) + camera.minProjSize;

      system.camera.projSet(system.camera.near, system.camera.far, new Size(d, d));
    });

    return camera;
  } /* create */

  response(system: System): void {
    this.system = system;
  } /* response */
} /* FixedArcball */