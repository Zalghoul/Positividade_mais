const request = require('supertest');
const app = require('../server');
const bcrypt = require('bcrypt');

jest.mock('../db', () => ({ query: jest.fn() }));
const db = require('../db');


describe('Testes das rotas', () => {

  // ===========================
  // ==== ROTA /login ==========
  // ===========================
  describe('POST /login', () => {
    it('Deve retornar erro se email ou senha não fornecidos', async () => {
      const res = await request(app).post('/login').send({});
      expect(res.statusCode).toBe(400);
    });

    it('Deve retornar sucesso se usuário e senha corretos', async () => {
      const hash = await bcrypt.hash('senha123', 10);
      db.query.mockImplementationOnce((sql, values, callback) => {
        callback(null, [{ id: 1, nome: 'Usuario', email: 'test@test.com', senha: hash }]);
      });

      const res = await request(app).post('/login').send({ email: 'test@test.com', password: 'senha123' });
      expect(res.body.success).toBe(true);
    });

    it('Deve retornar erro se senha incorreta', async () => {
      const hash = await bcrypt.hash('senhaCorreta', 10);
      db.query.mockImplementationOnce((sql, values, callback) => {
        callback(null, [{ id: 1, nome: 'Usuario', email: 'test@test.com', senha: hash }]);
      });

      const res = await request(app).post('/login').send({ email: 'test@test.com', password: 'senhaErrada' });
      expect(res.body.success).toBe(false);
    });

    it('Deve retornar erro se usuário não encontrado', async () => {
      db.query.mockImplementationOnce((sql, values, callback) => {
        callback(null, []);
      });

      const res = await request(app).post('/login').send({ email: 'naoexiste@test.com', password: '123' });
      expect(res.body.success).toBe(false);
    });
  });

  // ===========================
  // ==== ROTA /register =======
  // ===========================
  describe('POST /register', () => {
    it('Deve retornar erro se campos faltando', async () => {
      const res = await request(app).post('/register').send({ email: 'a@a.com' });
      expect(res.statusCode).toBe(400);
    });

    it('Deve retornar erro se email já existe', async () => {
      db.query.mockImplementationOnce((sql, values, callback) => {
        callback(null, [{ id: 1 }]);
      });

      const res = await request(app).post('/register').send({ name: 'Usuario', email: 'a@a.com', password: '123' });
      expect(res.statusCode).toBe(400);
    });

    it('Deve registrar usuário com sucesso', async () => {
      db.query
        .mockImplementationOnce((sql, values, callback) => callback(null, [])) // Verifica se email existe
        .mockImplementationOnce((sql, values, callback) => callback(null));

      const res = await request(app).post('/register').send({ name: 'Usuario', email: 'b@b.com', password: '123' });
      expect(res.body.success).toBe(true);
    });
  });

  // ===========================
  // ==== ROTA /update-email ===
  // ===========================
  describe('PUT /update-email', () => {
    it('Deve atualizar email com sucesso', async () => {
      db.query.mockImplementationOnce((sql, values, callback) => callback(null));

      const res = await request(app).put('/update-email').send({ user_id: 1, email: 'novo@teste.com' });
      expect(res.body.success).toBe(true);
    });
  });

  // ===========================
  // ==== ROTA /update-senha ===
  // ===========================
  describe('PUT /update-senha', () => {
    it('Deve atualizar senha com sucesso', async () => {
      db.query.mockImplementationOnce((sql, values, callback) => callback(null));

      const res = await request(app).put('/update-senha').send({ user_id: 1, senha: 'novaSenha' });
      expect(res.body.success).toBe(true);
    });
  });

  // ===========================
  // ==== ROTA /delete-user ====
  // ===========================
  describe('POST /delete-user', () => {
    it('Deve excluir conta com sucesso', async () => {
      db.query
        .mockImplementationOnce((sql, values, callback) => callback(null)) // deletar mensagens
        .mockImplementationOnce((sql, values, callback) => callback(null)); // deletar usuário

      const res = await request(app).post('/delete-user').send({ user_id: 1 });
      expect(res.body.success).toBe(true);
    });
  });

  // ===========================
  // ==== ROTA /mensagem =======
  // ===========================
  describe('POST /mensagem', () => {
    it('Deve enviar mensagem com sucesso', async () => {
      db.query.mockImplementationOnce((sql, values, callback) => callback(null));

      const res = await request(app).post('/mensagem').send({ texto: 'Teste de mensagem', user_id: 1 });
      expect(res.body.success).toBe(true);
    });
  });

  // ===========================
  // ==== ROTA /top-message ====
  // ===========================
  describe('GET /top-message', () => {
    it('Deve retornar mensagem top do mês', async () => {
      db.query.mockImplementationOnce((sql, values, callback) => {
        callback(null, [{ texto: 'Top mensagem', likes: 10 }]);
      });

      const res = await request(app).get('/top-message');
      expect(res.body.message.texto).toBe('Top mensagem');
    });

    it('Deve retornar nenhuma mensagem encontrada', async () => {
      db.query.mockImplementationOnce((sql, values, callback) => {
        callback(null, []);
      });

      const res = await request(app).get('/top-message');
      expect(res.body.message.likes).toBe(0);
    });
  });

  // ===========================
  // ==== ROTA /random-message =
  // ===========================
  describe('GET /random-message', () => {
    it('Deve retornar uma mensagem aleatória', async () => {
      db.query.mockImplementationOnce((sql, callback) => {
        callback(null, [{ id: 1, texto: 'Mensagem aleatória', likes: 5 }]);
      });

      const res = await request(app).get('/random-message');
      expect(res.body.message.texto).toBe('Mensagem aleatória');
    });

    it('Deve retornar nenhuma mensagem encontrada', async () => {
      db.query.mockImplementationOnce((sql, callback) => {
        callback(null, []);
      });

      const res = await request(app).get('/random-message');
      expect(res.body.message.likes).toBe(0);
    });
  });

  // ===========================
  // ==== ROTA /increment-likes =
  // ===========================
  describe('POST /increment-likes', () => {
    it('Deve incrementar like com sucesso', async () => {
      db.query.mockImplementationOnce((sql, values, callback) => callback(null));

      const res = await request(app).post('/increment-likes').send({ id: 1 });
      expect(res.body.success).toBe(true);
    });
  });
});