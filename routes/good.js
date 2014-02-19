var user_model = require('../models/user_model.js');
var tournaments_model = require('../models/tournaments_model.js');
var games_model = require('../models/games_model.js');
var stats_model = require('../models/stats_model.js');

'use strict';
module.exports = {
    '/rate' : function(req, res){
        user_model.user(req, res, function(user){
            if(user.status === 'good' && user.loged === true){
                tournaments_model.list(req, function(tournaments){
                    games_model.games(req, function(games){
                        stats_model.stats(req, tournaments, games, function(data){
                            res.redirect('/');
                        });
                    }, false, {'info.tournamentclass' : 'rcf'});
                }, false, 'ended');
            } else {
                res.redirect('/error');
            }
        });
    },
    '/players': function(req, res){
        user_model.user(req, res, function(user){
            if(user.loged === true && (user.status === 'good' || user.status==='support')){
                res.render('players', {user : user, u : req.app.cache.users, r : req.app.cache.stats});
            } else {
                res.redirect('/error');
            }
        });
    },
    '/create': function(req, res){
        /*req.session.user = {
            'loged' : true,
            'steamid' : '76561198065626987'
        };*/
        
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
    '/g/:g/remove' : function(req,res){
        user_model.user(req, res, function(user){
            if(user.status === 'good' && user.loged === true){
                if(req.params.g){
                    games_model.remove(req, req.params.g, function(e){
                        res.redirect('/');
                    });
                }
                else
                    res.redirect('/error');
            }
            else
                res.redirect('/');
        })
    },
    '/g/:g/set/:win' : function(req,res){
        user_model.user(req, res, function(user){
            if(user.status === 'good' && user.loged === true){
                if(req.params.g && req.params.win){
                    games_model.set(req, req.params.g, req.params.win, function(e){
                        //res.send(e);
                        res.redirect('/g/'+req.params.g);
                    });
                }
                else
                    res.redirect('/error');
            }
            else
                res.redirect('/');
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
                        games_model.game(req, req.body.id, function(games){
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