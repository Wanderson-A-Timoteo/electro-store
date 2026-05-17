var express = require('express');
var router = express.Router();
const passport = require('passport');

// Importando os Middlewares de Autorização
const { isAuth, isAdmin } = require('../config/auth'); 

// Importando os Controllers
const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');
const produtoController = require('../controllers/produtoController');

// ==========================================
// ROTAS GERAIS
// ==========================================
router.get('/', indexController.exibirHome);
router.get('/povoamento', indexController.executarPovoamento);

// ==========================================
// ROTAS DE AUTENTICAÇÃO
// ==========================================
router.get('/login', authController.exibirLogin);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/cadastro', authController.exibirCadastro);
router.post('/cadastro', authController.processarCadastro);
router.get('/sair', authController.sair);

// ==========================================
// ROTAS DE PRODUTOS
// ==========================================
router.get('/produto/cadastrar', isAdmin, produtoController.exibirCadastroProduto);
router.post('/produto/cadastrar', isAdmin, produtoController.processarCadastroProduto);
router.get('/produto/editar/:id', isAdmin, produtoController.exibirEditarProduto);
router.post('/produto/editar/:id', isAdmin, produtoController.processarEditarProduto);
router.post('/produto/excluir/:id', isAdmin, produtoController.excluirProduto);

module.exports = router;
