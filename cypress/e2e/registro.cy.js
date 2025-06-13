//registro.cy.js
describe('Página de Registro', () => {
  it('deve registrar um novo usuário com sucesso', () => {
    cy.visit('http://localhost:3000/registro');

    cy.get('input[name="name"]').type('Novo Usuario');
    cy.get('input[name="email"]').type('teste@teste.com');
    cy.get('input[name="password"]').type('123456');

    cy.get('button[type="submit"]').click();

    // Verifica se a mensagem de sucesso aparece no popup
    cy.get('#popupMessage').should('contain', 'Registro bem-sucedido');
  });
});
