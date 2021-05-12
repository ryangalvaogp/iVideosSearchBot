import path from 'path'
const rootPath = path.resolve('magick', __dirname, '..', 'content')
const fromRoot = (relPath: any) => path.resolve(rootPath, relPath)
import fs from 'fs';

export default function DeleteFileInContentFolder(nameFile: string) {
    if (fs.existsSync(fromRoot(nameFile))) {
        fs.unlinkSync(fromRoot(nameFile));
    }
}