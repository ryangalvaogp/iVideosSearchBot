import express, { Request, Response } from 'express';
import { google, youtube_v3 } from 'googleapis';
import { load } from './state'
import path from 'path';
import fs from 'fs';
import { OAuthClient, OAuthClientProps, TokensProps } from '../Types/YoutubeRobotProps';
import { contentProps } from '../Types/TextRobotProps';
import internal from 'stream';

const OAuth2 = google.auth.OAuth2;
const youtube = google.youtube({ version: 'v3' })

const rootPath = path.resolve('magick', __dirname, '..', 'content');
const fromRoot = (relPath: string) => path.resolve(rootPath, relPath)

export default async function YoutubeRobot() {
    const content = load();

    await authenticateWithOAuth();
    const videoInformation = await uploadVideo(content);//@ts-ignore
    await uploadThumbnail(videoInformation);

    async function authenticateWithOAuth() {
        const webServer = await startWebServer();
        const OAuthClient = await createOAuthClient();

        requestUserConsent(OAuthClient);
        const authorizationToken = await waitForGoogleCallBack(webServer);
        await requestGoogleForAccessTokens(OAuthClient, authorizationToken);//@ts-ignore
        await setGlobalGoogleAuthentication(OAuthClient);
        await stopWebServer(webServer);

        async function startWebServer() {
            return new Promise((resolve, reject) => {
                const port = 5000;
                const app = express()
                const server = app.listen(port, () => {
                    console.log(`> Servidor iniciado em http://localhost:${port}`);
                    resolve({
                        app,
                        server
                    });
                });
            });
        };

        async function createOAuthClient() {
            const credentials = require('../credetials/credentialsOAuthYT.json');
            const OAuthClient = new OAuth2(
                credentials.web.client_id,
                credentials.web.client_secret,
                credentials.web.redirect_uris[0]
            );
            return OAuthClient;
        };

        async function requestUserConsent(OAuthClient: OAuthClientProps) {
            const consentUrl = OAuthClient.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/youtube']
            });
            console.log(`> Por favor, dê seu consentimento: ${consentUrl}`);
        };

        async function waitForGoogleCallBack(webServer: any) {
            return new Promise((resolve, reject) => {
                console.log(`> Aguardando consentimento do usuário ...`);

                webServer.app.get('/oauth2callback', (req: Request, res: Response) => {
                    const authCode = req.query.code;
                    console.log(`> Consentimento Permitido com Sucesso`);
                    res.send('<h1>Ação Permitida com Sucesso!</h1><p>Agora feche esta aba</p>');
                    resolve(authCode);
                });
            });
        };

        async function requestGoogleForAccessTokens(OAuthClient: OAuthClientProps, authorizationToken: unknown) {
            return new Promise<void>((resolve, reject) => {
                OAuthClient.getToken(authorizationToken, (error: Error, tokens: TokensProps) => {
                    if (error) {
                        return reject(error);
                    };
                    console.log(`> Tokens de acesso recebidos`);

                    OAuthClient.setCredentials(tokens);
                    resolve();
                });
            });
        };

        async function setGlobalGoogleAuthentication(OAuthClient: OAuthClient) {
            google.options({
                auth: OAuthClient,
            });
        };

        async function stopWebServer(webServer: any) {
            return new Promise<void>((resolve, reject) => {
                webServer.server.close(() => {
                    resolve();
                });
            });
        };
    };

    async function uploadVideo(content: contentProps) {
        const videoFilePath = fromRoot('output.mp4');
        const videoFileSize = fs.statSync(videoFilePath).size;
        const videoTitle = `${content.prefix} ${content.searchTerm}`;
        const videoTags = [content.searchTerm, ...content.sentences[0].keywords];
        const videoDescription = content.sentences.map((sentence) => {
            return sentence.text
        }).join('\n\n');

        const requestParameters = {
            part: ['snippet', 'status'],
            requestBody: {
                snippet: {
                    title: videoTitle,
                    description: videoDescription,
                    tags: videoTags,
                },
                status: {
                    privacyStatus: 'unlisted'
                }
            },
            media: {
                body: fs.createReadStream(videoFilePath)
            }
        }

        const youtubeResponse = await youtube.videos.insert(requestParameters, {
            onUploadProgress: onUploadProgress
        });

        console.log(`> Vídeo disponível em: https://www.youtube.com/watch?v=${youtubeResponse.data.id}`);
        return youtubeResponse.data;

        function onUploadProgress(event: any) {
            const progress = Math.round((event.bytesRead / videoFileSize) * 100);
            console.log(`> ${progress}% completado`);
        };
    }

    async function uploadThumbnail(videoInformation: internal.Readable & youtube_v3.Schema$Video) {
        const videoId = videoInformation.id;
        const videoThumbnailFilePath = fromRoot('thumbnail.jpg');

        const requestParameters = {
            videoId,
            media: {
                mimeType: 'image/jpeg',
                body: fs.createReadStream(videoThumbnailFilePath),
            }
        };

        const youtubeResponse = await youtube.thumbnails.set(requestParameters);
        console.log(`> Thumbnail enviado!`);
    };
};