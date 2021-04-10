import readline from 'readline-sync'

import {load, save} from './state'

export default function input (){
    const content: contentProps = {
        maximumSentences: 7
    }
    
    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();
    save(content);
    
    function askAndReturnSearchTerm() {
        return readline.question('Escreva um termo para pesquisar no Wikipedia: ')
    };
    
    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Escolha uma opcao');
        const selectedPrefixText = prefixes[selectedPrefixIndex]
    
        return selectedPrefixText;
    }
}
