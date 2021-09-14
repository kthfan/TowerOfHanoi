

import React from 'react';
import ReactDOM from 'react-dom';

import {Component} from 'react';

import {HanoiTower, AppMenu, Tower, MESSAGE_TYPE, sleep, DiskMoveChain, solveTowersOfHanoi, playSound, put_disk_mp3} from './internal';





export class App extends Component {

    hanoiTowerRef : any

    constructor(props){
        super(props)
        var T = this; 

        this.state = {
            r: 3,
            n: 5,
            step:0,
            autoSpeed:1,
            isAutoRunning: false
        }
        this.hanoiTowerRef = React.createRef();
    }

    private whenAutoRunning(){
        if(this.state.isAutoRunning) {
            this.hanoiTowerRef.current.showMessage(MESSAGE_TYPE.MESSAGE_WARN, "Click the stop button before any other operations.");
            return true;
        }
        return false;
    }

    private onUndoClick(e) {
        if(this.whenAutoRunning()) return;
        this.hanoiTowerRef.current.undo();
    }
    private onRedoClick(e) {
        if(this.whenAutoRunning()) return;
        this.hanoiTowerRef.current.redo();
    }
    private onResetClick(e){
        if(this.whenAutoRunning()) return;
        Tower.currentUpdateToken = (Tower.currentUpdateToken + 1)%5;
        this.hanoiTowerRef.current.diskMovesChain = DiskMoveChain.create();
        this.setState({
            r: this.state.r,
            n: this.state.n,
            step: 0
        });
        playSound(put_disk_mp3);
        setTimeout(() => {
            playSound(put_disk_mp3);
        }, 100);
    }
    private onAutoClick(e) {
        var T = this;
        var hanoiTower:HanoiTower = this.hanoiTowerRef?.current;
        var diskMoveChain = hanoiTower.diskMovesChain;

        if(e.isAutoRunning || this.state.isAutoRunning) {
            this.state.isAutoRunning = false;
            return true;
        } 

        if(hanoiTower == null) {
            console.error("this.hanoiTowerRef.current is null in App.onAutoClick");
            return false;
        }
        
        var [A, B, C] = [hanoiTower.sourceTowerRef.current, hanoiTower.remainingTowerRefs.map(ref=>ref.current), hanoiTower.destinationTowerRef.current];
        if(A.state.disks.length !== this.state.n) {
            hanoiTower.showMessage(MESSAGE_TYPE.MESSAGE_WARN, "The Tower of Hanoi should be reset first.");
            return false;
        }else{
            const ROUND = 20000;
            var count = 0;
            this.state.isAutoRunning = true;
            solveTowersOfHanoi(A, B, C, this.state.n, async (fromTower:Tower, toTower:Tower)=>{
                diskMoveChain.new(fromTower, toTower);
                if(((++count)%ROUND) === 0){
                    diskMoveChain.cursor = count - ROUND - 1;
                    while(!diskMoveChain.isCursorEnd){
                        await sleep(T.state.autoSpeed*1000);
                        if(!T.state.isAutoRunning) return false;
                        hanoiTower.redo();
                    }
                }
                return true;
            }, async ()=>{
                if((count%ROUND) !== 0){
                    diskMoveChain.cursor = count - (count%ROUND) - 1;
                    while(!diskMoveChain.isCursorEnd){
                        await sleep(T.state.autoSpeed*1000);
                        if(!T.state.isAutoRunning) break;
                        hanoiTower.redo();
                    }
                }
                T.setState({
                    isAutoRunning: false
                })
            });
        }
        
        
        return true;
    }
    private onNDropDownInput(e) {
        this.state.n = e.n;
    }
    private onRDropDownInput(e) {
        this.state.r = e.r;
    }
    
    private onStepChange(e) {
        this.setState({
            step: e.step
        });
    }
    private onAutoSpeedSlideInput(e){
        this.state.autoSpeed = e.speed;
    }

    private onDiskMove(e){
        return !this.whenAutoRunning();
    }

    public render() {
        // console.log("App", this.state)
        var appMenu = 
            <AppMenu
                r={this.state.r}
                n={this.state.n}
                step={this.state.step}
                isAutoRunning={this.state.isAutoRunning}
                onUndoClick={this.onUndoClick.bind(this)}
                onRedoClick={this.onRedoClick.bind(this)}
                onAutoClick={this.onAutoClick.bind(this)}
                onResetClick={this.onResetClick.bind(this)}
                onNDropDownInput={this.onNDropDownInput.bind(this)}
                onRDropDownInput={this.onRDropDownInput.bind(this)}
                onAutoSpeedSlideInput={this.onAutoSpeedSlideInput.bind(this)}>
            </AppMenu>;
        
        var hanoiTower = 
            <HanoiTower
                ref={this.hanoiTowerRef}
                r={this.state.r}
                n={this.state.n}
                step={this.state.step}
                onStepChange={this.onStepChange.bind(this)}
                onDiskMove={this.onDiskMove.bind(this)}>
            </HanoiTower>;
        return (
            <div class="fill-parent">
                {appMenu}
                {hanoiTower}
            </div>
            
        )
    }
  }