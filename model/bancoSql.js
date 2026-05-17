const Sequelize = require('sequelize');

// Eu uso WSL2 e meu IP do Windows (Host) visto do WSL2, para conexão ao BD no fora do WSL2, que esta no Windows 11.
const ipWindows = '172.27.48.1'; 

const sequelize = new Sequelize(
    'produtos',
    'avaliacao_fullstack',
    'avaliacao_fullstack',
    {
        host: ipWindows,
        dialect: 'mysql',
        port: 3307,
        timezone: '-03:00'
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Conexão com MySQL (Sequelize) estabelecida com sucesso.');
    })
    .catch(err => {
        console.error('Erro ao conectar no MySQL:', err);
    });

module.exports = { Sequelize, sequelize };
