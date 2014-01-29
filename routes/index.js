var user_model = require('../models/user_model.js');
var tournaments_model = require('../models/tournaments_model.js');


'use strict';
module.exports = {
    '/': function(req, res){
        user_model.user(req, res, function(user){
            tournaments_model.list(req, function(tournaments){
                res.render('index', {user : user, tournaments : tournaments});
            });
        });
    },
    '/error': function(req, res){
        res.send('please login to the system then try to join tournament <a href="../../login">login</a> or come back to main page <a href="../../">home</a>');        
    },
    '/faq': function(req, res){
        user_model.user(req, res, function(user){
            res.render('faq', {user : user});
        });
    }   
};