const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

// Configurações de middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());

// Função utilitária para tratamento de erros
const handleError = (err, res, message = 'Erro interno do servidor') => {
    console.error(err);
    res.status(500).send({ message });
};

// ----------------------------- ROTAS CLIENTE -----------------------------

// Cadastro de cliente
app.post('/cadastro-cliente', (req, res) => {
    const { nome, email, senha } = req.body;
    const verificaEmailSQL = 'SELECT * FROM cliente WHERE email = ?';

    db.query(verificaEmailSQL, [email], (err, results) => {
        if (err) return handleError(err, res);
        if (results.length > 0) {
            return res.status(400).send({ message: 'Este email já está cadastrado!' });
        }

        const sql = 'INSERT INTO cliente (nome, email, senha) VALUES (?, ?, ?)';
        db.query(sql, [nome, email, senha], (err, result) => {
            if (err) return handleError(err, res);
            res.status(201).send({ message: 'Cliente criado!', id: result.insertId });
        });
    });
});

// Buscar clientes
app.get('/buscar-cliente', (req, res) => {
    const { nome, email } = req.query;
    let sql = 'SELECT * FROM cliente WHERE 1=1';
    const params = [];

    if (nome) {
        sql += ' AND nome LIKE ?';
        params.push(`%${nome}%`);
    }
    if (email) {
        sql += ' AND email LIKE ?';
        params.push(`%${email}%`);
    }

    db.query(sql, params, (err, results) => {
        if (err) return handleError(err, res);
        res.send(results);
    });
});

// Editar cliente
app.put('/editar-cliente/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const sql = 'UPDATE cliente SET nome = ?, email = ?, senha = ? WHERE id = ?';
    db.query(sql, [nome, email, senha, id], (err, result) => {
        if (err) return handleError(err, res);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Cliente não encontrado!' });
        }
        res.send({ message: 'Cliente atualizado com sucesso!' });
    });
});

// Deletar cliente
app.delete('/deletar-cliente/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM cliente WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return handleError(err, res);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Cliente não encontrado!' });
        }
        res.send({ message: 'Cliente deletado!' });
    });
});

// --------------------------- ROTAS PRESTADOR ----------------------------

// Cadastro de prestador
app.post('/cadastro-prestador', (req, res) => {
    const { nome, email, senha } = req.body;
    const verificaEmailSQL = 'SELECT * FROM prestador WHERE email = ?';

    db.query(verificaEmailSQL, [email], (err, results) => {
        if (err) return handleError(err, res);
        if (results.length > 0) {
            return res.status(400).send({ message: 'Este email já está cadastrado!' });
        }

        const sql = 'INSERT INTO prestador (nome, email, senha) VALUES (?, ?, ?)';
        db.query(sql, [nome, email, senha], (err, result) => {
            if (err) return handleError(err, res);
            res.status(201).send({ message: 'Prestador criado com sucesso!', id: result.insertId });
        });
    });
});

// Buscar prestadores
app.get('/buscar-prestador', (req, res) => {
    const { nome, email } = req.query;
    let sql = 'SELECT * FROM prestador WHERE 1=1';
    const params = [];

    if (nome) {
        sql += ' AND nome LIKE ?';
        params.push(`%${nome}%`);
    }
    if (email) {
        sql += ' AND email LIKE ?';
        params.push(`%${email}%`);
    }

    db.query(sql, params, (err, results) => {
        if (err) return handleError(err, res);
        res.send(results);
    });
});

// Editar prestador
app.put('/editar-prestador/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const sql = 'UPDATE prestador SET nome = ?, email = ?, senha = ? WHERE id = ?';
    db.query(sql, [nome, email, senha, id], (err, result) => {
        if (err) return handleError(err, res);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Prestador não encontrado!' });
        }
        res.send({ message: 'Prestador atualizado com sucesso!' });
    });
});

// Deletar prestador
app.delete('/deletar-prestador/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM prestador WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return handleError(err, res);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Prestador não encontrado!' });
        }
        res.send({ message: 'Prestador deletado com sucesso!' });
    });
});

// --------------------------- ROTAS PRODUTO -----------------------------

// Cadastro de produto
app.post('/cadastro-produto', (req, res) => {
    const { nome, preco, descricao, prestador_id, cliente_id } = req.body;

    // Verifica se o cliente existe
    const verificaClienteSQL = 'SELECT * FROM cliente WHERE id = ?';
    db.query(verificaClienteSQL, [cliente_id], (err, clienteResult) => {
        if (err) {
            console.log('Erro ao verificar cliente:', err);
            return res.status(500).json({ message: 'Erro interno ao verificar cliente.' });
        }

        if (clienteResult.length === 0) {
            console.log('Cliente não encontrado! ID:', cliente_id);
            return res.status(400).json({ message: 'Cliente não encontrado!' });
        }

        // Verifica se o prestador existe
        const verificaPrestadorSQL = 'SELECT * FROM prestador WHERE id = ?';
        db.query(verificaPrestadorSQL, [prestador_id], (err, prestadorResult) => {
            if (err) {
                console.log('Erro ao verificar prestador:', err);
                return res.status(500).json({ message: 'Erro interno ao verificar prestador.' });
            }

            if (prestadorResult.length === 0) {
                console.log('Prestador não encontrado! ID:', prestador_id);
                return res.status(400).json({ message: 'Prestador não encontrado!' });
            }

            // Insere o produto
            const sql = 'INSERT INTO produto (nome, preco, descricao, prestador_id, cliente_id) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [nome, preco, descricao, prestador_id, cliente_id], (err, result) => {
                if (err) {
                    console.log('Erro ao cadastrar produto:', err);
                    return res.status(500).json({ message: 'Erro interno ao cadastrar produto.' });
                }

                console.log('Produto cadastrado com sucesso! ID:', result.insertId);
                return res.status(201).json({ message: 'Produto cadastrado!', id: result.insertId });
            });
        });
    });
});

// Buscar produtos
app.get('/buscar-produto', (req, res) => {
    const { nome, preco, descricao, cliente_id, prestador_id } = req.query;
    let sql = 'SELECT * FROM produto WHERE 1=1';
    const params = [];

    if (nome) {
        sql += ' AND nome LIKE ?';
        params.push(`%${nome}%`);
    }
    if (preco) {
        sql += ' AND preco = ?';
        params.push(preco);
    }
    if (descricao) {
        sql += ' AND descricao LIKE ?';
        params.push(`%${descricao}%`);
    }
    if (cliente_id) {
        sql += ' AND cliente_id = ?';
        params.push(cliente_id);
    }
    if (prestador_id) {
        sql += ' AND prestador_id = ?';
        params.push(prestador_id);
    }

    db.query(sql, params, (err, results) => {
        if (err) return handleError(err, res);
        res.send(results);
    });
});

// Editar produto
app.put('/editar-produto/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;

    const sql = 'UPDATE produto SET nome = ?, preco = ?, descricao = ? WHERE id = ?';
    db.query(sql, [nome, preco, descricao, id], (err, result) => {
        if (err) return handleError(err, res);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Produto não encontrado!' });
        }
        res.send({ message: 'Produto atualizado!' });
    });
});

// Deletar produto
app.delete('/deletar-produto/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM produto WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return handleError(err, res);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Produto não encontrado!' });
        }
        res.send({ message: 'Produto deletado!' });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
