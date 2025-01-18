const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',   // Seu host MySQL
    user: 'root',      // Seu usuário MySQL
    password: '12345',      // Sua senha MySQL
    database: 'sistema'  // Nome do seu banco de dados MySQL
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

module.exports = db;
