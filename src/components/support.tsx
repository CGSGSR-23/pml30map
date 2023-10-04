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

export enum ButtonValueType {
  ValueName = 'ValueName',
  EnabledDisabled = 'EnabledDisabled',
  ActivePassive = 'ActivePassive',
  OnOff = 'OnOff',
}

interface PushButtonProps {
  name: string,
  value?: boolean,
  onChange?: ( newValue: boolean)=>void,
  valueType?: ButtonValueType,
}

interface PushButtonState {
  value,
}

export class PushButton extends React.Component<PushButtonProps, PushButtonState> {
  constructor( props: PushButtonProps ) {
    super(props);

    this.state = {
      value: props.value != undefined ? props.value : false,
    };
  }

  getValue(): boolean {
    return this.state.value;
  }

  setValue( newValue: boolean ): void {
    this.setState({ value: newValue });
  }

  getButtonValue() {
    if (this.props.valueType == undefined)
      return this.props.name;

    switch (this.props.valueType) {
      case ButtonValueType.ValueName:
        return this.props.name;
      case ButtonValueType.ActivePassive:
        if (this.state.value)
          return 'Active';
        else
          return 'Passive';
      case ButtonValueType.EnabledDisabled:
        if (this.state.value)
          return 'Enable';
        else
          return 'Disable';
      case ButtonValueType.OnOff:
        if (this.state.value)
          return 'On';
        else
          return 'Off';
    }
  }

  render() {
    return (
      <input type="button" className={`${this.state.value ? 'active' : ''}`} value={this.getButtonValue()} onClick={()=>{
        if (this.props.onChange != undefined)
          this.props.onChange(!this.state.value);
        this.setState({ value: !this.state.value });
      }}/>
    );
  }
}