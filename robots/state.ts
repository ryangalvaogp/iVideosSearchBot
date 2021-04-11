import fs from 'fs'
import { contentProps } from '../Types/TextRobotProps';
const contentFilePath = './content.json';

export function save(content:contentProps) {
    const contentString = JSON.stringify(content);

    return fs.writeFileSync(contentFilePath, contentString);
};

export function load() {
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
    const contentJson:contentProps = JSON.parse(fileBuffer);
    
    return contentJson;
};