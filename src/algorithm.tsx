import React from 'react';
import ReactDOM from 'react-dom';

import {Tower, DynamicProgramming} from './internal';


function sumFromTo(start:number, end:number){
    return (end-start)*(start+end)/2;
}

export async function solveTowersOfHanoi(A:Tower, B:Tower[], C:Tower, n:number, func = async (fromTower:Tower, toTower:Tower)=>true, onFinish = async r=>{}){
    var result = await _solveTowersOfHanoi3(A, B, C, n, func);
    await onFinish(result);
    return result;
}
async function _solveTowersOfHanoi(A:Tower, B:Tower, C:Tower, n:number, func = async (fromTower:Tower, toTower:Tower)=>true){
    if(n === 0) return true;
    if(! (await _solveTowersOfHanoi(A, C, B, n-1, func))) return false;
    if(!(await func(A, C))) return false;
    if(!(await _solveTowersOfHanoi(B, A, C, n-1, func))) return false;
    return true;
}


var T : Function;
T = function T(n:number, m:number) : number{
    if(n === 1) return 1;
    var result = 0;
    for(var i=1;i<=m;i++){
        result += this.call(n - 1, i);
    }
    return result;
}
var dynamicProgramming_T = new DynamicProgramming(T);
T = dynamicProgramming_T.T;

var getAllCost:Function;
getAllCost = function (r:number, n:number){
    var nFreePegs = r - 2;
    var remainingCost = n - 1;
    var costArr = Array.from(Array(nFreePegs)).map(()=>0);
    var i = 0;
    var rank = 1;
    while(remainingCost>0){
        var cost = T(rank, nFreePegs - i);
        if(remainingCost - cost < 0){
            costArr[i] += remainingCost;
            remainingCost -= remainingCost;
            break;
        }else{
            costArr[i] += cost;
            remainingCost -= cost;
        }
        
        i = (i + 1)%(nFreePegs);
        if(i === 0) rank++;
    }
    return costArr;
}
var dynamicProgramming_getAllCost = new DynamicProgramming(getAllCost);
getAllCost = dynamicProgramming_getAllCost.T;


async function _solveTowersOfHanoi3(sorucePeg:Tower, remainingPegs:Tower[], destinationPeg:Tower, n:number, func = async (fromTower:Tower, toTower:Tower)=>true){
    if(n === 1){
        if(!(await func(sorucePeg, destinationPeg))) return false;
        return true;
    }
    if(n <= 0) return true;
    var nextDistPegs: Tower[];
    var distPeg: Tower;
    var srcPeg: Tower;
    var costArr: number[];
    var r: number;
    var i = 0;

    r = remainingPegs.length + 2;
    if(r - 2 === 1){
        if(!(await _solveTowersOfHanoi(sorucePeg, remainingPegs[0], destinationPeg, n, func))) return false;
        return true;
    }
    costArr = getAllCost(r, n);
    nextDistPegs =  Array.from([...remainingPegs, destinationPeg]);
    while(nextDistPegs.length > 1){
        distPeg = nextDistPegs.shift();
        if(!(await _solveTowersOfHanoi3(sorucePeg, nextDistPegs, distPeg, costArr[i], func))) return false;
        i++;
    }

    if(!(await func(sorucePeg, destinationPeg))) return false;
    i--;

    nextDistPegs =  [sorucePeg];
    while(i >= 0){
        srcPeg = remainingPegs[i];
        if(!(await _solveTowersOfHanoi3(srcPeg, nextDistPegs, destinationPeg, costArr[i], func))) return false ;
        nextDistPegs.push(srcPeg);
        i--;
    }

    return true;
}

