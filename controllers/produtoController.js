const { Categoria, Produto } = require('../model/modelos');

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

exports.processarCadastroProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade, status, categoria_id } = req.body;
    const categorias = await Categoria.findAll(); // Caso dê erro e a tela precise ser recarregada

    // Validação Nome
    if (!nome || nome.trim() === '') {
        return res.render('produtoCadastrar', { 
            title: 'Cadastrar Produto - ElectroStore', 
            error: 'Nome é obrigatório.', 
            categorias, ...req.body // Mantém os dados preenchidos
        });
    }

    let precoFormatado = preco ? preco.toString().replace(',', '.') : '0';

    // Validação Preço deve ser positivo
    if (!precoFormatado || parseFloat(precoFormatado) <= 0) {
        return res.render('produtoCadastrar', { 
            title: 'Cadastrar Produto - ElectroStore', 
            error: 'Preço deve ser um número positivo.', 
            categorias, ...req.body 
        });
    }

    // Salvando no Banco de Dados
    await Produto.create({
        nome,
        descricao,
        preco: parseFloat(precoFormatado),
        quantidade: parseInt(quantidade),
        status,
        categoria_id: parseInt(categoria_id),
        usuario_id: req.user.id // Vínculo automático
    });

    req.flash('success', 'Produto cadastrado com sucesso!');
    res.redirect('/');

  } catch (error) {
      console.error(error);
      req.flash('error', 'Erro interno ao cadastrar o produto.');
      res.redirect('/produto/cadastrar');
  }
};
