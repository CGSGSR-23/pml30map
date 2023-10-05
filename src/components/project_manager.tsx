import React, { createRef } from "react";
import { Config, MapConfig } from "../../server/map_config";
import { FloorInfo } from "../../server/map_config";
import { Vec2 } from "../system/linmath";
import { uploadFile } from "./upload";
import { MapEdit } from "../map_edit";
import { InputFile } from "./support";
import { Overlay, MessageType } from "./overlay";

import { MinimapEditReqType, MinimapPosType } from "../../server/client";

export interface ProjectManagerProps {
  socket: MapEdit;
  logListRef: Overlay;
  closeCallBack: ()=>void;
  goToMapCallBack: ( map: string )=>void;
}

export interface ProjectManagerState {
  config: Config;
  inputRef: React.MutableRefObject<any>;
  showCreateProjectBox: boolean;
  showDeleteSureBox: boolean;
  deleteProjectName: string;
}

export class ProjectManager extends React.Component<ProjectManagerProps, ProjectManagerState> {
  constructor( props: ProjectManagerProps ) {
    super(props);
    this.state = {
      config: undefined,
      inputRef: React.createRef(),
      showCreateProjectBox: false,
      showDeleteSureBox: false,
      deleteProjectName: "",
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
        <div className="flexColumn">
          {this.state.config != undefined && <>
            {this.state.config.maps.map((m)=>{
              return (<div className="flexRow spaceBetween">
                <p>{m.name}</p>
                <div>
                  <input type="button" value="delete" onClick={()=>{
                    this.setState({ showDeleteSureBox: true, deleteProjectName: m.name });
                  }}/>
                  <input type="button" value="open" onClick={()=>{
                    this.props.goToMapCallBack(m.name);
                  }}/>
                </div>
              </div>);
            })}
          </>}
        </div>
        <div>
          <h3>Other options (temp shit):</h3>
          <input type="button" value="Create new Project" onClick={async ()=>{
            this.setState({ showCreateProjectBox: true });
          }}/>
        </div>
        {this.state.showCreateProjectBox &&
          <div style={{
            zIndex: 5,
            position: 'absolute',
            backgroundColor: 'var(--shadow2-color)',  
            
            right: 0,
            top: 0,
            left: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div className="box flexRow">
              Project name: <input ref={this.state.inputRef} type="text"/><input type="button" value="Create" onClick={async ()=>{
                const res = await this.props.socket.socket.send('createProjectReq', this.state.inputRef.current.value);
                
                if (!res)
                  this.props.logListRef.log({ str: "Project with such name already exist", type: MessageType.error });
                else
                {
                  await this.updateConfig();
                  this.setState({ showCreateProjectBox: false });  
                }
              }}/><input type="button" value="Cancel" onClick={async ()=>{
                this.setState({ showCreateProjectBox: false });  
              }}/>
            </div>
          </div>
        }
        {this.state.showDeleteSureBox &&
          <div style={{
            zIndex: 5,
            position: 'absolute',
            backgroundColor: 'var(--shadow2-color)',  
            
            right: 0,
            top: 0,
            left: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div className="box flexRow">
              Are you sure you want to delete project: <div>
                <input type="button" value="Delete" onClick={async ()=>{
                  await this.props.socket.socket.send('deleteProjectReq', this.state.deleteProjectName);
                  await this.updateConfig();
                  this.setState({ showDeleteSureBox: false, deleteProjectName: '' });
                }}/><input type="button" value="Cancel" onClick={()=>{
                  this.setState({ showDeleteSureBox: false, deleteProjectName: '' });
                }}/>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }

  async componentDidMount() {
    await this.updateConfig();
  }
}
