const bcrypt = require('bcrypt');
const { Usuario, Categoria } = require('../model/modelos');

exports.exibirHome = (req, res) => {
  res.render('index', { title: 'ElectroStore' });
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
