import { load, save } from './state';
import env from '../credetials/env.json';
import { google } from 'googleapis';
import imagedownloader from 'image-downloader'

const customSearch = google.customsearch('v1');

export default async function imageRobot() {
    const content = load();

    await fetchImagesOfAllSentences(content);
    await downloadAllImages(content);
    save(content);

    async function fetchImagesOfAllSentences(content) {

        for (const sentence of content.sentences) {
            const query = `${content.searchTerm} ${sentence.keywords[0]}`;
            sentence.images = await fetchGoogleAndReturnImagesLinks(query);

            sentence.googleSearchQuery = query;
        };
    };

    async function fetchGoogleAndReturnImagesLinks(query) {
        const response = await customSearch.cse.list({
            auth: env.google.apiKey,
            cx: env.google.IDSearchEngine,
            q: query,
            num: 2,
            searchType: 'image',
            imgSize: 'huge'
        });

        const imagesUrl = response.data.items?.map((item) => {
            return item.link;
        });
        return imagesUrl;

    };

    async function downloadAllImages(content) {
        content.downloadedImages = [];

        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            const images = content.sentences[sentenceIndex].images;

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                const imageUrl = images[imageIndex];

                try {
                    if (content.downloadedImages.includes(imageUrl)) {
                        throw new Error('Image already downloaded')
                    };

                    await downloadAndSaveImages(
                        imageUrl,
                        `${sentenceIndex}-original.png`
                    );

                    content.downloadedImages.push(imageUrl);

                    console.log(
                        `>[image-robot] [${sentenceIndex}][${imageIndex}] 
                    Image successfully downloaded: ${imageUrl}`
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
            dest: `./downloads/${filename}`
        });
    };
};