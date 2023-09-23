import {System, Unit} from '../system/system';
import {Vec3} from '../system/linmath';

export class FlyCamera implements Unit {
  doSuicide: boolean;

  constructor(system: System) {
    system.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      if (event.altKey || event.shiftKey)
        return;

      let
        mdx = event.movementX / 200.0,
        mdy = event.movementY / 200.0;
      if ((event.buttons & 1) == 1) {
        let spherical = system.camera.dir.toSpherical();

        spherical.azimuth += mdx;
        spherical.elevation += mdy;
  
        spherical.elevation = Math.min(Math.max(spherical.elevation, 0.01), Math.PI);

        system.camera.set(system.camera.loc, system.camera.loc.add(Vec3.fromSpherical(spherical)), new Vec3(0, 1, 0));
      }
    });

    system.canvas.addEventListener("keydown", (event: KeyboardEvent) => {

    });
  } /* constructor */

  response(system: System) {

  } /* create */
} /* FlyCamera */




