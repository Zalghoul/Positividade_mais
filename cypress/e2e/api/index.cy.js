//index.cy.js
describe('API Mensagens Públicas', () => {
  it('Deve retornar a top mensagem do mês', () => {
    cy.request('GET', 'http://localhost:3000/top-message')
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.have.property('texto');
        expect(res.body.message).to.have.property('likes');
      });
  });

  it('Deve retornar uma mensagem aleatória', () => {
    cy.request('GET', 'http://localhost:3000/random-message')
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.have.property('texto');
        expect(res.body.message).to.have.property('likes');
        expect(res.body.message).to.have.property('id');
      });
  });
});
