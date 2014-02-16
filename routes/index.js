var user_model = require('../models/user_model.js');
var tournaments_model = require('../models/tournaments_model.js');


'use strict';
module.exports = {
    '/': function(req, res){
        user_model.user(req, res, function(user){
            tournaments_model.list(req, function(tournaments){
                
                var active = [];
                for(i in tournaments){
                    active.push(tournaments[i].id);
                };
                
                tournaments_model.games(req, function(games){
                    res.render('test', {user : user, tournaments : tournaments, u : req.app.cache.users, r : req.app.cache.stats, g : games});
                },active);
                
            }, false, 'date');
        });
    },
    '/error': function(req, res){
        res.send('please login to the system then try to join tournament <a href="../../login">login</a> or come back to main page <a href="../../">home</a>');        
    },
    '/faq': function(req, res){
        user_model.user(req, res, function(user){
            res.render('faq', {user : user});
        });
    },
    '/all': function(req, res){
        user_model.user(req, res, function(user){
            tournaments_model.list(req, function(tournaments){
                var active = [];
                for(i in tournaments){
                    if(tournaments[i].state == 'final'){
                        active.push(tournaments[i].id);
                    }
                };
                
                tournaments_model.games(req, function(games){
                    res.render('all', {user : user, tournaments : tournaments, u : req.app.cache.users, g : games, r : req.app.cache.stats});
                },active);
            });
        });
    }
};