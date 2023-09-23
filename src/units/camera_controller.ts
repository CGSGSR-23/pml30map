import {System, Unit} from '../system/system';
import {Vec3} from '../system/linmath';

export class Arcball implements Unit {
  doSuicide: boolean;

  constructor(system: System) {
    system.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      if (event.altKey || event.shiftKey)
        return;
      
      let vec = new Vec3(1, 1, 1);
      let svec = vec.toSpherical();
      let cvec = svec.toVec3();
      if (vec.distance(cvec) > 0.01) {
        console.log(`<${vec.x}, ${vec.y}, ${vec.z}> != <${cvec.x}, ${cvec.y}, ${cvec.z}>`);
      }

      let
        mdx = event.movementX / 200.0,
        mdy = event.movementY / 200.0;
      if ((event.buttons & 1) == 1) {
        let spherical = system.camera.loc.sub(system.camera.at).toSpherical();

        spherical.elevation = spherical.elevation + mdx;
        spherical.azimuth = Math.min(Math.max(spherical.azimuth - mdy, 0.01), Math.PI);

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