//login.cy.js
describe('Login', () => {
  it('Deve mostrar erro se campos estiverem vazios', () => {
    cy.visit('http://localhost:3000/login');

    // Clica no botão de login sem preencher nada
    cy.get('button[type="submit"]').click();

    // Aguarda brevemente e verifica se a mensagem foi injetada no DOM
    cy.wait(500); // tempo suficiente pro JS rodar
    cy.get('#popupMessage')
      .invoke('text')
      .should('match', /obrigatórios/i);
  });

  it('Deve logar com sucesso', () => {
    cy.visit('http://localhost:3000/login');

    cy.get('#email').type('teste@teste.com');
    cy.get('#password').type('123456');
    cy.get('button[type="submit"]').click();

    // Aguarda redirecionamento
    cy.url({ timeout: 5000 }).should('include', 'index-logged');
  });
});
