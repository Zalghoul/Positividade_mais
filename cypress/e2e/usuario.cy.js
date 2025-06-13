//usuario.cy.js
describe('Configurações do Usuário', () => {
  it('Deve logar, acessar a página de usuário, atualizar email e senha, e excluir a conta', () => {
    cy.visit('http://localhost:3000/login.html');

    // Preenche o login com email
    cy.get('#email').type('teste@teste.com');  // Use um email válido do seu banco de teste
    cy.get('#password').type('123456');

    // Clica em "Entrar"
    cy.get('button[type="submit"]').click();

    // Aguarda o redirecionamento para a página logada
    cy.url().should('include', 'index-logged');

    // Vai para a página de configurações do usuário
    cy.visit('http://localhost:3000/usuario.html');

    // Aguarda o carregamento da página
    cy.contains('Configurações do Usuário').should('be.visible');

    // Stub para capturar alertas
    cy.window().then(win => {
      cy.stub(win, 'alert').as('alerta');
    });

    // Atualiza o email
    const novoEmail = `teste2@teste.com`;
    cy.get('#email').clear().type(novoEmail);
    cy.contains('Atualizar Email').click();

    cy.get('@alerta').should('be.calledWithMatch', /atualizado/i);

    // Atualiza a senha
    const novaSenha = 'novaSenha123';
    cy.get('#senha').type(novaSenha);
    cy.get('#confirmarSenha').type(novaSenha);
    cy.contains('Atualizar Senha').click();

    cy.get('@alerta').should('be.calledWithMatch', /atualizada/i);

    // Stub para confirmar exclusão
    cy.window().then(win => {
      cy.stub(win, 'confirm').returns(true);
    });

    cy.contains('Excluir Conta').click();

    cy.get('@alerta').should('be.calledWithMatch', /conta|excluída|sucesso/i);

    // Verifica que voltou para a página inicial
    cy.url().should('include', 'index.html');
  });
});
