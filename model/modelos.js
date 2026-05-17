const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./bancoSql');

// ==========================================
// MODELO CATEGORIA
// ==========================================
class Categoria extends Model {}
Categoria.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false }
}, {
    sequelize,
    freezeTableName: true,
    tableName: 'categorias',
    createdAt: 'criado_em',      
    updatedAt: 'atualizado_em'   
});

// ==========================================
// MODELO USUARIO
// ==========================================
class Usuario extends Model {}
Usuario.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha_hash: { type: DataTypes.STRING, allowNull: false },
    perfil: { 
        type: DataTypes.ENUM('usuario', 'admin', 'lojista'), 
        allowNull: false,
        defaultValue: 'usuario' 
    }
}, {
    sequelize,
    freezeTableName: true,
    tableName: 'usuarios',
    createdAt: 'criado_em',      
    updatedAt: 'atualizado_em'   
});

// ==========================================
// MODELO PRODUTO
// ==========================================
class Produto extends Model {}
Produto.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    preco: { type: DataTypes.FLOAT, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    status: { 
        type: DataTypes.ENUM('ativo', 'inativo'), 
        allowNull: false,
        defaultValue: 'ativo'
    }
    // As chaves estrangeiras (categoria_id e usuario_id) são criadas automaticamente pelos relacionamentos abaixo
}, {
    sequelize,
    freezeTableName: true,
    tableName: 'produtos',
    createdAt: 'criado_em',      
    updatedAt: 'atualizado_em'   
});

// ==========================================
// RELACIONAMENTOS (Obrigatórios)
// ==========================================

Categoria.hasMany(Produto, { foreignKey: { name: 'categoria_id', allowNull: false } });
Produto.belongsTo(Categoria, { foreignKey: { name: 'categoria_id', allowNull: false } });

Usuario.hasMany(Produto, { foreignKey: { name: 'usuario_id', allowNull: false } });
Produto.belongsTo(Usuario, { foreignKey: { name: 'usuario_id', allowNull: false } });

// ==========================================
// SINCRONIZAÇÃO
// ==========================================
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Tabelas (Categorias, Usuarios, Produtos) sincronizadas com sucesso.');
    })
    .catch((error) => {
        console.error('Erro ao sincronizar tabelas:', error);
    });

module.exports = { Categoria, Usuario, Produto, sequelize };
