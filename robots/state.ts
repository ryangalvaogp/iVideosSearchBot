import fs from 'fs'
import { contentProps } from '../Types/TextRobotProps';
const contentFilePath = './content.json';
const scriptFilePath = './templates/1/bridge.js'

export function save(content:contentProps) {
    const contentString = JSON.stringify(content);

    return fs.writeFileSync(contentFilePath, contentString);
};

export function saveScript(searchTerm:contentProps['searchTerm']) {
    const contentString = JSON.stringify(searchTerm);
    const scriptString = ` var content = ${contentString}`
    return fs.writeFileSync(scriptFilePath, scriptString);
};

export function load() {
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
    const contentJson:contentProps = JSON.parse(fileBuffer);
    
    return contentJson;
};