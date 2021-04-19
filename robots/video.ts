import { load, save } from './state';
import path from 'path'
import { contentProps } from '../Types/TextRobotProps';
const rootPath = path.resolve('magick', __dirname, '..', 'downloads')
const gm = require('gm').subClass({ imageMagick: true });
const fromRoot = (relPath: any) => path.resolve(rootPath, relPath)

export default async function videoRobot() {
    const content = load()
    await convertAllImages(content);
    await createAllSentencesImages(content);
    await createThumbnail();

    save(content);

    async function convertAllImages(content: contentProps) {
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            await convertImage(sentenceIndex);
        };
    };

    async function convertImage(sentenceIndex: number) {
        return new Promise<void>((resolve, reject) => {
            const inputFile = fromRoot(`${sentenceIndex}-original.png[0]`);
            const outputFile = fromRoot(`${sentenceIndex}-converted.png`);
            const width = 1920;
            const height = 1080;

            gm()
                .in(inputFile)
                .out('(')
                .out('-clone')
                .out('0')
                .out('-background', 'white')
                .out('-blur', '0x9')
                .out('-resize', `${width}x${height}^`)
                .out(')')
                .out('(')
                .out('-clone')
                .out('0')
                .out('-background', 'white')
                .out('-resize', `${width}x${height}`)
                .out(')')
                .out('-delete', '0')
                .out('-gravity', 'center')
                .out('-compose', 'over')
                .out('-composite')
                .out('-extent', `${width}x${height}`)
                .write(outputFile, (err: any) => {
                    if (err) {
                        return reject(err);
                    };
                    console.log(`> [video-robot] Image converted: ${outputFile}`);
                    resolve();
                });
        });
    };

    async function createAllSentencesImages(content: contentProps) {
        for (let sentencesIndex = 0; sentencesIndex < content.sentences.length; sentencesIndex++) {
            await createSetencesImage(sentencesIndex, content.sentences[sentencesIndex].text);
        };
    };

    async function createSetencesImage(sentenceIndex: number, sentenceText: string) {
        return new Promise<void>((resolve, reject) => {
            const outputFile = fromRoot(`${sentenceIndex}-sentence.png`);

            const templateSettings: any = {
                0: {
                    size: '1920x400',
                    gravity: 'center'
                },
                1: {
                    size: '1920x1080',
                    gravity: 'center'
                },
                2: {
                    size: '800x1080',
                    gravity: 'west'
                },
                3: {
                    size: '1920x400',
                    gravity: 'center'
                },
                4: {
                    size: '1920x1080',
                    gravity: 'center'
                },
                5: {
                    size: '800x1080',
                    gravity: 'west'
                },
                6: {
                    size: '1920x400',
                    gravity: 'center'
                }
            };

            gm()
                .out('-size', templateSettings[sentenceIndex].size)
                .out('-gravity', templateSettings[sentenceIndex].gravity)
                .out('-background', 'transparent')
                .out('-fill', 'white')
                .out('-kerning', '-1')
                .out(`caption:${sentenceText}`)
                .write(outputFile, (error: any) => {
                    if (error) {
                        return reject(error);
                    };

                    console.log(`> [video-robot] Sentence created: ${outputFile}`);
                    resolve();
                });
        });
    };

    async function createThumbnail() {
        return new Promise<void>((resolve, reject) => {
            gm()
                .in(fromRoot('0-converted.png'))
                .write(fromRoot('thumbnail.jpg'), (error: any) => {
                    if (error) {
                        return reject(error);
                    };

                    console.log('> [Image-robot] Thumbnail created');
                    resolve();
                });
        });
    };
}
