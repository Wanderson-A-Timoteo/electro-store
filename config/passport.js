const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Usuario } = require('../model/modelos');

// Autenticação
passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'senha' }, // Mapeia os campos do formulário
    async (email, senha, done) => {
        try {
            // Busca o usuário pelo e-mail
            const user = await Usuario.findOne({ where: { email: email } });
            if (!user) {
                return done(null, false, { message: 'Usuário não encontrado.' });
            }

            // Compara a senha digitada com o hash salvo no banco
            const isValid = bcrypt.compareSync(senha, user.senha_hash);
            if (!isValid) {
                return done(null, false, { message: 'Senha incorreta.' });
            }

            // Retorna o usuário
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Salva apenas o ID do usuário na sessão
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// A cada nova requisição, usa o ID da sessão para buscar os dados completos
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Usuario.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
