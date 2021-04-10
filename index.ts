import readline from 'readline-sync'

import {robotText} from './robots/text'



async function start() {
    const content:contentProps ={
        maximumSentences: 7
    } 

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();

    await robotText(content)


    function askAndReturnSearchTerm() {
        return readline.question('Escreva um termo para pesquisar no Wikipedia: ')
    };

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Escolha uma opcao');
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText;
    }
    console.log(JSON.stringify(content, null, 4))
}

start()