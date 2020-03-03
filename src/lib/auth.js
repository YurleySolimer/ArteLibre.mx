module.exports = {
    isLoggedIn (req, res, next) {  
        if (req.isAuthenticated()) {  //true si la sesión del usuario existe
            return next();
        }
        return res.redirect('/signin');
    },

    isNotLoggedIn (req, res, next) { 
        if (!req.isAuthenticated()) {  
            return next();
        }
        return res.redirect('/dashboard');
    }
};