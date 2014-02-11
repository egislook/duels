var user_model = require('../models/user_model.js');
var tournaments_model = require('../models/tournaments_model.js');

'use strict';
module.exports = {
    /*'/rate' : function(req, res){
        tournaments_model.list(req, function(tournaments){
            tournaments_model.games(req, function(games){
                user_model.stats(req, tournaments, games, function(data){
                   res.send(data);
                });
            }, false, {'info.tournamentclass' : 'rcf'});
        }, false, 'ended');
        
    },*/
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