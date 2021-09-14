
import React from 'react';
import ReactDOM from 'react-dom';

import {Component} from 'react';

//import {style} from './internal';

export class Disk extends Component {
    constructor(props){
        super(props);
    }
    public render() {
      return (
        <div class={"disk"} style={{
          width:this.props.width,
          height:this.props.height
        }}>
          <div
            class="disk-order-wrapper"
            style={{
              lineHeight: `${this.props.height}px`
            }}>
            {`${this.props.order}`}
          </div>
        </div>
      );
    }
  }
  