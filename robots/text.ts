import algorithmia from 'algorithmia'
import sentenceBoundaryDetection from 'sbd'
import env from '../credetials/env.json'
import { load, save } from './state'
import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1.js'
import { contentProps, fetchKeywordsOfAllSentencesProps, limitMaximumSentencesProps, senteceProps } from '../Types/TextRobotProps'

const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: env.nlu.apikey,
    version: '2021-04-10',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})

export async function robotText() {
    const content = load()

    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    breakContentIntoSentences(content);
    limitMaximumSentences(content);
   
    try {
        await fetchKeywordsOfAllSentences(content);
        save(content);
    } catch (error) {
        console.log(error)
    }
    


    async function fetchContentFromWikipedia(content: contentProps) {
        const algorithmiaAuthenticated = algorithmia(env.apiKeyAlgorithmia)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()

        content.sourceContentOriginal = wikipediaContent.content
    };

    function sanitizeContent(content: contentProps) {
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

    async function fetchKeywordsOfAllSentences(content) {
        
        for (const sentence of content.sentences) {
            sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
        }
    }

    async function fetchWatsonAndReturnKeywords(sentence: any) {
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