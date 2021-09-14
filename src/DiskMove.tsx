

import {Tower} from './internal';

export class DiskMove{
    fromTower: Tower
    toTower: Tower
    constructor(fromTower: Tower, toTower: Tower){
      this.fromTower = fromTower;
      this.toTower = toTower;
    }
    do(){
        this.toTower.putDisk(this.fromTower.takeDisk());
    }
    undo(){
        this.fromTower.putDisk(this.toTower.takeDisk());
    }
    static create(fromTower: Tower, toTower: Tower){
      return new DiskMove(fromTower, toTower);
    }
}
export class DiskMoveChain{
    diskMoveChain: DiskMove[]
    cursor:number;
    constructor(){
        this.diskMoveChain = []
        this.cursor = -1;
    }
    get isEmpty(){
        return this.diskMoveChain.length === 0;
    }
    get isCursorEnd(){
        return this.cursor === this.diskMoveChain.length-1
    }
    get isCursorStart(){
        return this.cursor === -1
    }
    get currentDiskMove(){
        return this.diskMoveChain[this.cursor];
    }
    new(fromTower: Tower, toTower: Tower){
        if(!this.isCursorEnd)
            this.diskMoveChain = this.diskMoveChain.slice(0, this.cursor+1);
        var diskMove = DiskMove.create(fromTower, toTower);
        this.diskMoveChain.push(diskMove);
        this.cursor = this.diskMoveChain.length - 1;
        return diskMove;
    }
    redo(){
        if(this.isCursorEnd) return false;
        this.cursor++;
        this.diskMoveChain[this.cursor].do();
        return true;
    }
    undo(){
        if(this.isCursorStart) return false;
        this.diskMoveChain[this.cursor].undo();
        this.cursor--;
        return true;
    }
    
    static create(){
      return new DiskMoveChain();
    }
}