

import React from 'react';
import ReactDOM from 'react-dom';

import {Component} from 'react';

import {Disk, Tower, DiskMove, DiskMoveChain} from './internal';

const R1 = 0.5;
const N0 = 10;
const MAX_DISK_HEIGHT = 70;
const MIN_DISK_HEIGHT = 35;
const MAX_DISKS_RATE = 0.95;

export enum MESSAGE_TYPE{
    MESSAGE_NOTE = "note",
    MESSAGE_INFO = "info",
    MESSAGE_WARN = "warn",
    MESSAGE_ERROR = "error"
}


class TowerClickListeners{
    funcArr: Function[]
    hanoiTower: HanoiTower
    constructor(r : number, hanoiTower : HanoiTower){
        this.hanoiTower = hanoiTower;
        var T = this;
        this.funcArr = Array.from(Array(r)).map(() => 
            this.getFunction()
        );
    }

    private onTake(currentTower:Tower){
        if(currentTower.state.disks.length){
            this.hanoiTower.setState({
                fromTower: currentTower,
            });
            currentTower.setState({
                isSelected: true
            })
        }else{
            currentTower.warnUser("No disk on this tower.");
        }
    }
    private onPut(currentTower){
        var hanoiTower = this.hanoiTower;
        var [fromTower, toTower] : [Tower, Tower] = [hanoiTower.state.fromTower, currentTower];
        if(hanoiTower.canMoveDisk(fromTower, toTower)){
            if(hanoiTower.props?.onDiskMove?.({fromTower, toTower, hanoiTower}) === false) return;
            hanoiTower.putDiskTo(fromTower, toTower);
            
            hanoiTower.state.isFinish =  
                toTower.props.type === Tower.DESTINATION_TOWER &&
                toTower.state.disks.length === hanoiTower.state.n;
            if(hanoiTower.isFinish){
                if(hanoiTower.props?.onFinish?.({fromTower, toTower, hanoiTower}) === false) return;
                hanoiTower.showMessage(MESSAGE_TYPE.MESSAGE_INFO, "Congratulations on completing the game!");
            }
        }else{
            currentTower.warnUser("The upper disk should larger then the lower disk.");
        }
        fromTower.setState({
            isSelected: false
        })
        hanoiTower.setState({
            fromTower: null
        });
    }
    private getFunction(){
        var T = this;
        return function(){
            var currentTower = this;
            if(T.hanoiTower.state.fromTower == null) {
                T.onTake(currentTower);
            }else{
                T.onPut(currentTower);
            }
        }
    }
    public getFunctions(){
        return this.funcArr;
    }
    static create(r : number, hanoiTower : HanoiTower){
        return new TowerClickListeners(r, hanoiTower);
    }
}

export class HanoiTower extends Component {

    onTowerClickFunctions: Function[]
    diskMovesChain: DiskMoveChain
    sourceTowerRef
    destinationTowerRef
    remainingTowerRefs

    constructor(props){
        super(props)
        var T = this; 

        this.diskMovesChain = DiskMoveChain.create();
        // console.log("HanoiTower", props);
        this.state = {
            fromTower: null,
            showMessage: false,
            message: "",
            messageType: MESSAGE_TYPE.MESSAGE_NOTE,
            isFinish: false,
            step: 0,
            n: props.n,
            r: props.r
        }
        
        
    }
    static getDerivedStateFromProps(props, current_state) {
        var update : any = {};
        if (props.step != null && current_state.step !== props.step) {
            update.step = props.step;
        }
        if (current_state.n !== props.n) {
            update.n = props.n;
        }
        if (current_state.r !== props.r) {
            update.r = props.r;
        }
        return Object.keys(update).length === 0 ? null : update;
    }

    public componentDidMount(){
        this.showMessage(MESSAGE_TYPE.MESSAGE_INFO, "Move all disks from the blue rod to the green rod.");
    }
    // public componentDidUpdate(){
    //     this.props.onComponentDidUpdate?.({hanoiTower: this});
    // }

    get diskHeight(){
        let n = this.state.n;
        return (MAX_DISK_HEIGHT - MIN_DISK_HEIGHT) / (R1*n + 1) + MIN_DISK_HEIGHT;
    }
    get rodHeigh(){
        let h = this.diskHeight;
        let n = this.state.n;
        return n > N0 ? n*h/MAX_DISKS_RATE : N0*h/MAX_DISKS_RATE;
    }
    get isFinish(){
        return this.state.isFinish;
    }
    get totalStep(){
        return this.state.step;
    }
    set totalStep(step:number){
        this.setState({
            step
        });
    }
    getDiskWidth(i : number){
        return `${20 + 80*i/this.state.n}%`;
    }
    private getDisks(){
        var T = this;
        return Array.from(Array(this.state.n))
            .map((_, i) => <Disk width={T.getDiskWidth(i)} height={T.diskHeight} order={i+1}></Disk>)
            .reverse();
    }
    private getSourceTower(){
        var r = this.state.r;
        var towerHeight = this.rodHeigh / MAX_DISKS_RATE;
        return( 
            <Tower
                type={Tower.SOURCE_TOWER}
                ref={this.sourceTowerRef}
                width={`${100 / r}%`}
                height={towerHeight} 
                onClick={this.onTowerClickFunctions[0]}>
                {this.getDisks()}
            </Tower>);
        
    }
    private getDestinationTower(){
        var r = this.state.r;
        var towerHeight = this.rodHeigh / MAX_DISKS_RATE;
        return (
        <Tower
            type={Tower.DESTINATION_TOWER}
            ref={this.destinationTowerRef}
            width={`${100 / r}%`} 
            height={towerHeight} 
            onClick={this.onTowerClickFunctions[r-1]}>
        </Tower>);
    
    }
    private getRemainingTowers(){
        var r = this.state.r;
        var towerHeight = this.rodHeigh / MAX_DISKS_RATE;
        return Array.from(new Array(r - 2)).map((_, i) => 
            <Tower
                type={Tower.REMAINING_TOWER}
                ref={this.remainingTowerRefs[i]}
                width={`${100 / r}%`}
                height={towerHeight}
                onClick={this.onTowerClickFunctions[i+1]}>
            </Tower>
        );
    }
    private updateRefs(){
        var r = this.state.r;
        this.sourceTowerRef = React.createRef();
        this.destinationTowerRef = React.createRef();
        this.remainingTowerRefs = Array.from(new Array(r - 2)).map((_, i) => 
            React.createRef()
        );
    }


    public undo(){
        if(this.props?.onUndo?.({hanoiTower:this}) === false) return;
        var result = this.diskMovesChain.undo();
        if(result) this.totalStep--;
        if(result) {
            this.totalStep--;
            this.props.onStepChange?.({hanoiTower:this, step:this.totalStep-1});
        }
        return result;
    }
    public redo(){
        if(this.props?.onRedo?.({hanoiTower:this}) === false) return;
        var result = this.diskMovesChain.redo();
        if(result) {
            this.totalStep++;
            this.props.onStepChange?.({hanoiTower:this, step:this.totalStep+1});
        }
        
        return result;
    }
    public putDiskTo(fromTower : Tower, toTower : Tower){
        if(fromTower === toTower) return;
        this.diskMovesChain.new(fromTower, toTower);
        this.props.onStepChange?.({hanoiTower:this, step:this.totalStep+1});
        this.totalStep++;
        return toTower.putDisk(fromTower.takeDisk());
    }
    public canMoveDisk(fromTower : Tower, toTower : Tower) : boolean{
        var [fromDisks, toDisks] : [Disk[], Disk[]] = [fromTower.state.disks, toTower.state.disks];
        var fromTopDisk : Disk, toTopDisk :　Disk;
        if(fromDisks.length === 0) return false;
        else if(toDisks.length === 0) return true;
        [fromTopDisk, toTopDisk] = [fromDisks[fromDisks.length - 1], toDisks[toDisks.length - 1]];
        return fromTopDisk.props.width <= toTopDisk.props.width;
    }
    public showMessage(state:MESSAGE_TYPE, msg:string, timeout:number = 3000){
        var T = this;
        T.setState({
            showMessage: true,
            message: msg,
            messageType: state
        })
        if(timeout >= 0){
            setTimeout(() => {
                T.setState({
                    showMessage: false,
                    message: "",
                })
            }, timeout);
        }
    }
    public render() {
        // console.log("HanoiTower", this.props, this.state);
        this.onTowerClickFunctions = TowerClickListeners.create(this.state.r, this).getFunctions();
        this.updateRefs();
        let msgBox = (showMessage:boolean, msg:string, state:MESSAGE_TYPE) => 
            showMessage ?
            <div class={`${state}-message-box centering-message-box hanoi-tower-message-box`}>{msg}</div>:
            null;
        return (
            <div class="fill-parent">
                <div 
                    class={"hanoi-tower fill-parent"}>
                    {this.getSourceTower()}
                    {this.getRemainingTowers()}
                    {this.getDestinationTower()}
                </div>
                {msgBox(this.state.showMessage, this.state.message, this.state.messageType)}
            </div>
      );
    }
  }