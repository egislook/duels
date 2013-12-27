var querystring = require('querystring'),
    request = require('request'),
    mongoDb = require("mongodb"),
    vdf = require("vdf");

var dbOpts = {
    items : 'mongodb://user:collect@ds053778.mongolab.com:53778/items'
}

var apiOpts = {
    key : 'F26D77C26645814EA726350E83E1A243',
    holder : 'http://api.steampowered.com/',
    steamid : '76561198065626987'
}



module.exports.allItems = allItems;
module.exports.collectItems = collectItems;
module.exports.userSteam = userSteam;
module.exports.steamCon = steamCon;
module.exports.test = test;


module.exports.test(){
	console.log('test');
}

function steamCon(name, callback){
	mongoDb.MongoClient.connect(dbOpts[name], function (err, db) {
		if(err)
			console.log(err);
		else{
			console.log('<DB> connected: '+ db.databaseName);
		
			db.collection(name, function(e, collection){
				if(!e)
					console.log('<DB> collection selected');
				else
					callback(collection);
			});		
		}
	});
}

function userSteam(req, res, method, callback){

    if(req.session.steamid){
        //set steam api opts
        apiOpts.steamid = req.session.steamid;
        
        var methods = {
            'userData' : apiOpts.holder +'ISteamUser/GetPlayerSummaries/v0002/?key='+apiOpts.key+'&steamids='+apiOpts.steamid,
            'userFriends' : apiOpts.holder +'ISteamUser/GetFriendList/v0001/?key='+apiOpts.key+'&steamid='+apiOpts.steamid+'&relationship=friend',
            'userInventory' : apiOpts.holder +'IEconItems_570/GetPlayerItems/v0001/?key='+apiOpts.key+'&steamid='+apiOpts.steamid,
            'steamItems' : apiOpts.holder +'IEconItems_570/GetSchema/v0001/?key='+apiOpts.key,
            'steamItems2' : 'http://media.steampowered.com/apps/570/scripts/items/items_game.8a8e57c59ad4dac1a44d48c0fd7d20488054bcdd.txt'
        }
        
        var url = methods[method];
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if(method != 'steamItems2')
                    var data = JSON.parse(body);
                else{
                    var data = vdf.parse(body);
                }
                
                if(method == 'userData')
                    data = data.response.players[0];
                else if(method == 'userFriends')
                    data = data.friendslist.friends;
                else if(method == 'steamItems' || method == 'userInventory')
                    data = data.result.items;
                else
                    data = data.items_game.items;
                    
                var count = data.length;
                callback(data, count);
            }
            else
                res.redirect('/error');
        });
    }
    else
        res.redirect('/');
}

function allItems(req, res, arr, callback){
    mongoDb.MongoClient.connect(dbOpts.items, function (err, db) {
       if(err)
           console.log(err);
       else{
           console.log('[SUCCESS]>DB> connected: '+ db.databaseName);
       
           db.collection("items", function(e, collection){
                console.log('[SUCCESS]>DB>COLLECTION selected');
                //prefab: 'wearable', item_rarity: 'rare'
                
                if(arr){
                    collection.find({defindex: { $in: arr}}).toArray(function(e, data){
                        callback(data);
                    });
                }
                else{
                    collection.find({image_url: { $exists: true}}).toArray(function(e, data){
                        callback(data);
                    });
                }
                
           });
       }
  });
}

//collect all dota 2 items from the public file and api... and write to db
function collectItems(req, res){
    
    var data = [];
    var temp = {};
    var t1, def, t2;
    
    userSteam(req, res, 'steamItems2', function(rarity){
        userSteam(req, res, 'steamItems', function(items){
            mongoDb.MongoClient.connect(dbOpts.items, function (err, db) {
                if(err)
                    console.log(err);
                else{
                    console.log('[SUCCESS]>DB> connected: '+ db.databaseName);
                    
                    db.collection("items", function(e, collection){
                        console.log('[SUCCESS]>DB>COLLECTION selected');
                        
                        for (var i in items) {
                
                            if(items[i]){
                                t1 = items[i];
                                if(t1.defindex){
                                    def = t1.defindex;
                                    
                                    
                                    
                                    if(t1.name)
                                        temp.name = t1.name;
                                    if(def)
                                        temp.defindex = def;
                                    if(t1.image_url)
                                        temp.image_url = t1.image_url;
                                    if(t1.item_set)
                                        temp.item_set = t1.item_set;
                                        
                                    if(rarity[def]){
                                        t2 = rarity[def];
                                        
                                        if(t2.prefab)
                                            temp.prefab = t2.prefab;
                                        if(t2.item_slot)
                                           temp.item_slot = t2.item_slot;
                                        if(t2.item_rarity)
                                            temp.item_rarity = t2.item_rarity;
                                        if(t2.forced_item_quality)
                                            temp.forced_item_quality = t2.forced_item_quality;
                                        if(t2.creation_date)
                                            temp.creation_date = t2.creation_date;
                                        if(t2.bundle)
                                            temp.bundle = t2.bundle;
                                    }
                                    
                                    collection.insert(temp, function(err){
                                        if(err)
                                            console.log(err);
                                        else
                                            console.log('added');
                                    });
                                    
                                    data.push(temp);
                                    /*if(i>50)
                                        break;*/
                                    temp = {};
                                }
                            } 
                        }
                        res.send(data.length); 
                        
                    });
                }
            }); 
        });
        
    });
    
    
}

/**
 * mongoDb
  
 mongoDb.MongoClient.connect(dbOpts.uri, function (err, db) {
       if(err)
           console.log(err);
       else{
           console.log('[SUCCESS]>DB> connected: '+ db.databaseName);
       
           db.collection("items", function(e, collection){
               console.log('[SUCCESS]>DB>COLLECTION selected');
   
           });
       }
  });
   
 * 
 * inventory
 * 
 * http://api.steampowered.com/IEconItems_570/GetPlayerItems/v0001/?key=F26D77C26645814EA726350E83E1A243&steamid=76561198065626987
 * http://steamcommunity.com/profiles/76561198065626987/inventory/json/570/2
 * 
 * all dota cosmetic items
 * http:\/\/media.steampowered.com\/apps\/570\/scripts\/items\/items_game.8a8e57c59ad4dac1a44d48c0fd7d20488054bcdd.txt
 * http://api.steampowered.com/IEconItems_570/GetSchema/v0001/?key=F26D77C26645814EA726350E83E1A243
 * 
 * market
 * http://steamcommunity.com/market/search/render/?query=&start=0&count=10
 */



