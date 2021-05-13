//@ts-ignore
import algorithmia from 'algorithmia'
import sentenceBoundaryDetection from 'sbd'
import env from '../credetials/env.json'
import { load, save } from './state'
import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1.js'
import { contentProps, fetchKeywordsOfAllSentencesProps, limitMaximumSentencesProps } from '../Types/TextRobotProps'

const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: env.nlu.apikey,
    version: '2021-04-10',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})

export async function robotText() {
    const content = load()

    console.log('> [video-robot] Getting Started...')
    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    breakContentIntoSentences(content);//@ts-ignore
    limitMaximumSentences(content);
    await fetchKeywordsOfAllSentences(content);
    console.log('> [video-robot] ...Finished.')

    save(content);

    async function fetchContentFromWikipedia(content: contentProps) {
        console.log('> [text-robot] Searching Wikipedia content');
        let pesquisaNoIdioma = {
            "articleName": content.searchTerm,
            "lang": content.lang
        }
        const algorithmiaAuthenticated = algorithmia(env.apiKeyAlgorithmia)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe(pesquisaNoIdioma)
        const wikipediaContent = wikipediaResponse.get()

        content.sourceContentOriginal = wikipediaContent.content
        console.log('> [text-robot] Search Completed!')
    };

    function sanitizeContent(content: contentProps) {
        console.log('> [text-robot] Processing and handling text');
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal);
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

        content.sourceContentSanitizes = withoutDatesInParentheses;

        function removeBlankLinesAndMarkdown(text: any) {
            const allLines = text.split('\n');

            const withoutBlankLinesAndMarkdown = allLines.filter((line: string) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false;
                }
                return true
            })
            return withoutBlankLinesAndMarkdown.join(' ')
        }

        function removeDatesInParentheses(text: string) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ')
        }

    };

    function breakContentIntoSentences(content: contentProps) {
        //@ts-ignore
        content.sentences = []

        const sentences = sentenceBoundaryDetection.sentences(String(content.sourceContentSanitizes))
        sentences.forEach((sentence: any) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    };

    function limitMaximumSentences(content: limitMaximumSentencesProps) {
        content.sentences = content.sentences.slice(0, content.maximumSentences)
    }

    async function fetchKeywordsOfAllSentences(content: contentProps) {
        console.log('> [text-robot] Starting to search for keywords with Watson');

        for (const sentence of content.sentences) {
            console.log(`> [text-robot] Sentença: "${sentence.text}"`)//@ts-ignore

            sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)

            console.log(`> [text-robot] Key words: ${sentence.keywords.join(', ')}\n`)
        }
    }

    async function fetchWatsonAndReturnKeywords(sentence: string) {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                }
            }, (error, response: any) => {
                if (error) {
                    reject(error)
                    return
                }
                const keywords = response.keywords.map((keyword: { text: string }) => {
                    return keyword.text
                })

                resolve(keywords)
            })
        })
    }
};