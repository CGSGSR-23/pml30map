import React from "react";
import { PushButton } from "./support";
import { ButtonValueType } from "./support";
import { OverFullScreen } from "./support";

export enum FormValueType {
  Text,
  Number,
  // Args:
  //   min: number,
  //   max: number,
  Bool,
  Toggle,
  // Args:
  //   elements: string[]
}

export interface FormValueValueProps {
  type: FormValueType;
  args?: any;
}

interface FromValueState {
  valueRef: React.MutableRefObject<any>
}

interface FormValueProps {
  name: string;
  valueProps: FormValueValueProps;
}
class FormValue extends React.Component<FormValueProps, FromValueState> {

  constructor( props: FormValueProps ) {
    super(props);

    this.state = {
      valueRef: React.createRef(),
    };
  }

  renderValue(): JSX.Element {
    switch (this.props.valueProps.type) {
      case FormValueType.Text:
        return (<input ref={this.state.valueRef} type="text" placeholder="value"/>);
      case FormValueType.Number:
        return (<input ref={this.state.valueRef} type="number" min={this.props.valueProps.args.min} max={this.props.valueProps.args.max}/>);
      case FormValueType.Bool:
        return (<PushButton ref={this.state.valueRef} name={this.props.name} valueType={ButtonValueType.EnabledDisabled}/>);
      case FormValueType.Toggle:
        return (
          <select ref={this.state.valueRef}>
            {this.props.valueProps.args.elements.map((e, i)=>{
              return (<option key={i} value={e}>{e}</option>);
            })}
          </select>
        );
    }
  }

  getValue() {
    switch (this.props.valueProps.type) {
      case FormValueType.Text:
        return this.state.valueRef.current.value as string;
      case FormValueType.Number:
        return this.state.valueRef.current.valueAsNumber as number;
      case FormValueType.Bool:
        return this.state.valueRef.current.getValue() as boolean; // tmp
      case FormValueType.Toggle:
        return this.state.valueRef.current.value; // tmp ??
    }
  }

  render() {
    return (
      <div className="flexRow spaceBetween alignCenter">
         {this.props.name}: {this.renderValue()}
      </div>
    );
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

interface OverlayState {
  messageStack: Array<Message>;
  showOverBox: boolean;
  overBoxJSX: JSX.Element;
  isLoading: boolean;
}

export class Overlay extends React.Component<{}, OverlayState> {
  messageLifeTime = 5000;
  formValues: React.MutableRefObject<FormValue>;

  constructor( props: { value: string, onLoadCallBack?: ()=>void } ) {
    super(props);
    this.state = {
      messageStack: [],
      showOverBox: false,
      overBoxJSX: (<></>),
      isLoading: false,
    };
  }

  render() {
    return (<>
    <div style={{
      zIndex: 900,
      position: 'absolute',
      alignItems: 'center',
      bottom: 0,
      left: 0,
    }}>
      {this.state.messageStack.map((e)=>{
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
    </div>
    {this.state.showOverBox && <OverFullScreen zIndex={9001}>
      {this.state.overBoxJSX}
    </OverFullScreen>}
    </>);
  }

  protected shiftMessageStack() {
    this.state.messageStack.shift();
    this.setState({ messageStack: this.state.messageStack});
  }

  submitMessage( m: Message ) {
    this.state.messageStack.push(m);
    this.setState({ messageStack: this.state.messageStack });
    setTimeout(()=>{ this.shiftMessageStack(); }, this.messageLifeTime);
  }

  log( m: string ) {
    this.submitMessage({ str: m, type: MessageType.log });
  }
  
  success( m: string ) {
    this.submitMessage({ str: m, type: MessageType.success });
  }

  error( m: string ) {
    this.submitMessage({ str: m, type: MessageType.error });
  }

  warning( m: string ) {
    this.submitMessage({ str: m, type: MessageType.warning });
  }

  submitForm( name: string, valuesProps: FormValueProps[], onClickCallBack: ( values: any )=>void, okButtonValue: string = 'ok'): boolean {
    if (this.state.showOverBox)
      return false;

    this.setState({
      showOverBox: true,
      overBoxJSX: (<div className="box flexColumn">
        <div><h2>{name}</h2></div>
        {valuesProps.map((value)=>{
          return (<FormValue name={value.name} valueProps={value.valueProps}/>);
        })}
        <div>
          <input type="button" value={okButtonValue} onClick={()=>{
            onClickCallBack({});
            this.setState({ showOverBox: false });
          }}/>
           <input type="button" value={'Cancel'} onClick={()=>{
            this.setState({ showOverBox: false });
          }}/>
        </div>
      </div>)
    });
    return true;
  }

  loading() {
    this.setState({ isLoading: true });
  }
}