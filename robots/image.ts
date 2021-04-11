import { load, save } from './state'
import env from '../credetials/env.json'
import { google } from 'googleapis'

const customSearch = google.customsearch('v1')

export default async function imageRobot() {
    const content = load();

    await fetchImagesOfAllSentences(content);
    console.dir(content, {depth:null})
    save(content);

    async function fetchImagesOfAllSentences(content) {

            for (const sentence of content.sentences) {
                const query = `${content.searchTerm} ${sentence.keywords[0]}`
                sentence.images = await fetchGoogleAndReturnImagesLinks(query)

                sentence.googleSearchQuery = query;
            }
    }

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

    }
};
