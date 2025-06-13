//login.cy.js
describe('API Login', () => {
  it('Deve logar com sucesso', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/login',
      body: {
        email: 'teste@teste.com',
        password: '123456'
      },
      failOnStatusCode: false // para o teste não falhar se a API responder erro
    }).then((response) => {
      expect(response.status).to.eq(200); // status HTTP esperado
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('id');
      expect(response.body.user).to.have.property('nome');
    });
  });

  it('Deve falhar ao logar com senha errada', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/login',
      body: {
        email: 'teste@teste.com',
        password: 'senhaErrada'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200); // seu backend retorna 200 mesmo no erro, com success false
      expect(response.body).to.have.property('success', false);
      expect(response.body.message).to.match(/senha/i);
    });
  });

  it('Deve falhar se não enviar email e senha', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/login',
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400); // seu backend retorna 400 para falta de dados
      expect(response.body).to.have.property('success', false);
      expect(response.body.message).to.match(/obrigatórios/i);
    });
  });
});
