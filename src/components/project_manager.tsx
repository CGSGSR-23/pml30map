import React, { createRef } from "react";
import { Config, MapConfig } from "../../server/map_config";
import { FloorInfo } from "../../server/map_config";
import { Vec2 } from "../system/linmath";
import { uploadFile } from "./upload";
import { MapEdit } from "../map_edit";
import { InputFile, LogList, MessageType } from "./support";

import { MinimapEditReqType, MinimapPosType } from "../../server/client";

export interface ProjectManagerProps {
  socket: MapEdit;
  logListRef: LogList;
  closeCallBack: ()=>void;
  goToMapCallBack: ( map: string )=>void;
}

export interface ProjectManagerState {
  config: Config,
}

export class ProjectManager extends React.Component<ProjectManagerProps, ProjectManagerState> {
  constructor( props: ProjectManagerProps ) {
    super(props);
    this.state = {
      config: undefined,
    };
  } 
  
  async updateConfig() {
    await this.props.socket.updateConfig();
    const c = (await this.props.socket.socket.send('getConfigReq')) as Config;

    return new Promise<void>((resolve)=>{
      this.setState({
        config: c,
      }, ()=>{
        resolve();
      });
    });  
  }

  render() {
    return (
      <div className="box">
        <div className="flexRow spaceBetween">
          <h2>Project manager</h2>
          <input type="button" value="close" onClick={this.props.closeCallBack}/>
        </div>
        <h3>Projects:</h3>
        <div className="flexColumn">
          {this.state.config != undefined && <>
            {this.state.config.maps.map((m)=>{
              return (<div className="flexRow spaceBetween">
                <p>{m.name}</p>
                <input type="button" value="open" onClick={()=>{
                  this.props.goToMapCallBack(m.name);
                }}/>
              </div>);
            })}
          </>}
        </div>
        <div>
          <h3>Other options (temp shit):</h3>
          <input type="button" value="Create new Project" onClick={()=>{
            console.log('Create new project...');
          }}/>
          <input type="text" placeholder="project name"/>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    await this.updateConfig();
  }
}
