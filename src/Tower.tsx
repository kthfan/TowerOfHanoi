
import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import {Component} from 'react';

import {Disk, playSound, put_disk_mp3, useSound} from './internal';

export class Tower extends Component {

  static SOURCE_TOWER = "source";
  static DESTINATION_TOWER = "destination";
  static REMAINING_TOWER = "remaining";
  static currentUpdateToken = 0;

  constructor(props){
    super(props)
    this.state = {
      disks: this.props.children ?? [],
      updateToken: Tower.currentUpdateToken,
      isSelected: false,
      isHovered: false,
      warn: false,
      warnMessage: ""
    }
  }
  static getDerivedStateFromProps(props, current_state) {
    var update : any = {
    };
    if(Tower.currentUpdateToken !== current_state.updateToken){
      update.updateToken = Tower.currentUpdateToken;
      update.disks = props.type === Tower.SOURCE_TOWER?
         props.children : 
         [];
    }
    return Object.keys(update).length === 0 ? null : update;
  }
  
  private onHover() {
    this.setState({
      isHovered: true
    });
  }
  private onUnhover() {
    this.setState({
      isHovered: false
    });
  }

  public putDisk(disk:Disk){
    // console.log("to", this.props.type, ":", disk.props.order)
    this.state.disks.push(disk)
    this.setState({disks: this.state.disks});
    playSound(put_disk_mp3);
    return this.state.disks.length;
  }
  public takeDisk() : Disk{
    var disk = this.state.disks.pop();
    // console.log("from", this.props.type, ":", disk.props.order)
    this.setState({disks: this.state.disks});
    return disk;
  }
  public warnUser(msg:string){
    var T = this;
    this.setState({
      warn: true,
      warnMessage: msg
    })
    setTimeout(()=>T.setState({
      warn: false,
      warnMessage: ""
    }), 3000)
  }

  public render() {
    // console.log("Tower", this.props.type, this.state.disks);
    let diskLayerTop = - this.state?.disks?.reduce((res, disk) => disk.props.height + res , 0)
    return (
      <div 
        class={"tower"}
        style={{width:this.props.width, height:this.props.height}}
        onClick={this.props.onClick.bind(this)}>
        <div 
          class={classNames(
            "tower-rod-layer",
            {"tower-hovered": this.state.isHovered},
            {"tower-selected": this.state.isSelected}
          )}
          onMouseEnter={this.onHover.bind(this)}
          onMouseLeave={this.onUnhover.bind(this)}>
          <div class={`rod ${this.props.type}-rod`}></div>
        </div>
        <div
          class={"tower-disks-layer"}
          style={{marginTop: diskLayerTop}}
          onMouseEnter={this.onHover.bind(this)}
          onMouseLeave={this.onUnhover.bind(this)}>
          <div class={"disk-area"}>
              {this.state.disks} 
          </div>
        </div>
        {
          ((warn, msg) => 
            warn ? 
              <div class={"centering-message-box error-message-box tower-message-box"}>{msg}</div>
              : null
          )(this.state.warn, this.state.warnMessage)
        }
      </div>
    );
  }
}
