var express = require('express'),
    routescan = require('express-routescan'),
    steam = require('./lib/steam/steam.js'),
    db = require('./lib/db.js'),
    http = require('http'),
    path = require('path'),
    varYk = require('./lib/varYK.js'),
    app = express();
    

app.enable('strict routing');
app.set('port',  process.env.PORT || 3000);
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

app.cache.loaded = 3;

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

db.con('league', function(dbs){
    
    app.cache.db = dbs;
    
    db.get(app, 'tournaments', function(tournaments){
        app.cache.tournaments = tournaments;
        app.cache.loaded--;
        console.log("LOADED -> "+app.cache.loaded+" tournaments");
        
    });
    
    /*db.get(app, 'games', function(games){
         app.cache.games = games;
    });*/
    
});
app.cache.users = {
    '76561198065626987':{
        name:'Zarna',
        avatar:'http://media.steampowered.com/steamcommunity/public/images/avatars/37/37afbaaaff032a36ad62bc64f28dd5a9ce2b9ab0_medium.jpg',
        key:'123'
    },
    '76561198065634959':{
        name:'Majasqzi',
        avatar:'http://media.steampowered.com/steamcommunity/public/images/avatars/80/80dacf2223aed57b5f950416e78c5414c80bcb6e_medium.jpg',
        key:'321'
    },
    '76561198059273715':{
        name:'Aldona',
        avatar:'http://media.steampowered.com/steamcommunity/public/images/avatars/d5/d5cec4b2cbf13fa4f67822c88e539b1f2eb79202_full.jpg',
        key:'123'
    },
    '76561198107743493':{
        name:'Etas',
        avatar:'http://media.steampowered.com/steamcommunity/public/images/avatars/72/72bb6e5a558c137cff9db2b7953d4504b8f53b18_full.jpg',
        key:'321'
    },
    '76561198074301154':{
        name:'Deefects',
        avatar:'http://media.steampowered.com/steamcommunity/public/images/avatars/57/57ba6cabb3b854e6afdf62827a5a37de6919c83e_full.jpg',
        key:'123'
    },
    '76561198053424482':{
        name:'Siltnamis',
        avatar:'http://media.steampowered.com/steamcommunity/public/images/avatars/2d/2de0a1f4fa3be94f6529be6e9a0174324ba60459_full.jpg',
        key:'321'
    },
    '76561198057469780':{
        name:'Malunas',
        avatar:'http://media.steampowered.com/steamcommunity/public/images/avatars/5d/5db573f28dffaac82bd983a76f01633972019ab0_full.jpg',
        key:'123'
    },
    '76561198024922008':{
        name:'пчела',
        avatar:'http://media.steampowered.com/steamcommunity/public/images/avatars/c5/c5b4a69fbe470dbf286cf2e012cea7eacf9770b1_full.jpg',
        key:'321'
    }
};



app.cache.steamid = {
    'good' : ['76561198065626987'],
    'bad' : ['23849234892349829']
};



//routs


routescan(app);




http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});