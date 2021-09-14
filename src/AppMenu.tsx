

import React from 'react';
import ReactDOM from 'react-dom';

import {Component} from 'react';

import {HanoiTower, useSound, volume_max_png, volume_mute_png} from './internal';


export class AppMenu extends Component {
    
    constructor(props){
        super(props)
        var T = this; 

        this.state = {
            step: props.step,
            autoSpeed: 1,
            isAutoRunning: false,
            useSound: false
        }
        
    }
    static getDerivedStateFromProps(props, current_state) {
        var update : any = {};
        if (current_state.step !== props.step) {
            update.step = props.step;
        }
        if (current_state.isAutoRunning !== props.isAutoRunning) {
            update.isAutoRunning = props.isAutoRunning;
        }
        
        return Object.keys(update).length === 0 ? null : update;
    }

    private undoClickListener(e){
        this.props.onUndoClick?.(e);
    }
    private redoClickListener(e){
        this.props.onRedoClick?.(e);
    }
    private autoClickListener(e){
        var isAutoRunning = this.state.isAutoRunning;

        e.isAutoRunning = isAutoRunning;
        if(!this.props.onAutoClick?.(e)) return;
        this.setState({
            isAutoRunning: !e.isAutoRunning
        });
    }
    private resetClickListener(e){
        this.props.onResetClick?.(e);
    }
    private nDropDownInputListener(e){
        e.n = Number.parseInt(e.target.value);
        if(!Number.isNaN(e.n)) this.props.onNDropDownInput?.(e);
    }
    private rDropDownInputListener(e){
        e.r = Number.parseInt(e.target.value);
        if(!Number.isNaN(e.r)) this.props.onRDropDownInput?.(e);
    }
    private autoSpeedSlideInputListener(e){
        e.speed = Number.parseFloat(e.target.value);
        if(Number.isNaN(e.speed)) e.speed = 1;
        this.props.onAutoSpeedSlideInput?.(e);
        this.setState({
            autoSpeed: e.speed
        })
    }
    private onSoundImgClick(e){
        this.setState({
            useSound: useSound(!useSound())
        })
    }
    

    public render() {
        return (
            <div class="app-menu">
                <span class="app-auto-speed-span app-menu-item">
                    second pre move: {this.state.autoSpeed}
                </span>
                <input class="app-auto-speed-slide" type="range" min="0" max="2" step="0.01" defaultValue={1} onInput={this.autoSpeedSlideInputListener.bind(this)} onChange={this.autoSpeedSlideInputListener.bind(this)}/>
                <button class="app-auto-bn app-menu-bn app-menu-item" onClick={this.autoClickListener.bind(this)}>
                    {this.state.isAutoRunning ? "Stop" : "Auto"}
                </button>
                
                <span class="app-n-span app-menu-item">
                    Number of disks: 
                    <select class="app-n-dropdown" defaultValue={this.props.n} onChange={this.nDropDownInputListener.bind(this)}>
                        {   
                            Array.from(Array(64))
                                .map((_, i) => i+1)
                                .map(i => {
                                    return (
                                        this.props.n === i ?
                                            (<option selected value={i}>{i}</option>) :
                                            (<option value={i}>{i}</option>)
                                    )
                                    
                                })
                        }
                    </select>
                </span>
                <span class="app-r-span app-menu-item">
                    Number of pegs: 
                    <select class="app-r-dropdown" defaultValue={this.props.r} onChange={this.rDropDownInputListener.bind(this)}>
                        {   
                            Array.from(Array(18))
                                .map((_, i) => i+3)
                                .map(i => {
                                    return (
                                        this.props.r === i ?
                                            (<option selected value={i}>{i}</option>) :
                                            (<option value={i}>{i}</option>)
                                    )
                                    
                                })
                        }
                    </select>
                </span>
                <button class="app-reset-bn app-menu-bn app-menu-item" onClick={this.resetClickListener.bind(this)}>Reset</button>

                <button class="app-undo-bn app-menu-bn app-menu-item" onClick={this.undoClickListener.bind(this)}>Undo</button>
                <button class="app-redo-bn app-menu-bn app-menu-item" onClick={this.redoClickListener.bind(this)}>Redo</button>
                <span class="app-step-span app-menu-item">total step: {this.state.step}</span>
                <img 
                    width="70px"
                    class="app-sound-img" src={this.state.useSound ? volume_max_png : volume_mute_png}
                    onClick={this.onSoundImgClick.bind(this)}>
                </img>
            </div>
        )
    }
  }