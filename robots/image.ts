import { load, save } from './state';
import env from '../credetials/env.json';
import { google } from 'googleapis';//@ts-ignore
import imagedownloader from 'image-downloader'
import { contentProps } from '../Types/TextRobotProps';
const customSearch = google.customsearch('v1');

export default async function imageRobot() {
    const content = load();

    console.log('> [video-robot] Getting Started...')
    await fetchImagesOfAllSentences(content);
    await downloadAllImages(content);
    console.log('> [video-robot] ...Finished.')

    save(content);

    async function fetchImagesOfAllSentences(content: contentProps) {

        for (const sentence of content.sentences) {
            const query = `${content.searchTerm} ${sentence.keywords[0]}`;

            console.log(`> [image-robot] Querying Google Images on: "${query}"`)
            sentence.images = await fetchGoogleAndReturnImagesLinks(query);

            sentence.googleSearchQuery = query;
        };
    };


    async function fetchGoogleAndReturnImagesLinks(query: string) {
        //https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list
        const response = await customSearch.cse.list({
            auth: env.google.apiKey,
            cx: env.google.IDSearchEngine,
            q: query,
            num: 2,
            searchType: 'image',
            imgType: 'photo',
            lr: 'lang_pt',
            imgSize: 'large'
        });

        const imagesUrl = response.data.items?.map((item) => {
            return item.link;
        });
        return imagesUrl;
    };

    async function downloadAllImages(content: contentProps) {
        content.downloadedImages = [];

        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            const images = content.sentences[sentenceIndex].images;

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                const imageUrl = images[imageIndex];

                try {
                    if (content.downloadedImages.includes(imageUrl)) {
                        throw new Error('Image has already been downloaded')
                    };

                    await downloadAndSaveImages(
                        imageUrl,
                        `${sentenceIndex}-original.png`
                    );

                    content.downloadedImages.push(imageUrl);

                    console.log(
                        `>[image-robot] [${sentenceIndex}][${imageIndex}] 
                        Image downloaded successfully: ${imageUrl}`
                    );
                    break;
                } catch (error) {
                    console.log(
                        `>[image-robot] [${sentenceIndex}][${imageIndex}] 
                        Image download: ${error}`
                    );
                };
            };
        };
    };

    async function downloadAndSaveImages(url: string, filename: string) {
        return imagedownloader.image({
            url: url,
            dest: `./content/${filename}`
        });
    };
};