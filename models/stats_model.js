var db = require('../lib/db.js');

exports.stats = function stats(req, tournaments, games, callback){
    var users = req.app.cache.users;
    var stats = {};
    var players = [];
    var t1, t2;
    
    for(var i in games){
        t1=games[i]['t1'][0].id;
        t2=games[i]['t2'][0].id;
        if(!stats[t1]){ stats[t1] = {win:0,lose:0,games:0};}
        if(!stats[t2]){ stats[t2] = {win:0,lose:0,games:0};}
        stats[t1].games++;
        stats[t2].games++;
        if(games[i].info.win == 't1'){ stats[t1].win++; stats[t2].lose++;}
        else if(games[i].info.win == 't2'){ stats[t2].win++; stats[t1].lose++;}
    }
    
    for(var i in stats){
        players.push(
            {
                steamid : i,
                win : stats[i].win,
                lose : stats[i].lose,
                games : stats[i].games
            }
        );
    }
    
    db.remove(req.app, 'stats', {}, function(){
        db.add(req.app, 'stats', players, function(data){
            console.log(data);
            db.get(req.app, 'stats', function(stats){
                var temp = {};
                for(var i in stats){
                    temp[stats[i].steamid] = stats[i];
                }
                
                req.app.cache.stats = temp;
            }, { $query: {steamid: {$ne: req.app.cache.steamid.bad[0]}}, $orderby: {win : -1, games : -1, lose : 1}});
            callback();
        });
    });
    
    
}