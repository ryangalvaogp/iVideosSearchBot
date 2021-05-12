import readline from 'readline-sync'
import { contentProps, RenderProgramProps } from '../Types/TextRobotProps';

import {load, save} from './state'

export default function input (){
    //@ts-ignore | This variable is filled in during the execution of the robots
    const content: contentProps = {
        maximumSentences: 7
    }
    
    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();
    content.lang = askAndReturnLang();
    content.renderProgram = chooseRenderProgram()

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

    function askAndReturnLang(){
        const prefixes = [
            'Portugues', 
            'Ingles',
            'Espanhol',
            'Russo',
            'Japones',
        ];
        const idioma = [
            'pt', 
            'en',
            'es',
            'ru',
            'ja',
        ]
        const selectLanguageIndex = readline.keyInSelect(prefixes, 'Escolha um idioma');
        const selectLanguageText = idioma[selectLanguageIndex];

        return selectLanguageText;
    }

    function chooseRenderProgram():RenderProgramProps{
        const prefixes:RenderProgramProps[] = [
            'After Effects',
            'FFmpeg'
        ];
        
        const selectProgramIndex = readline.keyInSelect(prefixes, 'Escolha um programa para renderizacao do video');
        const selectProgram = prefixes[selectProgramIndex]

        return selectProgram;
    }
}
