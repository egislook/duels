var steam = require('../lib/steam/steam.js');

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
                users[req.session.user.steamid] = {name : data[0].personaname, avatar : data[0].avatarmedium}; 
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

exports.stats = function stats(req, res, callback){
    var id = req.session.user.steamid;
    steam.getFromSteam(id, 'userStats', function(data, count){
        callback(data);
    })
    
}