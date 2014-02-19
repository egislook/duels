var db = require('../lib/db.js');
var upload = require('../lib/upload.js');
var util = require('util');

function gameList(req, callback, id){
    var games = req.app.cache.games;
    
    if(id){
        if(games[id])
            games = games[id];
        else
            games = false;   
    }
        
	callback(games);
}

module.exports.gameList = gameList;

exports.game = function game(req, g, callback){
    db.get(req.app, 'games', function(game){
        if(game)
            game[0].info['id'] = g;
       callback(game[0]);
    }, {'_id' : db.id(g)});
}

exports.remove = function remove(req, g, callback){
    query = {'_id' : db.id(g), 'info.type' : 'practise'};
    db.remove(req.app, 'games', query, function(data){
        callback();
    });
}

exports.games = function games(req, callback, t, query){
    if(t){
        if(util.isArray(t)){
            var temp=[];
            for(i in t){temp.push({'info.tournamentid':  parseInt(t[i])});};
            var query = { $query: { $or: temp }, $orderby: { "info.date" : -1}};
        } else {
            var query = {'info.tournamentid' : parseInt(t)};
        }
    }
        
    else if(!query)
        query = {};
    
    db.get(req.app, 'games', function(data){
        var games = {};
        for(i in data){
            games[data[i]['_id']] = data[i];
        }
       callback(games); 
    }, query);
}

exports.set = function set(req, g, win, callback){
    var where = {'_id' : db.id(g)};
    var query = {$set:{"info.win" : win}};
    db.update(req.app, 'games', where, query, function(data){
        callback(data);
    });
    
}

exports.gameImgAdd = function gameImgAdd(req, g, steamid, callback){
    
    var msg = 'error';
    var limit = 2;
    /*console.log(req.files);
    callback(false);*/
    if(req.files && (req.files.datafile.type == 'image/jpeg' || req.files.datafile.type == 'image/png')){
        db.get(req.app, 'games', function(game){
            if(game){
                var imgs = [];
                var t1 = game[0].t1[0];
                var t2 = game[0].t2[0];
                
                if(t1.id == steamid && (!t1.imgs || t1.imgs.length<=limit)){
                    
                    upload.upload(req.files.datafile.path, function(data){
                        if(data.link){
                            if(!t1.imgs)
                                imgs.push(data.link);
                            else if(t1.imgs.length<=limit)
                                imgs = t1.imgs; imgs.push(data.link);
                            
                            where = {'_id' : db.id(g)};
                            query = {$set: {"t1.0.imgs": imgs}};
                            db.update(req.app, 'games', where, query, function(data){});
                            callback(false);
                        }
                        else
                            callback(msg);
                    });
                      
                } else if(t2.id == steamid && (!t2.imgs || t2.imgs.length<=limit)){
                    upload.upload(req.files.datafile.path, function(data){
                        if(data.link){
                            
                            if(!t2.imgs)
                                imgs.push(data.link);
                            else if(t2.imgs.length<=limit)
                                imgs = t2.imgs; imgs.push(data.link);
                            
                            where = {'_id' : db.id(g)};
                            query = {$set: {"t2.0.imgs": imgs}};
                            db.update(req.app, 'games', where, query, function(data){});
                            callback(false);
                        }
                        else
                            callback(msg);
                    });
                } else
                    callback(msg);
            }
            else
                callback(msg)
        }, {'_id' : db.id(g)});
    } else
        callback(msg);
}