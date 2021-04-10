warning: LF will be replaced by CRLF in package.json.
The file will have its original line endings in your working directory
[1mdiff --git a/package.json b/package.json[m
[1mindex 3706866..0d22935 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -4,7 +4,7 @@[m
   "description": "Este projeto consiste em robôs que buscam imagens, textos, montam um vídeo com after effects e publica no YouTube de acordo com o que o usuário digita.",[m
   "main": "index.js",[m
   "scripts": {[m
[31m-    "test": "echo \"Error: no test specified\" && exit 1"[m
[32m+[m[32m    "dev": "ts-node-dev --transpile-only --inspect  --ignore-watch node_modules index.ts"[m
   },[m
   "repository": {[m
     "type": "git",[m
[36m@@ -16,5 +16,16 @@[m
   "bugs": {[m
     "url": "https://github.com/ryangalvaogp/iVideosSearchBot/issues"[m
   },[m
[31m-  "homepage": "https://github.com/ryangalvaogp/iVideosSearchBot#readme"[m
[32m+[m[32m  "homepage": "https://github.com/ryangalvaogp/iVideosSearchBot#readme",[m
[32m+[m[32m  "dependencies": {[m
[32m+[m[32m    "readline-sync": "^1.4.10",[m
[32m+[m[32m    "ts-node-dev": "^1.1.6"[m
[32m+[m[32m  },[m
[32m+[m[32m  "devDependencies": {[m
[32m+[m[32m    "@types/node": "^14.14.37",[m
[32m+[m[32m    "@types/react-dom": "^17.0.3",[m
[32m+[m[32m    "@types/readline-sync": "^1.4.3",[m
[32m+[m[32m    "@types/typescript": "^2.0.0",[m
[32m+[m[32m    "typescript": "^4.2.4"[m
[32m+[m[32m  }[m
 }[m
