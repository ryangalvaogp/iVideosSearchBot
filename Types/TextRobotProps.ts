interface contentProps {
    searchTerm?: string
    prefix?: string
    sourceContentOriginal?: string
    sourceContentSanitizes?: string
    sentences?: [
        {
            text?: string,
            keywords?: string[],
            images?: string[],
        }
    ]
}
