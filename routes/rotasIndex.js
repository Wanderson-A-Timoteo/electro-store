var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
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

/* GET Tela de Login */
router.get('/login', function(req, res, next) {
  // Se o usuário já estiver logado, redireciona para a home
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Login - ElectroStore' });
});

/* POST Processar Login */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',        // Se der certo, vai pra home
  failureRedirect: '/login',   // Se der errado, volta pro login
  failureFlash: true           // Exibe "Senha incorreta" ou "Usuário não encontrado"
}));

/* GET Sair (Logout) */
router.get('/sair', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

/* GET Tela de Cadastro */
router.get('/cadastro', function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('cadastro', { title: 'Cadastro - ElectroStore' });
});

/* POST Processar Cadastro */
router.post('/cadastro', async function(req, res, next) {
  try {
    const { nome, email, senha, confirmaSenha } = req.body;

    // Validação Senhas
    if (senha !== confirmaSenha) {
        return res.render('cadastro', { 
            title: 'Cadastro - ElectroStore',
            error: 'As senhas não conferem.', 
            nome: nome, 
            email: email 
        });
    }

    // Validação Usuário já existe
    const usuarioExistente = await Usuario.findOne({ where: { email: email } });
    if (usuarioExistente) {
        return res.render('cadastro', { 
            title: 'Cadastro - ElectroStore',
            error: 'Este e-mail já está cadastrado no sistema.', 
            nome: nome 
        });
    }

    // Criptografar a senha com bcrypt
    const senhaHash = bcrypt.hashSync(senha, 10);

    // Salvar no banco
    await Usuario.create({
        nome: nome,
        email: email,
        senha_hash: senhaHash
    });

    // Redireciona para o login com mensagem
    req.flash('success', 'Cadastro realizado com sucesso! Faça seu login.');
    res.redirect('/login');

  } catch (error) {
     console.error(error);
     res.render('cadastro', { error: 'Erro interno ao realizar o cadastro.' });
  }
});

module.exports = router;
