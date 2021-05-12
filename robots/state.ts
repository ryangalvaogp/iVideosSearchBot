import fs from 'fs'
import { contentProps } from '../Types/TextRobotProps';
const contentFilePath = './content.json';
const scriptFilePath = './content/video-scripts.js'

export function save(content:contentProps) {
    const contentString = JSON.stringify(content);

    return fs.writeFileSync(contentFilePath, contentString);
};

export function saveScript(content:contentProps) {
    const contentString = JSON.stringify(content);
    const scriptString = ` var content = ${contentString}`
    return fs.writeFileSync(scriptFilePath, scriptString);
};

export function load() {
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
    const contentJson:contentProps = JSON.parse(fileBuffer);
    
    return contentJson;
};