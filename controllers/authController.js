const bcrypt = require('bcrypt');
const { Usuario } = require('../model/modelos');

exports.exibirLogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Login - ElectroStore' });
};

exports.exibirCadastro = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('cadastro', { title: 'Cadastro - ElectroStore' });
};

exports.processarCadastro = async (req, res) => {
  try {
    const { nome, email, senha, confirmaSenha } = req.body;

    if (senha !== confirmaSenha) {
        return res.render('cadastro', { 
            title: 'Cadastro - ElectroStore', error: 'As senhas não conferem.', nome, email 
        });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email: email } });
    if (usuarioExistente) {
        return res.render('cadastro', { 
            title: 'Cadastro - ElectroStore', error: 'Este e-mail já está cadastrado no sistema.', nome 
        });
    }

    const senhaHash = bcrypt.hashSync(senha, 10);

    await Usuario.create({ nome, email, senha_hash: senhaHash });

    req.flash('success', 'Cadastro realizado com sucesso! Faça seu login.');
    res.redirect('/login');

  } catch (error) {
     console.error(error);
     res.render('cadastro', { error: 'Erro interno ao realizar o cadastro.' });
  }
};

exports.sair = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
};
