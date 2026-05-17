const bcrypt = require('bcrypt');
const { Usuario, Categoria, Produto } = require('../model/modelos');

exports.exibirHome = async (req, res) => {
  try {
    // Busca só traz produtos ativos
    let condicaoBusca = { status: 'ativo' };

    // Se estiver logado E for admin ou lojista, a busca traz tudo
    if (req.isAuthenticated() && (req.user.perfil === 'admin' || req.user.perfil === 'lojista')) {
      condicaoBusca = {}; 
    }

    // Buscando no banco com a regra aplicada e incluindo o nome da Categoria
    const produtos = await Produto.findAll({
      where: condicaoBusca,
      include: [{ model: Categoria }], 
      order: [['criado_em', 'DESC']] // Mostra os cadastros mais novos primeiro
    });

    // Variável booleana para mostrar os botões de Editar/Excluir na View
    const isAdmin = req.isAuthenticated() && req.user.perfil === 'admin';

    res.render('index', { 
        title: 'ElectroStore', 
        produtos: produtos,
        isAdmin: isAdmin // Permissão enviada para o Handlebars
    });

  } catch (error) {
    console.error(error);
    req.flash('error', 'Erro ao carregar a lista de produtos.');
    res.render('index', { title: 'ElectroStore', error: req.flash('error') });
  }
};

exports.executarPovoamento = async (req, res) => {
  try {
    await Categoria.bulkCreate([
      { nome: 'Notebooks' },
      { nome: 'Smartphones' },
      { nome: 'Acessórios' }
    ], { ignoreDuplicates: true });

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
};
