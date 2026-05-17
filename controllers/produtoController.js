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

exports.exibirEditarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) {
        req.flash('error', 'Produto não encontrado.');
        return res.redirect('/');
    }
    const categorias = await Categoria.findAll();
    res.render('produtoEditar', { 
        title: 'Editar Produto - ElectroStore',
        produto: produto,
        categorias: categorias
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Erro ao carregar a página de edição.');
    res.redirect('/');
  }
};

exports.processarEditarProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade, status, categoria_id } = req.body;
    let precoFormatado = preco ? preco.toString().replace(',', '.') : '0';

    // Validações
    if (!nome || nome.trim() === '' || !precoFormatado || parseFloat(precoFormatado) <= 0) {
        req.flash('error', 'Nome é obrigatório e Preço deve ser positivo.');
        return res.redirect(`/produto/editar/${req.params.id}`);
    }

    // Atualiza no Banco de Dados
    await Produto.update({
        nome,
        descricao,
        preco: parseFloat(precoFormatado),
        quantidade: parseInt(quantidade),
        status,
        categoria_id: parseInt(categoria_id)
    }, { 
        where: { id: req.params.id } 
    });

    req.flash('success', 'Produto atualizado com sucesso!');
    res.redirect('/');

  } catch (error) {
      console.error(error);
      req.flash('error', 'Erro interno ao atualizar o produto.');
      res.redirect('/');
  }
};

exports.excluirProduto = async (req, res) => {
  try {
    await Produto.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Produto excluído com sucesso!');
    res.redirect('/');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Erro ao excluir produto.');
    res.redirect('/');
  }
};
