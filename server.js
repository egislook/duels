var express = require('express'),
    routescan = require('express-routescan'),
    steam = require('./lib/steam/steam.js'),
    db = require('./lib/db.js'),
    http = require('http'),
    path = require('path'),
    varYk = require('./lib/varYK.js'),
    app = express();

var dbname = 'league';

app.enable('strict routing');
app.set('port',  process.env.PORT || 3001);
app.set('ip',  process.env.IP || "0.0.0.0");
app.set('view engine', 'dot');
app.engine('dot', require('express-dot').__express);
//app.use(express.methodOverride());
app.use(express.bodyParser());

app.use(express.cookieParser());
app.use(express.session({ secret: 'whatever'}));

app.use('/js' , express.static(path.join(process.cwd(), '/public/js')));
app.use('/css' , express.static(path.join(process.cwd(), '/public/css')));
app.use('/img' , express.static(path.join(process.cwd(), '/public/img')));
app.use(app.router);

app.cache.loaded = 5;

app.cache.steamid = {
    'good' : ['76561198065626987', '76561198065634959'],
    'bad' : ['76561198047101614'],
    'support' : ['76561198013303116', '76561198074301154']
};

steam.getLightFromSteam('heroes', function(data){
    app.cache.heroes = data;
    app.cache.loaded--;
    console.log("LOADED -> "+app.cache.loaded+" heroes");
    //http://media.steampowered.com/apps/dota2/images/heroes/elder_titan_sb.png
});
steam.getLightFromSteam('items', function(data){
    //console.log('items '+data);
    app.cache.items = data;
    app.cache.loaded--;
    console.log("LOADED -> "+app.cache.loaded+" items");
    //http://media.steampowered.com/apps/dota2/images/items/ring_of_protection_lg.png
});

db.con(dbname, function(dbs){
    
    app.cache.db = dbs;
    
    db.get(app, 'tournaments', function(tournaments){
        app.cache.tournaments = tournaments;
        app.cache.loaded--;
        console.log("LOADED -> "+app.cache.loaded+" tournaments");
    }, { $query: {}, $orderby: { date : -1 , time : 1}});
    
    db.get(app, 'users', function(users){
        
        var temp = {};
        for(var i in users){
            temp[users[i].steamid] = users[i];
        }
        
        app.cache.users = temp;
        app.cache.loaded--;
        console.log("LOADED -> "+app.cache.loaded+" users");
    });
    
    db.get(app, 'stats', function(stats){
        var temp = {};
        for(var i in stats){
            temp[stats[i].steamid] = stats[i];
        }
        
        app.cache.stats = temp;
        app.cache.loaded--;
        console.log("LOADED -> "+app.cache.loaded+" stats");
    }, { $query: {steamid: {$ne: app.cache.steamid.bad[0]}}, $orderby: {win : -1, games : -1, lose : 1}});
    
});





//routs


routescan(app);




http.createServer(app).listen(app.get('port'),app.get('ip'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});