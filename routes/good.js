var user_model = require('../models/user_model.js');
var tournaments_model = require('../models/tournaments_model.js');

'use strict';
module.exports = {
    '/d/:data': function(req, res){
        
        var data = req.params.data;
        if(data == 't' && req.app.cache.tournaments.length>0)
            res.send(req.app.cache.tournaments);
        else if(data == 'd' && req.app.cache.tournaments.length>0 && req.app.cache.tournaments[0].duels)
            res.send(req.app.cache.tournaments[0].duels);
        else if(data == 'g' && req.app.cache.games)
            res.send(req.app.cache.games);
        else if(data == 'l'){
            req.session.user = {
                'loged' : true,
                'steamid' : '76561198065634959',
                'status' : 'neutral'
            };
            res.redirect('/');
        }
        else if(data == 'u' && req.session.user){
            user_model.user(req, res, function(user){
               res.send(user);
            });
        }
        else
            res.send('there is no data to display');
    },
    '/create': function(req, res){
        req.session.user = {
            'loged' : true,
            'steamid' : '76561198065626987',
            'status' : 'good'
        };
        
        console.log(Math.floor((Math.random()*2))+1);
        
        user_model.user(req, res, function(user){
            if(user.status === 'good' && user.loged === true)
                res.render('create', {user : user});
            else
                res.redirect('/error');
        });
    },
    '/submit': {
        methods: ['post'],
        fn: function(req, res){
            user_model.user(req, res, function(user){
                if(user.status === 'good' && user.loged === true){
                    tournaments_model.create(req, req.body, user, function(id){
                        res.redirect('/t/'+id);
                    })
                }
                else
                    res.redirect('/error');
            });
        }
    },
    '/remove/:id': function(req, res){
        user_model.user(req, res, function(user){
            if(user.status === 'good' && user.loged === true){
                if(req.params.id){
                    tournaments_model.remove(req, req.params.id, user, function(){
                        res.redirect('/');
                    })
                }
                else
                    res.redirect('/error');
            }
            else
                res.redirect('/error');
        });
    },
    '/dismiss/:t/:id': function(req, res){
        user_model.user(req, res, function(user){
            if(user.status === 'good' && user.loged === true){
                if(req.params.t && req.params.id){
                    tournaments_model.dismiss(req, req.params.t, req.params.id, function(e){
                        if(e)
                            res.redirect('/error');
                        else
                            res.redirect('/t/'+req.params.t);
                    });
                }
                else
                    res.redirect('/error');
            }
            else
                res.redirect('/error');
        })
    },
    '/approve/:t/:id': function(req, res){
        user_model.user(req, res, function(user){
            if(user.status === 'good' && user.loged === true){
                if(req.params.t && req.params.id){
                    tournaments_model.approve(req, req.params.t, req.params.id, function(e){
                        if(e)
                            res.redirect('/error');
                        else
                            res.redirect('/t/'+req.params.t);
                    });
                }
                else
                    res.redirect('/error');
            }
            else
                res.redirect('/error');
        })
    },
    '/start/:t': function(req, res){
        user_model.user(req, res, function(user){
            if(user.status === 'good' && user.loged === true){
                if(req.params.t){
                    tournaments_model.start(req, req.params.t, function(e){
                        res.redirect('/t/'+req.params.t);
                        //res.send(e);
                    });
                }
                else
                    res.redirect('/error');
            }
            else
                res.redirect('/error');
        })
    },
    '/restart/:t': function(req, res){
        user_model.user(req, res, function(user){
            if(user.status === 'good' && user.loged === true){
                if(req.params.t){
                    tournaments_model.restart(req, req.params.t, function(e){
                        res.redirect('/t/'+req.params.t);
                        //res.send(e);
                    });
                }
                else
                    res.redirect('/error');
            }
            else
                res.redirect('/error');
        })
    },
    '/decide': {
        methods: ['post'],
        fn: function(req, res){
            user_model.user(req, res, function(user){
                if(user.status === 'good' && user.loged === true){
                    if(req.body){
                        tournaments_model.game(req, req.body.id, function(games){
                            if(games){
                                tournaments_model.decide(req, games, function(game){
                                    res.redirect('/g/'+game);
                                });
                            }
                            else
                                res.redirect('/error');
                        });
                        
                    }
                    else
                        res.redirect('/error');
                }
                else
                    res.redirect('/error');
            })
        }
    }
};