//mensagem.cy.js
describe('Teste de envio de mensagem positiva', () => {
  it('Deve logar e enviar uma nova mensagem positiva', () => {
    
    cy.visit('http://localhost:3000/login');

  
    cy.get('input[name="email"]').type('teste@teste.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    // Verifica que foi redirecionado para a página logada
    cy.url().should('include', 'index-logged');

    // Aguarda o carregamento da página
    cy.get('form#mensagemForm textarea[name="texto"]').should('exist');

    // Preenche o campo de mensagem e envia
    cy.get('form#mensagemForm textarea[name="texto"]')
      .type('Mensagem de positividade vinda do Cypress!');
    cy.get('form#mensagemForm button[type="submit"]').click();

    // Verifica se o popup aparece com a confirmação
    cy.get('#popup')
      .should('be.visible')
      .contains('Mensagem enviada com sucesso');
  });
});
