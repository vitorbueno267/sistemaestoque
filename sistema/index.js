const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// Rotas

// Cadastrar cliente
app.post('/cadastro-cliente', (req, res) => {
    const { nome, email, senha } = req.body;

    // Verificar se o email já existe
    const verificaEmailSQL = 'SELECT * FROM cliente WHERE email = ?';
    db.query(verificaEmailSQL, [email], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length > 0) {
            // Email já cadastrado
            return res.status(400).send({ message: 'Este email já está cadastrado!' });
        }

        // Caso o email não exista, insere o novo cliente
        const sql = 'INSERT INTO cliente (nome, email, senha) VALUES (?, ?, ?)';
        db.query(sql, [nome, email, senha], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send({ message: 'Cliente criado!', id: result.insertId });
        });
    });
});

// Cadastrar prestador
app.post('/cadastro-prestador', (req, res) => {
    const { nome, email, senha } = req.body;

    // Verificar se o email já existe
    const verificaEmailSQL = 'SELECT * FROM prestador WHERE email = ?';
    db.query(verificaEmailSQL, [email], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length > 0) {
            // Email já cadastrado
            return res.status(400).send({ message: 'Este email já está cadastrado!' });
        }

        // Caso o email não exista, insere o novo prestador
        const sql = 'INSERT INTO prestador (nome, email, senha) VALUES (?, ?, ?)';
        db.query(sql, [nome, email, senha], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send({ message: 'Prestador criado!', id: result.insertId });
        });
    });
});

// Cadastrar produto
app.post('/cadastro-produto', (req, res) => {
    const { id_cliente, id_prestador, descricao } = req.body;

    // Verificar se o cliente e o prestador existem
    const verificaClienteSQL = 'SELECT * FROM cliente WHERE id = ?';
    db.query(verificaClienteSQL, [id_cliente], (err, clienteResult) => {
        if (err) return res.status(500).send(err);
        if (clienteResult.length === 0) {
            return res.status(400).send({ message: 'Cliente não encontrado!' });
        }

        const verificaPrestadorSQL = 'SELECT * FROM prestador WHERE id = ?';
        db.query(verificaPrestadorSQL, [id_prestador], (err, prestadorResult) => {
            if (err) return res.status(500).send(err);
            if (prestadorResult.length === 0) {
                return res.status(400).send({ message: 'Prestador não encontrado!' });
            }

            // Inserir o novo produto
            const sql = 'INSERT INTO produto (id_cliente, id_prestador, descricao) VALUES (?, ?, ?)';
            db.query(sql, [id_cliente, id_prestador, descricao], (err, result) => {
                if (err) return res.status(500).send(err);
                res.status(201).send({ message: 'Produto cadastrado!', id: result.insertId });
            });
        });
    });
});

// Buscar cliente
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
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// Buscar prestador
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
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// Buscar produto
app.get('/buscar-produto', (req, res) => {
    const { id_cliente, id_prestador, descricao } = req.query;

    let sql = 'SELECT * FROM produto WHERE 1=1';
    const params = [];

    if (id_cliente) {
        sql += ' AND id_cliente = ?';
        params.push(id_cliente);
    }
    if (id_prestador) {
        sql += ' AND id_prestador = ?';
        params.push(id_prestador);
    }
    if (descricao) {
        sql += ' AND descricao LIKE ?';
        params.push(`%${descricao}%`);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// Editar cliente
app.put('/editar-cliente/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const sql = 'UPDATE cliente SET nome = ?, email = ?, senha = ? WHERE id = ?';
    db.query(sql, [nome, email, senha, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Cliente não encontrado!' });
        }
        res.send({ message: 'Cliente atualizado!' });
    });
});

// Editar prestador
app.put('/editar-prestador/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const sql = 'UPDATE prestador SET nome = ?, email = ?, senha = ? WHERE id = ?';
    db.query(sql, [nome, email, senha, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Prestador não encontrado!' });
        }
        res.send({ message: 'Prestador atualizado!' });
    });
});

// Editar produto
app.put('/editar-produto/:id', (req, res) => {
    const { id } = req.params;
    const { id_cliente, id_prestador, descricao } = req.body;

    const sql = 'UPDATE produto SET id_cliente = ?, id_prestador = ?, descricao = ? WHERE id = ?';
    db.query(sql, [id_cliente, id_prestador, descricao, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Produto não encontrado!' });
        }
        res.send({ message: 'Produto atualizado!' });
    });
});

// Deletar cliente
app.delete('/deletar-cliente/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM cliente WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Cliente não encontrado!' });
        }
        res.send({ message: 'Cliente deletado!' });
    });
});

// Deletar prestador
app.delete('/deletar-prestador/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM prestador WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Prestador não encontrado!' });
        }
        res.send({ message: 'Prestador deletado!' });
    });
});

// Deletar produto
app.delete('/deletar-produto/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM produto WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
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

