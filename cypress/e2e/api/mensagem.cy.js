//mensagem.cy.js
describe('API Mensagem', () => {
  const baseUrl = 'http://localhost:3000';

  let userId;

  // Faz login antes dos testes para pegar o user_id
  before(() => {
    cy.request('POST', `${baseUrl}/login`, {
      email: 'teste@teste.com',
      password: '123456'
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('user');
      userId = res.body.user.id;
    });
  });

  it('Deve enviar mensagem com usuário logado', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/mensagem`,
      body: {
        texto: 'Mensagem de teste via API',
        user_id: userId
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('message').and.to.match(/sucesso/i);
    });
  });

  it('Deve falhar ao enviar mensagem sem texto ou user_id', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/mensagem`,
      failOnStatusCode: false,
      body: {
        texto: '',
        user_id: ''
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('message').and.to.match(/necessário/i);
    });
  });
});
