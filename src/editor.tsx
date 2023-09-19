import * as React from "react";
import { renderC } from "./component";
import { System, Unit } from "./system/system";
import { Target } from "./system/render_resources";

class FrameCounter implements Unit {
  doSuicide: boolean;
  frameIndex: number = 0;

  constructor() {
    const listenFunction = (key) => {
      if (key.key != 'w')
        return;
      console.log("Suicide!");
      this.doSuicide = true;

      document.removeEventListener("keydown", listenFunction);
    };

    document.addEventListener("keydown", listenFunction)
  } /* constructor */
  
  response(system: System) {
    console.log(`Current frame: ${this.frameIndex++}`);
  } /* response */
} /* TestUnit */

class Editor extends React.Component<{}, { ref: React.MutableRefObject<any> }> {
  system: System = null;

  constructor() {
    super({});

    this.state = {
      ref: React.createRef(),
    };
  }

  resize() {
    this.system.canvas.width = this.state.ref.current.clientWidth;
    this.system.canvas.height = this.state.ref.current.clientHeight;

    this.system.defaultTarget.resize(this.system.canvas.width, this.system.canvas.height);
    this.system.target.resize(this.system.canvas.width, this.system.canvas.height);
  } /* resize */

  render() {
    window.addEventListener("resize", this.resize);

    return (<canvas style={{width: '100%', height: '100%'}} onContextMenu={(event) => { event.preventDefault(); }} ref={this.state.ref}/>);
  } /* render */

  async componentDidMount() {
    this.system = await System.create(this.state.ref.current);
    this.resize();

    // this.system.addUnit(new FrameCounter());

    this.system.runMainLoop();
  } /* componentDidMount */
} /* class Editor */

renderC('test-container', <>
    <Editor></Editor>
</>);
