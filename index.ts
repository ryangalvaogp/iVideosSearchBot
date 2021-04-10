import input from './robots/input';
import {robotText} from './robots/text';
import {load} from './robots/state'
async function start() {
    input();
    await robotText();

    
    const content = load();
    console.dir(content, {depth:null});

};

start();