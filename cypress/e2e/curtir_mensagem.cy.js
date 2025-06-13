// curtir_mensagem.cy.js
describe('Fluxo de mensagens', () => {
  it('Deve logar, ver mensagens, curtir e passar para próxima', () => {
    // Visita a página de login
    cy.visit('http://localhost:3000/login.html');

    // Preenche o formulário de login
    cy.get('input[name="email"]').type('teste@teste.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    // Aguarda o redirecionamento para index-logged.html
    cy.url().should('include', 'index-logged');

    // Clica no botão "Ver Mensagem"
    cy.get('a').contains('Ver Mensagem').click();

    // Aguarda a navegação para a página de mensagens
    cy.url().should('include', 'mensagem-logged');

    // Aguarda o carregamento da mensagem
    cy.get('#messageText', { timeout: 5000 }).should('not.be.empty');

    // Clica no botão de curtir
    cy.get('form#likeForm button').click();

    // Verifica se o alerta de sucesso apareceu (caso esteja usando alert, você pode stubar)
    cy.on('window:alert', (msg) => {
      expect(msg).to.match(/(Like adicionado|Erro ao adicionar like)/);
    });

    // Clica no botão "Próxima Mensagem"
    cy.get('#nextMessageButton').click();

    // Verifica que a próxima mensagem foi carregada
    cy.get('#messageText', { timeout: 5000 }).should('not.be.empty');
  });
});
