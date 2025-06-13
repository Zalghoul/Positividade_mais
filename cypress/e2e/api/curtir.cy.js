//curtir.cy.js
describe('API Curtir Mensagem', () => {
  let mensagemId;

  before(() => {
    // Primeiro pega uma mensagem aleatória para usar o ID no teste
    cy.request('GET', 'http://localhost:3000/random-message')
      .then((res) => {
        expect(res.status).to.eq(200);
        mensagemId = res.body.message.id;
      });
  });

  it('Deve incrementar os likes de uma mensagem', () => {
    cy.request('POST', 'http://localhost:3000/increment-likes', { id: mensagemId })
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('success', true);
      });
  });

  it('Deve retornar erro ao não enviar o ID', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/increment-likes',
      body: {},  // sem id
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.match(/id/i);
    });
  });
});
