var db = require('../lib/db.js');
var util = require('util');

function tournaments(req, callback, id, state){
    
    state = state || false;
    
    var tournaments = req.app.cache.tournaments;
    var tournament = false;
    var temp = [];
    var data;
    
    if(tournaments.length>0){
        for(var i in tournaments){
            tournaments[i].players = Object.keys(tournaments[i].users.approved).length;
            tournaments[i].joined = Object.keys(tournaments[i].users.joined).length;
            if(state){
                if(state == 'rcf'){
                    if(tournaments[i].class == 'rcf'){
                        temp.push(tournaments[i]);
                        tournament = temp;
                    }
                } else if(state == 'ended'){
                    if(tournaments[i].state == 'ended'){
                        temp.push(tournaments[i]);
                        tournament = temp;
                    }
                } else if(state == 'date'){
                    if(i<9){
                        temp.push(tournaments[i]);
                        tournament = temp;
                    } else {
                        if(tournaments[i].date == tournaments[i-1].date){
                            temp.push(tournaments[i]);
                            tournament = temp;
                        } else {
                            break;
                        }
                    }
                }
            } else if(id){
                if(id==tournaments[i].id){
                    tournament = tournaments[i];
                    break;
                }
            }
            else if(i==tournaments.length-1 && (!id || !state))
                tournament = tournaments;
	    }
	    callback(tournament);
    }
    else
        callback(false);
    
}


module.exports.list = tournaments;
module.exports.dismiss = dismiss;

exports.create = function create(req, tournament, user, callback){
    
    var approved = {};
    var max = tournament.maxplayers;
    
    /*approved = {
                '76561198065626987':{
                    key:'123'
                },
                '76561198065634959':{
                    key:'321'
                },
                '76561198116713607':{
                    key:'123'
                },
                '76561198013303116':{
                    key:'321'
                }
            
        }*/
    
    /*if(max == 2){
        approved = {
                '76561198065626987':{
                    key:'123'
                },
                '76561198065634959':{
                    key:'321'
                }
            
        }
    } else if(max==4){
        approved = {
                '76561198065626987':{
                    key:'123'
                },
                '76561198065634959':{
                    key:'321'
                },
                '76561198059273715':{
                    key:'123'
                },
                '76561198107743493':{
                    key:'321'
                }
            
        }
    } else if(max==8){
        approved = {
                '76561198065626987':{
                    key:'123'
                },
                '76561198065634959':{
                    key:'321'
                },
                '76561198059273715':{
                    key:'123'
                },
                '76561198107743493':{
                    key:'321'
                },
                '76561198074301154':{
                    key:'123'
                },
                '76561198053424482':{
                    key:'321'
                },
                '76561198057469780':{
                    key:'123'
                },
                '76561198024922008':{
                    key:'321'
                }
            
        }
    }*/
    
    tournament.id = new Date().getTime();
    tournament.state = 'join';
    tournament.users = {'joined' : {}, 'approved' : approved};
    tournament.owner = [{'steamid' : user.steamid, name : user.name}];
    tournament.states = {};
    req.app.cache.tournaments.unshift(tournament);
    //add tournament data to db
    db.add(req.app, 'tournaments', tournament, function(data){
        console.log(data);
    });
    callback(tournament.id);
}

exports.remove = function remove(req, id, user, callback){
    tournaments(req, function(tournament){
        if(tournament.length>0){
            for(var i in tournament){
                if(tournament[i].id == id){
                    tournament.splice(i, 1);
                    
                    var query = {id : parseInt(id)};
                    db.remove(req.app, 'tournaments', query, function(data){
                        console.log(data);
                    });
                    query = {"info.tournamentid" : parseInt(id)};
                    db.remove(req.app, 'games', query, function(data){
                        console.log(data);
                    });
                }
    	    }
        }
        callback();
    })
}

exports.join = function join(req, id, user, callback){
    var msg = 'error';
    tournaments(req, function(tournament){
        if(tournament){
            var allow = false;
            
            if(tournament.allow=='beginners'){
                if(req.app.cache.stats[user.steamid]){
                    if(req.app.cache.stats[user.steamid].win<2)
                        allow=true;
                } else {
                    allow=true;
                }
            } else {
                allow=true;
            }
            
            if(allow){
                if(tournament.users.joined[user.steamid] == undefined && tournament.users.approved[user.steamid] == undefined && tournament.state == 'join'){
                    tournament.users.joined[user.steamid] = {key : Math.floor((Math.random()*100000)+1)};
                    //rewrite users data in database
                    var where = {id : parseInt(id)};
                    var query = {$set: {users : tournament.users}}
                    db.update(req.app, 'tournaments', where, query, function(data){
                        console.log(data);
                    });
                    
                    msg = false;
                }
            }
        }
        callback(msg)
    }, id)
}

function dismiss(req, t, id, callback){
    tournaments(req, function(tournament){
        if(tournament && tournament.state == 'join'){
            var changed = false;
            if(tournament.users.joined[id]){
                delete tournament.users.joined[id];
                changed = true;
            } else if(tournament.users.approved[id]){
                tournament.users.joined[id] = tournament.users.approved[id];
                delete tournament.users.approved[id];
                changed = true;
            }
            
            if(changed){
                //rewrite users data in database
                var where = {id : parseInt(t)};
                var query = {$set: {users : tournament.users}}
                db.update(req.app, 'tournaments', where, query, function(data){
                    console.log(data);
                });
            }   
            
            callback();
        }
        else
            callback('error');
    },t);
}

exports.approve = function approve(req, t, id, callback){
    tournaments(req, function(tournament){
        if(tournament && tournament.joined>0){
            tournament.users.approved[id] = tournament.users.joined[id];
            delete tournament.users.joined[id];
            //rewrite users data in database
            var where = {id : parseInt(t)};
            var query = {$set: {users : tournament.users}}
            db.update(req.app, 'tournaments', where, query, function(data){
                console.log(data);
            });
            callback();
        }
        else
            callback('cant get tournament, no joined users');
    },t);
}

function pvp(approved, players, heroes, id, mode, state, tclass){

    tclass = tclass || false;
    var hero1, hero2;
    var duels = [], testgames=[];
    var n1, n2, p1, p2;
    var heroescount = heroes.length-1;
    while(players>0){
        n1 = Math.floor((Math.random()*players-1));
        p1 = approved.splice(n1, 1);
        players--;
        n2 = Math.floor((Math.random()*players-1));
        p2 = approved.splice(n2, 1);
        players--;
        if(mode == 'sh'){
            h1 = Math.floor((Math.random()*heroescount)-1);
            hero1={name: heroes[h1].localized_name, url: (heroes[h1].name).slice(14)};
            hero2=hero1;
        } else if(mode == 'ar'){
            h1 = Math.floor((Math.random()*heroescount)-1);
            hero1={name: heroes[h1].localized_name, url: (heroes[h1].name).slice(14)};
            h2 = Math.floor((Math.random()*heroescount)-1);
            hero2={name: heroes[h2].localized_name, url: (heroes[h2].name).slice(14)};
        } else {
            hero1='false'; hero2='false';
        }
        
        var duelid = (p1+''+p2+''+id+'1');
        var date = new Date();
        var time = date.getHours()+':'+date.getMinutes();
        date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        
        //new way
        var temp = {
            t1 : [{id : p1[0], hero : hero1}],
            t2 : [{id : p2[0], hero : hero2}],
            info : {tournamentid : id, mode : mode, date : date, tournamentstate : state, tournamentclass : tclass, time : time, type : tclass}
        }
        testgames.push(temp);
        
        duels.push({id : duelid});
    }
    
    return {duels : duels, games : testgames};
}

exports.start = function start(req, t, callback){
    var msg = false;
    tournaments(req, function(tournament){
        if(tournament && tournament.state != 'ended'){
            state = false;
            tclass = tournament['class'];
            var players, approved=[];
            var heroes = req.app.cache.heroes;
            
            if(tournament.state != 'join' && tournament.states[tournament.state].endedgames == tournament.states[tournament.state].games){
                players = tournament.states[tournament.state].endedgames;
                for(i in tournament.states[tournament.state].duels){
                    approved.push(tournament.states[tournament.state].duels[i].winner);
                }
            } else {
                if(tournament.class == 'rcf'){
                    players = tournament.players;
                    approved = Object.keys(tournament.users.approved);
                    if(players%2 !== 0){
                        approved.splice(players-1, 1);
                        players = approved.length;
                    }
                } else {
                    players = tournament.players;
                    approved = Object.keys(tournament.users.approved);
                }
            }
            
            if(tournament.state != 'final'){
                if(players == 2 || tclass == 'rcf')
                    state = 'final';
                else if(players == 4){
                    state = 'semifinal';
                } else if(players >= 8){
                    if(tournament.state !== 'join')
                        state = tournament.state+1;
                    else
                        state = 1;
                }
                else
                    msg = 'bad tournament players count';
                
                tournament.states[state] = {};
                var data = pvp(approved, players, heroes, tournament.id, tournament.mode, state, tclass);
                //games = data.games;
                //tournament.states[state].duels = data.duels;
                tournament.state = state;
                tournament.states[state].games = players/2;
                tournament.states[state].endedgames = 0;
                var date = new Date();
                date = date.getHours()+':'+date.getMinutes();
                tournament.states[state].time = date;
                
                db.add(req.app, 'games', data.games, function(ids){
                    duels = [];
                    for(i in ids){
                        duels.push({id : ids[i]});
                    }
                    
                    tournament.states[state].duels = duels;
                    
                    //add states to db
                    var where = {id : parseInt(tournament.id)};
                    var query = {$set: {state : state, states : tournament.states}}
                    db.update(req.app, 'tournaments', where, query, function(data){
                        console.log(data);
                    });
                    
                }, 'id');
                
                
            }
            else if(tournament.state == 'final' && (tournament.states['final'].endedgames == tournament.states['final'].games)) {
                tournament.state = 'ended';
                var date = new Date();
                date = date.getHours()+':'+date.getMinutes();
                tournament.time = date;
                
                if(tournament.states['final'].games > 1){
                    tournament['winners'] = approved;
                    var query = {$set: {state : tournament.state, winners : tournament.winners}};
                }
                else{
                    tournament['winner'] = tournament.states['final'].duels[0].winner;
                    var query = {$set: {state : tournament.state, winner : tournament.winner}};
                }
                
                var where = {id : parseInt(tournament.id)};
                
                db.update(req.app, 'tournaments', where, query, function(data){
                    console.log(data);
                });
            }
            
            callback();
                
        }
        else
            callback('cant get tournament, state is not join, exceeded max players count');
    },t);
}

exports.restart = function restart(req, t, callback){
    var msg = false;
    tournaments(req, function(tournament){
        if(tournament && tournament.state != 'ended' && tournament.states[tournament.state].endedgames<1){
            
            var tclass = tournament['class'];
            var state = tournament.state;
            var approved = []; 
            var heroes = req.app.cache.heroes;
            //var games = req.app.cache.games;
            var states = Object.keys(tournament.states);
            if(states.length>1){
                players = tournament.states[states[states.length-2]].endedgames;
                for(i in tournament.states[states[states.length-2]].duels){
                    approved.push(tournament.states[states[states.length-2]].duels[i].winner);
                }
            } else {
                if(tournament.class == 'rcf'){
                    players = tournament.players;
                    approved = Object.keys(tournament.users.approved);
                    if(players%2 !== 0){
                        approved.splice(players-1, 1);
                        players = approved.length;
                    }
                } else {
                    players = tournament.players;
                    approved = Object.keys(tournament.users.approved);
                }
            }
            
            var data = pvp(approved, players, heroes, tournament.id, tournament.mode, state, tclass);
            console.log(data);
            //games = data.games;
            
            
            //remove from db tournament this state games
            var query = {"info.tournamentid" : parseInt(tournament.id), "info.tournamentstate" : state};
            db.remove(req.app, 'games', query, function(e){
                //add to db new games of the state
                db.add(req.app, 'games', data.games, function(ids){
                    duels = [];
                    for(i in ids){
                        duels.push({id : ids[i]});
                    }
                    var date = new Date();
                    date = date.getHours()+':'+date.getMinutes();
                    tournament.states[state].time = date;
                    
                    tournament.states[state].duels = duels;
                    
                    var str = "states."+state;
                    where = {id : parseInt(tournament.id)};
                    var obj = {};
                    obj[str] = tournament.states[state];
                    query = {$set: obj};
                    db.update(req.app, 'tournaments', where, query, function(data){
                        console.log(data);
                    });
                }, 'id');
            });
            
            callback();
        }
    },t);
}

exports.decide = function decide(req, game, callback){
    var data = req.body;
    var msg = false;
    var stats = req.app.cache.stats;
    
    if(data['win'] == 't1')
        data['lose'] = 't2';
    else
        data['lose'] = 't1';
    
    var id = data['id'];
    var where = {'_id' : db.id(id)};
    var query = {
        $set:{
            "info.win" : data['win'],
            "info.duration" : data['duration'],
            "t1.0.items" : data.t1items,
            "t1.0.lvl" : data['lvl'][0],
            "t1.0.k" : data['k'][0],
            "t1.0.d" : data['d'][0],
            "t1.0.last" : data['last'][0],
            "t1.0.denie" : data['denie'][0],
            "t1.0.gold" : data['gold'][0],
            "t1.0.exp" : data['exp'][0],
            "t2.0.items" : data.t2items,
            "t2.0.lvl" : data['lvl'][1],
            "t2.0.k" : data['k'][1],
            "t2.0.d" : data['d'][1],
            "t2.0.last" : data['last'][1],
            "t2.0.denie" : data['denie'][1],
            "t2.0.gold" : data['gold'][1],
            "t2.0.exp" : data['exp'][1]
        }      
    };
    
    db.update(req.app, 'games', where, query, function(data){
        callback(id);
    });
    
    tournaments(req, function(tournament){
        
       if(tournament.state != 'ended'){
           for(i in tournament.states[game.info['tournamentstate']].duels){
               if(tournament.states[game.info['tournamentstate']].duels[i].id == id){
                    if(!tournament.states[game.info['tournamentstate']].duels[i].winner){
                        tournament.states[game.info['tournamentstate']].endedgames++;
                        //if they was not played this game then add 1 point and 1 lvl
                        if(tournament.class == 'rcf'){
                            
                            if(!stats[game[data['win']][0].id]){
                                stats[game[data['win']][0].id]={win:0, lose:0, games:0, steamid: game[data['win']][0].id}
                                db.add(req.app, 'stats', stats[game[data['win']][0].id], function(data){});
                            }
                            if(!stats[game[data['lose']][0].id]){
                                stats[game[data['lose']][0].id]={win:0, lose:0, games:0, steamid: game[data['lose']][0].id}
                                db.add(req.app, 'stats', stats[game[data['lose']][0].id], function(data){});
                            }
                            
                            stats[game[data['win']][0].id].win++;stats[game[data['win']][0].id].games++;
                            stats[game[data['lose']][0].id].lose++;stats[game[data['lose']][0].id].games++;
                        }
                    } else {
                        //if they was not played this game then add 2 point and 2 lvl
                        if(tournament.class == 'rcf' && game[data['win']][0].id != tournament.states[game.info['tournamentstate']].duels[i].winner){
                            stats[game[data['win']][0].id].win++;stats[game[data['win']][0].id].lose--;
                            stats[game[data['lose']][0].id].win--;stats[game[data['lose']][0].id].lose++;
                        }
                    }
                    tournament.states[game.info['tournamentstate']].duels[i]['winner'] = game[data['win']][0].id;
                    break;
               }
           }
           
            var str = "states."+tournament.state;
            where = {id : parseInt(tournament.id)};
            var obj = {};
            obj[str] = tournament.states[tournament.state];
            query = {$set: obj};
            db.update(req.app, 'tournaments', where, query, function(data){});
            
            db.update(req.app, 'stats', {steamid : game[data['win']][0].id}, {
                "games" : stats[game[data['win']][0].id].games,
                "win" : stats[game[data['win']][0].id].win,
                "lose" : stats[game[data['win']][0].id].lose,
                "steamid" : game[data['win']][0].id
            }, function(data){});
            db.update(req.app, 'stats', {steamid : game[data['lose']][0].id}, {
                "games" : stats[game[data['lose']][0].id].games,
                "win" : stats[game[data['lose']][0].id].win,
                "lose" : stats[game[data['lose']][0].id].lose,
                "steamid" : game[data['lose']][0].id
            }, function(data){});
           
           
       }
    }, game.info.tournamentid);
}
