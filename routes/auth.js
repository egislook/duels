var auth = require('../lib/steam/auth.js');

module.exports = {
    '/login': {
        fn: function(req, res){
                if(req.session.user){
                    res.redirect('/');
                }
                else
                    auth.redirect(req, res);
            }
    },
    '/data': {
        fn: function(req, res){
                auth.steam(req, res, '/');
            }
    },
    '/logout': {
        fn: function(req, res){
                req.session.destroy();
                res.redirect('/');
            }
    }
};