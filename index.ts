import inputRobot from './robots/input';
import {robotText} from './robots/text';
import {load} from './robots/state'
import imageRobot from './robots/image'

async function start() {
    // inputRobot();
    // await robotText();
    await imageRobot();

};

start();