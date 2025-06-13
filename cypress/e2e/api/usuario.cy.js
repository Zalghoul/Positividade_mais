//usuario.cy.js
describe('API Usuário', () => {
  // Antes de tudo, faz login para pegar user_id (ou usa fixo)
  let userId;

  before(() => {
    cy.request('POST', 'http://localhost:3000/login', {
      email: 'teste@teste.com',
      password: '123456'
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      userId = res.body.user.id; // captura user_id
    });
  });

  it('Deve atualizar o email', () => {
    const novoEmail = 'novoemail@teste.com';

    cy.request('PUT', 'http://localhost:3000/update-email', {
      user_id: userId,
      email: novoEmail
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.match(/atualizado/i);
    });
  });

  it('Deve atualizar a senha', () => {
    const novaSenha = 'novaSenha123';

    cy.request('PUT', 'http://localhost:3000/update-senha', {
      user_id: userId,
      senha: novaSenha
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.match(/atualizada/i);
    });
  });

  it('Deve deletar a conta do usuário', () => {
    cy.request('POST', 'http://localhost:3000/delete-user', {
      user_id: userId
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.match(/excluída/i);
    });
  });
});
