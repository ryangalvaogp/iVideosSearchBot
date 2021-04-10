import readline from 'readline-sync'

interface contentProps {
    searchTerm?: string
    prefix?: string
    sourceContentOriginal?: string
    sourceContentSanitizes?: string
    sentences?: [
        {
            text: string,
            keywords: string[],
            images: string[],
        }
    ]
}



function start() {
    const content:contentProps ={} 

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();

    function askAndReturnSearchTerm() {
        return readline.question('Escreva um termo para pesquisar no Wikipedia: ')
    };

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Escolha uma opcao');
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText;
    }
    console.log(content)
}

start()