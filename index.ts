import inputRobot from './robots/input';
import {robotText} from './robots/text';
import {load} from './robots/state'
import imageRobot from './robots/image'
import videoRobot from './robots/video';
import youtubeRobot from './robots/youtube'

async function start() {
    inputRobot();
    await robotText();
    await imageRobot();
    await videoRobot();
    await youtubeRobot();
};

start();