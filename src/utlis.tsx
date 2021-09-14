

var canUseSound = false;

export async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}

export function useSound(arg:boolean = null):boolean{
    if(arg === true) canUseSound = true;
    else if (arg === false) canUseSound = false;
    return canUseSound;
}

export function playSound(src) {
    if(!useSound()) return false;
    var audio = document.createElement("audio");
    var source = document.createElement("source");
    source.src = src;
    audio.appendChild(source);
    audio.play();
    return true;
}

export class DynamicProgramming{
    _T : Function
    store: Map<any, any>
    constructor(func:Function = null){
        this.T = func;
        this.store = new Map();
    }
    get T(){
        return this._T;
    }
    set T(func){
        this._T = func.bind(this);
    }
    public call(...args){
        var isUnset = false;
        var currentMap = this.store;
        var len_1 = args.length - 1;
        var lastMap;
        var result;
        for(var i=0; i<len_1; i++){
            result = currentMap.get(args[i]);
            lastMap = currentMap;
            if(result === undefined){
                currentMap = new Map();
                lastMap.set(args[i], currentMap);
                isUnset = true;
            }else {
                currentMap = result;
            }
        }
        if(args.length){
            result = currentMap.get(args[len_1]);
            if(result === undefined){
                isUnset = true;
            }
        }
        
        if(isUnset){
            var answer = this._T(...args);
            currentMap.set(args[len_1], answer);
            return answer;
        }else{
            return result;
        }
    }    
}

