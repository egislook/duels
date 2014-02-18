var user_model = require('../models/user_model.js');
var tournaments_model = require('../models/tournaments_model.js');


'use strict';
module.exports = {
    '/join/?(:id)?': function(req, res){
        user_model.user(req, res, function(user){
            if(user.loged === true){
                if(req.params.id){
                    tournaments_model.join(req, req.params.id, user, function(msg){
                        if(!msg)
                            res.redirect('/t/'+req.params.id);
                        else
                            res.redirect('/error');
                    });
                }
                else
                    res.render('enabling', {user : user});
            }
            else
                res.send('please login to the system then try to join tournament <a href="/../login">login</a> or come back to main page <a href="./">home</a>');
        });
    },
    '/confirm/:id': function(req,res){
          user_model.user(req, res, function(user){
            if(user.loged === true){
                if(req.params.id){
                    tournaments_model.list(req, function(tournament){
                        if(tournament){
                            if(tournament.users.joined[user.steamid] && tournament.allow == 'beginners'){
                                tournaments_model.approve(req, tournament.id, user.steamid, function(e){
                                    if(e)
                                        res.redirect('/error');
                                    else
                                        res.redirect('/t/'+tournament.id);
                                });
                            } else {
                                res.redirect('/error');
                            }
                        } else {
                            res.redirect('/error');
                        }
                    }, req.params.id);
                }
                else
                    res.render('enabling', {user : user});
            }
            else
                res.send('please login to the system then try to join tournament <a href="/../login">login</a> or come back to main page <a href="./">home</a>');
        });
    },
    '/t/:id': function(req, res){
        user_model.user(req, res, function(user){
            tournaments_model.list(req, function(tournament){
                tournaments_model.games(req, function(games){
                    if(tournament)
                        res.render('tournament', {user : user, t : tournament, g : games, u : req.app.cache.users});
                    else
                        res.redirect('/error');
                },tournament.id);
            }, req.params.id);
        });
    },
    '/g/:g': function(req, res){
        user_model.user(req, res, function(user){
            if(req.params.g){
                tournaments_model.game(req, req.params.g, function(game){
                    if(game)
                        res.render('game', {user : user, g : game, u : req.app.cache.users, gameid : req.params.g, i : req.app.cache.items});
                    else
                        res.redirect('/error');
                    //res.send(game);
                    
                });
            }
            else
                res.redirect('/error');
        
        })
    },
    '/p/?(:id)?': function(req, res){
        /*user_model.user(req, res, function(user){
            user_model.stats(req, res, function(data, count){
                res.send(data);
            });
        });*/
        res.send('this page is not ready yet....');
    },
    '/upload/:g':{
        methods: ['post', 'get'],
        fn: function(req, res){
            user_model.user(req, res, function(user){
                if(user.loged === true){
                    
                    tournaments_model.gameImgAdd(req, req.params.g, user.steamid, function(e){
                        if(!e)
                            res.redirect('/g/'+req.params.g);
                        else
                            res.redirect('/error');
                    });
                } else
                res.redirect('/error');
            });
        }
        
    }
};