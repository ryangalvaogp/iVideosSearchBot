import { load, save, saveScript } from './state';
import path from 'path'
import { contentProps } from '../Types/TextRobotProps';
const rootPath = path.resolve('magick', __dirname, '..', 'content')
const gm = require('gm').subClass({ imageMagick: true });
const fromRoot = (relPath: any) => path.resolve(rootPath, relPath)
const spawn = require('child_process').spawn

import os from 'os';
import fs from 'fs';

const videoshow = require('videoshow')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path

let ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)


const audio = path.resolve(rootPath, 'templates', '1', 'newsroom.mp3')
const video = fromRoot('video.mp4');

import { config } from "dotenv";
import DeleteFileInContentFolder from '../utils/DeleteFileInContentFolder';
config()

export default async function videoRobot() {
    const content = load()

    await convertAllImages(content);
    await createAllSentencesImages(content);
    await createThumbnail();
    await createScriptVideo(content)
    await removeVideosForPerformaceOnRender()
    await renderVideo(content)

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

    async function createScriptVideo(content: contentProps) {
        saveScript(content.searchTerm);
    };

    async function renderVideo(content: contentProps) {
        return new Promise<void>(async (resolve, reject) => {
            let aerenderFilePath;

            const systemPlataform = os.platform();
            console.log(systemPlataform);

            switch (systemPlataform) {
                case 'darwin':
                    aerenderFilePath = process.env.AFTER_EFFECTS_PATH_DARWIN;
                    break;

                case 'win32':
                    aerenderFilePath = process.env.AFTER_EFFECTS_PATH_WIN_32;
                    break;
            };

            switch (content.renderProgram) {
                case 'After Effects':
                    try {
                        if (fs.existsSync(aerenderFilePath)) {
                            await renderVideoWithAfterEffects(aerenderFilePath);
                        };
                        await convertOutputVideoToMp4();
                        return resolve();
                    } catch (error) {
                        console.error(error);
                        reject(error)
                    };

                case 'FFmpeg':
                    await renderVideoWithFFmpeg(content);
                    return resolve()
            };
        });
    };

    async function renderVideoWithAfterEffects(aerenderFilePath: string) {
        return new Promise<void>((resolve, reject) => {
            const templateFilePath = path.resolve(rootPath, '..', 'templates', '1', 'template.aep');
            const destinationFilePath = fromRoot('output.mp4');

            console.log('Render Video With After Effects');

            const aerender = spawn(aerenderFilePath, [
                '-comp', 'main',
                '-project', templateFilePath,
                '-output', destinationFilePath
            ]);
            aerender.stdout.on('data', (data: any) => {
                process.stdout.write(data);
            });
            aerender.on('close', () => {
                console.log('> [video-robot] After Effects closed');
                resolve();
            });
        });
    };

    async function renderVideoWithFFmpeg(content: contentProps) {
        return new Promise<void>(async (resolve, reject) => {
            let images = [];
            console.log('Render Video With FFmpeg');
            for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
                images.push({
                    path: fromRoot(`${sentenceIndex}-converted.png`),
                    caption: content.sentences[sentenceIndex].text,
                });
            };

            const videoOptions = {
                fps: 25,
                loop: 5, // seconds
                transition: true,
                transitionDuration: 1, // seconds
                videoBitrate: 1024,
                videoCodec: "libx264",
                size: "640x?",
                audioBitrate: "128k",
                audioChannels: 2,
                format: "mp4",
                pixelFormat: "yuv420p",
                useSubRipSubtitles: false, // Use ASS/SSA subtitles instead
                subtitleStyle: {
                    Fontname: "Verdana",
                    Fontsize: "26",
                    PrimaryColour: "11861244",
                    SecondaryColour: "11861244",
                    TertiaryColour: "11861244",
                    BackColour: "-2147483640",
                    Bold: "2",
                    Italic: "0",
                    BorderStyle: "2",
                    Outline: "2",
                    Shadow: "3",
                    Alignment: "1", // left, middle, right
                    MarginL: "40",
                    MarginR: "60",
                    MarginV: "40"
                },
            };

            try {
                videoshow(images, videoOptions)
                    .audio(audio)
                    .save(video)
                    .on('start', (comand: any) => {
                        console.log('> [video-robot] Starting FFmpeg', comand);
                    })
                    .on('error', (err: any, stdout: any, stderr: any) => {
                        console.error("Error", err);
                        console.error("ffmpeg stderr:", stderr);
                        reject(err);
                    })
                    .on("end", (output: any) => {
                        console.log('> [video-robot] FFmpeg closed', output);
                        resolve();
                    });
            } catch (error) {
                console.log(error);
            };
        });
    };

    async function convertOutputVideoToMp4() {
        return new Promise<void>((resolve, reject) => {
            const ffmpegConvertPath = process.env.FFMPEGCONVERTPATH
            console.log('> [video-robot] Converting Video');

            const ffmpegConvert = spawn(ffmpegConvertPath, [
                '-i', `${fromRoot('output.mov')}`,
                `${fromRoot('output.mp4')}`
            ]);

            ffmpegConvert.stdout.on('data', (data: any) => {
                process.stdout.write(data);
            })
            ffmpegConvert.on('close', () => {
                console.log('> [video-robot] FFmpeg Convert Closed');
                resolve();
            });
        });
    };

    async function removeVideosForPerformaceOnRender() {
        return new Promise<void>((resolve, reject) => {
            DeleteFileInContentFolder('output.mov');
            DeleteFileInContentFolder('output.avi');
            DeleteFileInContentFolder('output.mp4');

            return resolve();
        });
    };
};