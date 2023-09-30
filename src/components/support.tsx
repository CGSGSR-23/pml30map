import React from "react";

export async function getJson( url: string ) {
  return fetch(url).then(res=>{ return res.json(); });
} /* End of 'getJson' function */ 

export function queryToStr( obj: any ): string {
  var queryStr = "";

  Object.keys(obj).map(( name, i )=>{
    if (obj[name] != undefined)
      queryStr += (i != 0 ? '&' : '') + name + '=' + obj[name];
  });

  return queryStr;
} /* End of 'queryToStr' function */


export function loadImg( fileName: string ): Promise<HTMLImageElement> {
  var img = new Image();
  img.src = "./bin/imgs/" + fileName;
  return new Promise( async (resolve) => {
    img.onload = ()=>{ resolve(img); };
  });
} /* loadImg */

export function getQuery(): any {
  const urlParams = new URLSearchParams(window.location.search);
  var out = {};
  urlParams.forEach((value, name)=>{
    out = {
      ...out,
      [name]: value,
    }
  });

  return out;
}

export class InputFile extends React.Component<{ value: string, onLoadCallBack?: ()=>void }, { inputRef: React.MutableRefObject<any>; isSelected: boolean, value: string }> {
  
  constructor( props: { value: string, onLoadCallBack?: ()=>void } ) {
    super(props);
    this.state = {
      inputRef: React.createRef(),
      isSelected: false,
      value: props.value,
    };
  }

  render() {
    return (<div className="flexRow">
      <label className="typeButton" style={{
        display: 'inline-block',
        cursor: 'pointer',
        textAlign: 'center',
        flex: 1,
      }}>
        <input ref={this.state.inputRef} type="file" style={{
          display: 'none',
        }} onChange={(e)=>{
          console.log(e);
          const files: FileList = e.target.files;
          this.setState({ isSelected: true, value: files.length > 0 ? files.item(0).name : this.props.value});
        }}/>
        {this.state.value}
      </label>
      {this.state.isSelected && <>
        <input type="button" value="X" onClick={()=>{
          this.reset();
        }}/>
        <input type="button" value=">" onClick={()=>{
          if (this.props.onLoadCallBack != undefined)
            this.props.onLoadCallBack();
          this.setState({ isSelected: false });
        }}/>
      </>}
    </div>
    );
  }

  reset() {
    this.setState({ isSelected: false, value: this.props.value});
  }

  getFiles(): File[] {
    return this.state.inputRef.current.files;
  }

}

export enum MessageType {
  log = 'log',
  success = 'success',
  warning = 'warning',
  error = 'error',
}

export interface Message {
  type: MessageType,
  str: string,
}

interface LogListState {
  massageStack: Array<Message>;
}

export class LogList extends React.Component<{}, LogListState> {
  messageLifeTime = 5000;

  constructor( props: { value: string, onLoadCallBack?: ()=>void } ) {
    super(props);
    this.state = {
      massageStack: [],
    };
  }

  render() {
    return (<div style={{
      zIndex: 900,
      position: 'absolute',
      //right: 0,
      //top: 0,
      //left: 0,
      //bottom: 0,
      //display: 'flex',
      //justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      left: 0,
    }}>
      {this.state.massageStack.map((e)=>{
        var boxStyle = 'box';

        switch (e.type) {
          case MessageType.log:
            break;
          case MessageType.success:
            boxStyle = 'boxSuccess';
            break;
          case MessageType.warning:
            boxStyle = 'boxWarning';
            break;
          case MessageType.error:
            boxStyle = 'boxError';
            break;
        }
        return (<div className={`gapped ${boxStyle}`}>
          <p>{e.str}</p>
        </div>);
      })}
    </div>);
  }

  shift() {
    this.state.massageStack.shift();
    this.setState({ massageStack: this.state.massageStack});
  }

  log( m: Message ) {
    this.state.massageStack.push(m);
    this.setState({ massageStack: this.state.massageStack });
    setTimeout(()=>{ this.shift(); }, this.messageLifeTime);
  }

}