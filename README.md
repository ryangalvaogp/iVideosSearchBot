<h1 align="center"> iVideos Search Bot </h1>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/ryangalvaogp/iVideosSearchBot?style=flat?logo=TYPESCRIPT">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/ryangalvaogp/iVideosSearchBot?style=flat">
  <a href="https://github.com/ryangalvaogp/iVideosSearchBot/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/ryangalvaogp/iVideosSearchBot?style=flat">
  </a>
  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen?style=flat">
</p>
<p align="justify">Este projeto consiste em robôs que a partir do input do usuário, buscam textos no wikipédia, fazem downloads de imagens e renderizam um vídeo com after effects ou FFmpeg.
 </p>

## Pré requisitos

- Node (https://nodejs.org)
- After Effects CC 2019 (https://www.adobe.com/br/products/aftereffects.html)
- FFmpeg (https://www.ffmpeg.org/)
- Image Magick (https://imagemagick.org/index.php)

- Git (https://git-scm.com/)

## Configurações Iniciais

- Instale todos pré requisitos;
- Defina o caminho do FFmpeg no path das variáveis ambientes: `'C:\Program Files (x86)\ffmpeg\bin'`

- Verifique o caminho do ImageMagick no path das variáveis ambientes: `'C:\Program Files\ImageMagick-7.0.11-Q16-HDRI'`

- Verifique e insira suas APIs_Keys na pasta credenciais
 

  ### Algorithima 
  - É necessário criar a sua chave de acesso para poder testar os robôs, pra isso você precisa acessar o site do [Algorithmia](https://algorithmia.com/), aqui não tem muito segredo, basta acessar e se cadastrar, depois de logar na sua conta, na Dashboard procure no menu **Api Keys** e **copie**.
   Vá até a pasta do projeto onde você clonou o repositório, navegue até a pasta **iVideosSearchBot\credentials**, crie um arquivo de texto e renomeie para `algorithmia.json`, dentro desse arquivo você irá colocar a `API` que copiou do site **Algorithmia** na estrutura abaixo:
``` js
{
  "apiKeyAlgorithmia": "API_KEY_AQUI"
}
```
 ### Watson
  - Você precisa criar também as credenciais do *Watson* no site da [IBM](https://cloud.ibm.com/login), também não tem segredo, basta se cadastrar, quando estiver logado no menu superior clique em **Catálogo**, depois dentro de **IA** procure por *Natural Language Understanding*
clicando nele na nova página vai aparecer um botão "criar" no final da página, uma vez que o serviço for criado, você será redirecionado para a página de gerenciamento do serviço que você acabou de criar, no menu lateral esquerdo procure por **Credenciais de Serviços** e depois clique em **Auto-generated service credentials** destacado abaixo, então copie as *Credenciais*:

Novamente, voltando na pasta do projeto ainda dentro da pasta **iVideosSearchBot\credentials** você irá adicionar as chaves conforme o modelo a seguir:

``` js
{
  "apiKeyAlgorithmia":"API_KEY_AQUI",
    "nlu":  {
        "apikey":  "...",
        "iam_apikey_description":  "...",
        "iam_apikey_name":  "...",
        "iam_role_crn":  "...",
        "iam_serviceid_crn":  "...",
        "url":  "..."
      },
}
```
  ### Google Cloud Plataform
  - Antes de criarmos as api's que iremos utilizar é necessário vincular a nossa conta do Google com o [Google Cloud Plataform](https://cloud.google.com/), na página do **Google Cloud Plataform** você irá clicar no botão **Faça uma Avaliação Gratuita** e em seguida marque a opção **Termos e Condições**

> Ps.: É importante lembrar que alguns recursos do **Google Cloud Plataform** são **Pagos**, por esse motivo é necessário inserir as informações de pagamento, mas fique tranquilo porque iremos utilizar apenas os recursos **Gratuitos**

  #### Criando o Projeto
  
Agora é a hora de criarmos um projeto que iremos vincular as Api's que vamos utilizar, para isso basta clicar no menu do topo da página "**Selecionar projeto**" e depois em "**Novo Projeto**":

![image](https://user-images.githubusercontent.com/34013325/55571155-52e3d400-56db-11e9-998f-bd99ab647403.png)

de um nome ao projeto e clique no botão **criar:**

![image](https://user-images.githubusercontent.com/34013325/55571267-963e4280-56db-11e9-9b21-7f028caa05c1.png)

após isso o projeto começará a ser criado e assim que terminar um menu vai aparecer com o projeto que acabamos de criar então você irá seleciona-lo:

![image](https://user-images.githubusercontent.com/34013325/55571506-064cc880-56dc-11e9-804b-f14003dccc09.png)

## Api: Custom Search API ##

Com o projeto criado agora é hora de habilitarmos e configurarmos a Api, você irá clicar no menu lateral esquerdo no topo navegar até **API's e Serviços** > **Bibliotecas**:

![image](https://user-images.githubusercontent.com/34013325/55572521-22ea0000-56de-11e9-89cc-f477fe18bf65.png)

no campo de pesquisa basta procurar por **Custom Search API**, clicar em **Ativar**, e aguardar até a ativação da api:

![image](https://user-images.githubusercontent.com/34013325/55572661-78bea800-56de-11e9-9ae3-fbc87758aa84.png)

Após a ativação vai aparecer uma mensagem solicitando a criação das credenciais da API, então basta você clicar em **Criar Credenciais**:

![image](https://user-images.githubusercontent.com/34013325/55572835-eb2f8800-56de-11e9-8292-fc3c4bf74084.png)

Procure por **Custom Search API** no dropdown e clique em "**Preciso de quais credenciais?**"

![image](https://user-images.githubusercontent.com/34013325/55572958-2cc03300-56df-11e9-8bc1-17641ba5138e.png)

Após isso irá aparecer sua Api Key, você vai copia-la e clicar no botão concluir, voltando a pasta do projeto você vai navegar até **video-maker/credentials** e irá adicionar as chaves, conforme o modelo a seguir:

``` js
{
  "apiKeyAlgorithmia":"API_KEY_AQUI",
    "nlu":  {
        "apikey":  "...",
        "iam_apikey_description":  "...",
        "iam_apikey_name":  "...",
        "iam_role_crn":  "...",
        "iam_serviceid_crn":  "...",
        "url":  "..."
      },
    "google":{
        "apiKey": "...",
    }
}
```
## Api: Custom Search Enginer ##
Agora iremos configurar o nosso motor de busca personalizado do google, para isso você vai acessar o [Custom Search Engine](https://cse.google.com/cse/create/new), e irá informar o **site a pesquisar** coloque **google.com**, ire selecionar o idioma que preferir *no vídeo o Filipe deixa Inglês então aconselho deixar em inglês*, e por fim clique em **Opções avançadas** e para o esquema iremos utilizar o mais genérico **Thing**, pronto tudo preenchido você irá clicar em **criar**:

![image](https://user-images.githubusercontent.com/34013325/55578410-38662680-56ec-11e9-80ea-06ff9e25ba3f.png)

Agora basta clicar em **Painel de Controle** na nova tela nós iremos habilitar a opção **Pesquisa de imagens** e depois iremos clicar no botão **Copiar para área de transferência**"

![image](https://user-images.githubusercontent.com/34013325/55574756-8a567e80-56e3-11e9-99ea-d307547c781f.png)

> Ps.: Existem diversas opções que eu aconselho futuramente você testar e descobrir o que cada uma dela faz 😋 

![image](https://user-images.githubusercontent.com/34013325/55574920-0355d600-56e4-11e9-8f36-822a62224fab.png)

Voltando no arquivo **google-search.json** iremos criar uma nova propriedade e iremos colar o código identificador do mecanismo de busca que criamos, identificado por `searchEngineId`, no final irá ficar assim:

``` js
{
  "apiKeyAlgorithmia":"API_KEY_AQUI",
    "nlu":  {
        "apikey":  "...",
        "iam_apikey_description":  "...",
        "iam_apikey_name":  "...",
        "iam_role_crn":  "...",
        "iam_serviceid_crn":  "...",
        "url":  "..."
      },
    "google":{
        "IDSearchEngine": "...",,
        "apiKey": "...",
    }
}
```

- Crie um arquivo `.env` e dentro dele insira o caminho do After Effects e FFmpeg Convert, conforme o modelo a seguir:
``````env
AFTER_EFFECTS_PATH_DARWIN=/Applications/Adobe After Effects CC 2019/aerender
AFTER_EFFECTS_PATH_WIN_32=C:\\Program Files\\Adobe\\Adobe After Effects CC 2019\\Support Files\\aerender.exe
FFMPEGCONVERTPATH=C:\\Program Files (x86)\\ffmpeg\\bin\\ffmpeg.exe


``````

- Abra o template.aep que está dentro da pasta iVideosSearchBot\templates\1\, localize a expression do texto que corresponde ao título da pesquisa e mude o caminho do $.eval na para o que realmente corresponde no seu sistema. Seguindo o modelo a baixo:

`````js
$.evalFile('C:\Users\ryangalvaogp\Documents\GitHub\iVideosSearchBot\templates\1');
content
`````
  


> Verifique se os caminhos citados correspondem aos mesmos em sua máquina, caso contrário, substitua pelo os que estão em seu sistema.


## Executando o Projeto ##
Dentro da pasta **iVideosSearchBot** você pode abrir o **cmd** ou **powershell** e executar o comando:
```
yarn dev
```
