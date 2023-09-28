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