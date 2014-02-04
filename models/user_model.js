var steam = require('../lib/steam/steam.js');
var db = require('../lib/db.js');

exports.user = function user(req, res, callback){
    var loged = false;
    var status = 'guest';
    if(req.session.user){
        loged = req.session.user.loged;
        status = req.session.user.status;
        var user = check(req, req.session.user.steamid);
        var users = check(req);
        if(user){
            callback({
                loged : loged,
                status : status,
                name : user.name,
                avatar : user.avatar,
                steamid : req.session.user.steamid
            });
        } else {
            steam.getFromSteam(req.session.user.steamid, 'userData', function(data, count){
                users[req.session.user.steamid] = {name : data[0].personaname, avatar : data[0].avatarmedium, steamid : req.session.user.steamid};
                
                db.add(req.app, 'users', users[req.session.user.steamid], function(data){});
                
                callback({
                   loged : loged,
                   status : status,
                   name : data[0].personaname,
                   avatar : data[0].avatarmedium,
                   steamid : data[0].steamid
                });
            });
        }
    } else {
        callback({loged : loged, status : status});
    }
}

function check(req, id){
    var users = req.app.cache.users;
    if(id){
        if(users[id])
            return users[id];
        else
            return false;
    }
    else
        return users;
}

exports.permission = function permission(req, callback, status){
    
}
exports.rank = function rank(req,callback){
    db.get(req.app, 'stats', function(data){
        callback(data);
    });
}

exports.stats = function stats(req, res, callback){
    var id = req.session.user.steamid;
    steam.getFromSteam(id, 'userStats', function(data, count){
        callback(data);
    })
    
}

exports.rate = function rate(req, tournaments, games, callback){
    var users = req.app.cache.users;
    var temp = {};
    var stats = {};
    var players = [];
    for(var i in games){
        temp[i] = {};
        if(games[i].info.win == 't1'){
            if(stats[games[i]['t1'][0].id]){
                stats[games[i]['t1'][0].id].points++; 
            } else {
                stats[games[i]['t1'][0].id] = {};
                stats[games[i]['t1'][0].id]['points'] = 1; 
            }
            
            if(stats[games[i]['t2'][0].id]){
                stats[games[i]['t2'][0].id].points--; 
            } else {
                stats[games[i]['t2'][0].id] = {};
                stats[games[i]['t2'][0].id]['points'] = -1; 
            }
                
            temp[i].win = games[i]['t1'][0].id;
            temp[i].lose = games[i]['t2'][0].id;
        } else {
            if(stats[games[i]['t2'][0].id]){
                stats[games[i]['t2'][0].id].points++; 
            } else {
                stats[games[i]['t2'][0].id] = {};
                stats[games[i]['t2'][0].id]['points'] = 1; 
            }
            
            if(stats[games[i]['t1'][0].id]){
                stats[games[i]['t1'][0].id].points--; 
            } else {
                stats[games[i]['t1'][0].id] = {};
                stats[games[i]['t1'][0].id]['points'] = -1; 
            }
            
            
            
            
            temp[i].win = games[i]['t2'][0].id;
            temp[i].lose = games[i]['t1'][0].id;
        }
    }
    
    for(var i in stats){
        if(stats[i].points>0)
            var lvl = 1+stats[i].points;
        else
            var lvl = 1;
        
        players.push(
            {
                steamid : i,
                points : stats[i].points + 100,
                lvl : lvl
            }
        );
    }
    
    
    
    /*db.add(req.app, 'stats', players, function(data){
        console.log(data);
    });*/
    
    
}