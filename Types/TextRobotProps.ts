export interface contentProps {
    searchTerm?: string
    prefix?: string
    sourceContentOriginal?: string 
    sourceContentSanitizes?: string 
    sentences: [
        {
            text: string 
            keywords: string[]
            images: string[]
        }
    ]
    maximumSentences: number
}
export interface limitMaximumSentencesProps{
    sentences: contentProps['sentences'][]
    maximumSentences: contentProps['maximumSentences']
}

export interface fetchKeywordsOfAllSentencesProps{
    sentences: contentProps['sentences']
}

export type fetchWatsonAndReturnKeywordsResponseProps = {
    keywords:{
        text:string
    }[]
}