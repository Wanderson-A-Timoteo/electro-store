const { Categoria } = require('../model/modelos');

exports.exibirCadastroProduto = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.render('produtoCadastrar', { 
        title: 'Cadastrar Produto - ElectroStore',
        categorias: categorias
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Erro ao carregar a página de cadastro de produtos.');
    res.redirect('/');
  }
};
