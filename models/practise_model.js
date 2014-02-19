var db = require('../lib/db.js');
var util = require('util');


//module.exports.gameList = gameList;

exports.join = function join(req, user, callback){
    var practise = req.app.cache.practise;
    if(!practise[user.steamid])
        practise[user.steamid] = {};
        
    if(Object.keys(practise).length==2){
        create(req, Object.keys(practise), function(duel){
            db.add(req.app, 'games', duel, function(ids){});
            req.app.cache.practise = {};
            callback();
        })
    } else {
        callback('1 more player');
    }
    
}

module.exports.create = create;

function create(req, approved, callback){
    var duel = pvp(req, approved, 'sh', 'practise');
    callback(duel);
}

exports.leave = function leave(req, user, callback){
    var practise = req.app.cache.practise;
    if(practise[user.steamid])
        delete practise[user.steamid];
    callback();
}

function pvp(req, approved, mode, type){

    var heroes = req.app.cache.heroes;
    
    players = approved.length;
    type = type || false;
    var hero1, hero2;
    var duels = [], games=[];
    var n1, n2, p1, p2;
    while(players>0){
        n1 = Math.floor((Math.random()*players-1));
        p1 = approved.splice(n1, 1);
        players--;
        n2 = Math.floor((Math.random()*players-1));
        p2 = approved.splice(n2, 1);
        players--;
        if(mode == 'sh'){
            h1 = Math.floor((Math.random()*107)-1);
            hero1={name: heroes[h1].localized_name, url: (heroes[h1].name).slice(14)};
            hero2=hero1;
        } else if(mode == 'ar'){
            h1 = Math.floor((Math.random()*107)-1);
            hero1={name: heroes[h1].localized_name, url: (heroes[h1].name).slice(14)};
            h2 = Math.floor((Math.random()*107)-1);
            hero2={name: heroes[h2].localized_name, url: (heroes[h2].name).slice(14)};
        } else {
            hero1='false'; hero2='false';
        }
        
        var date = new Date();
        var time = date.getHours()+':'+date.getMinutes();
        date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        
        
        //new way
        var temp = {
            t1 : [{id : p1[0], hero : hero1}],
            t2 : [{id : p2[0], hero : hero2}],
            info : {mode : mode, date : date, time : time, type : type}
        }
        games.push(temp);
    }
    
    return games;
}