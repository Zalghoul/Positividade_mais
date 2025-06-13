//register.cy.js
describe('API Registro', () => {
  const baseUrl = 'http://localhost:3000';

  it('Deve registrar usuário com dados válidos', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/register`,
      body: {
        name: 'Usuario de drogas',
        email: `teste${Date.now()}@teste.com`, // email único para evitar conflito
        password: '123456'
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('message').and.to.match(/registro bem-sucedido/i);
    });
  });

  it('Deve falhar ao registrar sem nome, email ou senha', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/register`,
      failOnStatusCode: false,
      body: {
        name: '',
        email: '',
        password: ''
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('message').and.to.match(/obrigatórios/i);
    });
  });

  it('Deve falhar ao registrar com email já existente', () => {
    const existingEmail = 'teste@teste.com'; // um email já cadastrado no seu DB
    cy.request({
      method: 'POST',
      url: `${baseUrl}/register`,
      failOnStatusCode: false,
      body: {
        name: 'Usuário Teste',
        email: existingEmail,
        password: '123456'
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body).to.have.property('message').and.to.match(/registrado/i);
    });
  });
});
