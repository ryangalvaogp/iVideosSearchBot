export interface contentProps {
    renderProgram: RenderProgramProps
    searchTerm?: string
    prefix?: string
    lang?: string;
    titleSearch?: any;
    sourceContentOriginal?: string 
    sourceContentSanitizes?: string 
    sentences: [
        {
            text ?: string
            keywords?:  string[]
            images?: string[]
            googleSearchQuery?:string
        }
    ] ,
    downloadedImages:string[]
    maximumSentences: number
}
export type RenderProgramProps= 'After Effects' | 'FFmpeg' 
export interface limitMaximumSentencesProps{
    sentences: contentProps['sentences'][]
    maximumSentences: contentProps['maximumSentences']
}

export interface fetchKeywordsOfAllSentencesProps{
    sentences: string[]
}

export type fetchWatsonAndReturnKeywordsResponseProps = {
    keywords:{
        text:string
    }[]
}