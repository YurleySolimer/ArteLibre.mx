const pool = require('../database'); 

module.exports = {
    isLoggedIn (req, res, next) {  
        if (req.isAuthenticated()) {  //true si la sesión del usuario existe
            return next();
        }
        return res.redirect('/iniciar-sesion');
    },
    async isCliente (req, res, next) {  
        var user = await  pool.query('SELECT * FROM users WHERE id =?', req.user.id);
        if (user[0].tipo == 'Cliente') {  
            return next();
        }
        return res.redirect('/');
    },
    async isArtista (req, res, next) {  
        var user = await  pool.query('SELECT * FROM users WHERE id =?', req.user.id);
        if (user[0].tipo == 'Artista') {  
            return next();
        }
        return res.redirect('/');
    },

    isNotLoggedIn (req, res, next) { 
        if (!req.isAuthenticated()) {  
            return next();
        }
        return res.redirect('/');
    }
};