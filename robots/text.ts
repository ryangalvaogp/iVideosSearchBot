import algorithmia from 'algorithmia'
import sentenceBoundaryDetection from 'sbd'
import api from '../credetials/env.json'

export async function robotText(content: contentProps) {
    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    breakContentIntoSentences(content);
   

    async function fetchContentFromWikipedia(content: contentProps) {
        const algorithmiaAuthenticated = algorithmia(api.apiKey)
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

            const withoutBlankLinesAndMarkdown = allLines.filter((line:string) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false;
                }
                return true
            })
            return withoutBlankLinesAndMarkdown.join(' ')
        }

        function removeDatesInParentheses(text:string){
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        }
        
    };

    function breakContentIntoSentences(content: contentProps){
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitizes) 
        
        sentences.forEach((sentence)=>{
            content.sentences.push({
                text:sentence,
                keywords:[''],
                images:['']
            })
        })
        console.log(content.sentences)
    };
}; 