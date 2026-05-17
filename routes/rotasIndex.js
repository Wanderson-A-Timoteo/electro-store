var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { Usuario, Categoria } = require('../model/modelos');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ElectroStore' });
});

/* GET Povoamento Inicial */
router.get('/povoamento', async function(req, res, next) {
  try {
    // Cria Categorias
    await Categoria.bulkCreate([
      { nome: 'Notebooks' },
      { nome: 'Smartphones' },
      { nome: 'Acessórios' }
    ], { ignoreDuplicates: true });

    // Cria o Usuário Admin com senha "123456" criptografada
    const senhaCriptografada = bcrypt.hashSync('123456', 10);
    
    await Usuario.findOrCreate({
      where: { email: 'admin@electrostore.com' },
      defaults: {
        nome: 'Administrador',
        senha_hash: senhaCriptografada,
        perfil: 'admin'
      }
    });

    res.send('Povoamento realizado com sucesso! Categorias e Usuário Admin criados. <a href="/">Voltar</a>');
  } catch (error) {
    res.status(500).send('Erro no povoamento: ' + error.message);
  }
});

module.exports = router;
