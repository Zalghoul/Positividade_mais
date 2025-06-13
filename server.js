const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

// ================== ROTAS ================== //

// Rota de Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
    }

    const query = 'SELECT * FROM usuario WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao conectar ao banco de dados' });
        }
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.senha, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Erro ao verificar senha' });
                }
                if (isMatch) {
                    res.json({ success: true, message: 'Login bem-sucedido!', user: { id: user.id, nome: user.nome } });
                } else {
                    res.json({ success: false, message: 'Senha incorreta!' });
                }
            });
        } else {
            res.json({ success: false, message: 'Usuário não encontrado!' });
        }
    });
});

// Rota de Registro
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Nome, email e senha são obrigatórios' });
    }

    const queryCheck = 'SELECT * FROM usuario WHERE email = ?';
    db.query(queryCheck, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao verificar email existente' });
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'Email já registrado' });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao criptografar senha' });
            }

            const queryInsert = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)';
            db.query(queryInsert, [name, email, hash], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Erro ao registrar usuário: ' + err.message });
                }
                res.json({ success: true, message: 'Registro bem-sucedido!' });
            });
        });
    });
});

// Rota para enviar mensagem
app.post('/mensagem', (req, res) => {
    const { texto, user_id } = req.body;
    if (!texto || !user_id) {
        return res.status(400).json({ success: false, message: 'Cadastro é necessário para enviar mensagens' });
    }

    const query = 'INSERT INTO mensagem (texto, likes, data_criacao, user_id) VALUES (?, 0, NOW(), ?)';
    db.query(query, [texto, user_id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao enviar mensagem: ' + err.message });
        }
        res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
    });
});

// Rota atualizar e-mail
app.put('/update-email', (req, res) => {
    const { user_id, email } = req.body;

    db.query('UPDATE usuario SET email = ? WHERE id = ?', [email, user_id], (err) => {
        if (err) return res.json({ success: false, message: 'Erro ao atualizar o email.' });
        res.json({ success: true, message: 'Email atualizado com sucesso!' });
    });
});

// Rota atualizar senha
app.put('/update-senha', (req, res) => {
    const { user_id, senha } = req.body;

    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao criptografar senha.' });
        }

        db.query('UPDATE usuario SET senha = ? WHERE id = ?', [hash, user_id], (err) => {
            if (err) return res.json({ success: false, message: 'Erro ao atualizar a senha.' });
            res.json({ success: true, message: 'Senha atualizada com sucesso!' });
        });
    });
});

// Rota para excluir conta do usuário
app.post('/delete-user', (req, res) => {
    const { user_id } = req.body;

    // Primeiro exclui as mensagens do usuário
    const deleteMessagesQuery = 'DELETE FROM mensagem WHERE user_id = ?';
    db.query(deleteMessagesQuery, [user_id], (err) => {
        if (err) {
            return res.json({ success: false, message: 'Erro ao excluir mensagens do usuário.' });
        }

        // Depois exclui o usuário
        const deleteUserQuery = 'DELETE FROM usuario WHERE id = ?';
        db.query(deleteUserQuery, [user_id], (err) => {
            if (err) {
                return res.json({ success: false, message: 'Erro ao excluir a conta.' });
            }
            res.json({ success: true, message: 'Conta excluída com sucesso!' });
        });
    });
});





// Rota top mensagem do mês
app.get('/top-message', (req, res) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const query = `SELECT texto, likes FROM mensagem WHERE MONTH(data_criacao) = ? AND YEAR(data_criacao) = ? ORDER BY likes DESC LIMIT 1`;

    db.query(query, [currentMonth, currentYear], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            res.json({ message: results[0] });
        } else {
            res.json({ message: { texto: "Nenhuma mensagem encontrada para este mês.", likes: 0 } });
        }
    });
});

// Rota mensagem aleatória
app.get('/random-message', (req, res) => {
    const query = 'SELECT id, texto, likes FROM mensagem ORDER BY RAND() LIMIT 1';

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            res.json({ message: results[0] });
        } else {
            res.json({ message: { texto: "Nenhuma mensagem encontrada.", likes: 0 } });
        }
    });
});

// Rota incrementar likes
app.post('/increment-likes', (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ success: false, message: 'ID da mensagem é obrigatório' });
    }

    const query = 'UPDATE mensagem SET likes = likes + 1 WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ success: true });
    });
});

// ============ SERVE ARQUIVOS HTML DIRETAMENTE ============ //

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/index-logged', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index-logged.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

app.get('/mensagemsite', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mensagemsite.html'));
});

app.get('/mensagem-logged', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mensagem-logged.html'));
});

app.get('/usuario', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'usuario.html'));
});

// ================== LISTEN ================== //

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
