import React from "react";

import { renderC } from "../component";

function Comp( props: { str: string } ): JSX.Element {
  return (<p>{props.str}</p>);
}

export function C( str: string ) {
  renderC('test-container', <Comp str={str}></Comp>);
}