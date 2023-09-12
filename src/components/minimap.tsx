import React from 'react';

interface MinimapProps {

}

interface MinimapState {
}

export class Minimap extends React.Component<MinimapProps, MinimapState> {
  constructor( props: MinimapProps ) {
    super(props);
  }

  render() {
    return (
      <div style={{
        position: 'absolute',
        border: '2px solid green'
      }}>
        <h2>Settings</h2>
        <div>
          <canvas id="minimapCanvas" style={{
            background: 'solid black'
          }}></canvas>
        </div>
        <div>Location: AAAAA</div>
        <input type="button" id="toEditor" value="to Editor"/>
        <input type="button" id="toServer" value="To Server"/>
      </div>
    );
  }
}

