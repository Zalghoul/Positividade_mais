# Positividade+
Trabalho Final Teste de Software e tutorial de como rodar o programa

1-baixar o xampp e iniciar o APACHE e MYSQL

2- no xampp acessar a opção admin da sessão MySQL e criar o banco de dados de acordo com os comandos do arquivo: BancoDeDados.txt

3- colocar a pasta do programa no vscode 
no terminal do vscode com a pasta aberta escrever o seguinte comando para instalar o node-modules:
npm install

4- iniciar o node e iniciar a aplicação com os comandos: npm init -y
e depois: node server.js

5- criar mais terminais para rodas os testes:
artillery run teste.yml
caso não funcione, digitar: cd artillery 
no terminal para acessar a pasta especifica

6- teste de sistema/interface e API
npx cypress open
abrirá uma aba do cypress solicitando o navegados, após isso é só acessar as specs, as specs devem ser inicializadas na sequencia:
register.cy.js
login.cy.js
mensagem.cy.js
curtir_mensagem.cy.js
usuário.js

na mesma pasta no cypress e na pasta api estarão os testes de API e deverão ser iniciados na ordem:
register.cy.js
login.cy.js
mensagem.cy.js
curtir.cy.js
index.cy.js
usuário.cy.js

7- para os testes unitários com rotas bastar digitar o seguinte comando no terminal:
npx jest
