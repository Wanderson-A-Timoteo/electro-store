module.exports = {
    // Verifica apenas se o usuário está logado
    isAuth: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'Você precisa estar logado para acessar esta página.');
        res.redirect('/login');
    },

    // Verifica se está logado E se é Administrador
    isAdmin: function(req, res, next) {
        if (req.isAuthenticated() && req.user.perfil === 'admin') {
            return next();
        }
        req.flash('error', 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.');
        res.redirect('/');
    },

    // Verifica se está logado E se é Lojista ou Admin
    isLojistaOrAdmin: function(req, res, next) {
        if (req.isAuthenticated() && (req.user.perfil === 'lojista' || req.user.perfil === 'admin')) {
            return next();
        }
        req.flash('error', 'Acesso negado. Funcionalidade restrita a lojistas e administradores.');
        res.redirect('/');
    }
};
