var querystring = require('querystring'),
    request = require('request'),
    util = require('util'),
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
module.exports.getFromSteam = getFromSteam;
module.exports.con = con;


function con(dbName, colName, callback){
	mongoDb.MongoClient.connect(dbOpts[dbName], function (err, db) {
		if(err)
			console.log(err);
		else{
			console.log('<DB> connected: '+ db.databaseName);
			db.collection(colName, function(e, collection){
				if(!e){
					console.log('<DB> collection selected');
					callback(collection);
				}
				else
					console.log(e);
			});		
		}
	});
}

function allItems(id, arr, callback){
    mongoDb.MongoClient.connect(dbOpts.items, function (err, db) {
       if(err)
           console.log(err);
       else{
           console.log('[SUCCESS]>DB> connected: '+ db.databaseName);
       
           db.collection("items", function(e, collection){
                console.log('[SUCCESS]>DB>COLLECTION selected');
                //prefab: 'wearable', item_rarity: 'rare'
                
                
                if(arr){
                    collection.find({defindex: { $nin: arr}}).toArray(function(e, data){
                    	
                    	if(data.length<1)
                    		addItems(id, function(data){
                    			callback(data);
                    		});
                    	else
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

function addItems(id, callback){
	/*con(dbOpts.items, 'items', function(collection){
		
	});*/
	
	getFromSteam(id, 'fullUserInventory', function(data, count){
		var temp=[];
		var newData=[];
		var i=0;
		for(var key in data.inv){
			newData[i] = key;
			i++;
		}
		callback(newData);
	});
	
}

var market = {
	"trash" : 'appid:570 rare NOT inscribed NOT Recipe NOT cursed NOT Taunt NOT heroic NOT Treasure NOT set NOT Mega NOT jack NOT announcer NOT artificer NOT cruel',
	"snowGlobe" : 'snow globe NOT foil NOT portable&start=0&count=100',
	"trash2" : ['fables', 'cercus', 'saberhorn', 'countenance', 'megadon', 'aghanim'],
	"market" : 'appid:570',
	"frozen" : 'appid:570 frozen NOT rare NOT legendary',
	"corrupted" : 'appid:570 corrupted NOT runic'
}

function getFromSteam(id, method, callback, page){

	if(!page)
		page = 0;
		
	if(id){
		if(method == 'market' || method == 'marketItem' || method == 'frosen'){
			if(id){
				id = market[id];
			}
			else
				id = '';
		}
		else{
	    	if(util.isArray(id) && method=='userData')
	    		apiOpts.steamid = user.toString(user);
	    	else
	    		apiOpts.steamid = id;
		}
		
        var methods = {
            'userData' : apiOpts.holder +'ISteamUser/GetPlayerSummaries/v0002/?key='+apiOpts.key+'&steamids='+apiOpts.steamid,
            'userFriends' : apiOpts.holder +'ISteamUser/GetFriendList/v0001/?key='+apiOpts.key+'&steamid='+apiOpts.steamid+'&relationship=friend',
            'userInventory' : apiOpts.holder +'IEconItems_570/GetPlayerItems/v0001/?key='+apiOpts.key+'&steamid='+apiOpts.steamid,
            'fullUserInventory' : 'http://steamcommunity.com/profiles/'+apiOpts.steamid+'/inventory/json/570/2',
            'steamItems' : apiOpts.holder +'IEconItems_570/GetSchema/v0001/?key='+apiOpts.key,
            'steamItems2' : 'http://media.steampowered.com/apps/570/scripts/items/items_game.8a8e57c59ad4dac1a44d48c0fd7d20488054bcdd.txt',
            'market' : "http://steamcommunity.com/market/search/render/?query="+id+"&start="+page*100+"&count=100",
            'marketItem' : 'http://steamcommunity.com/market/listings/570/Cercus of Whirling Death/render/?query=&start=0&count=10'
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
                    data = data.response.players;
                else if(method == 'userFriends')
                    data = data.friendslist.friends;
                else if(method == 'steamItems' || method == 'userInventory')
                    data = data.result.items;
                else if(method == 'fullUserInventory'){
                	var temp = {};
                	temp['inv'] = data['rgInventory'];
                	temp['desc'] = data['rgDescriptions'];
                	data = temp;
                }
                else if(method == 'market' || method == 'marketItem'){
                	data = data['results_html'];
                }
                else
                    data = data.items_game.items;
                
                var count = 0;

                if(util.isArray(data))
                	count = data.length;
                	
                callback(data, count);
                
            }
            else
                callback('api', -1)
        });
    }
    else
        callback('login', -1)
}


//----------------------------------------------------------------------------------------------------
//collect all dota 2 items from the public file and api... and write to db
function collectItems(req, res){
    
    var data = [];
    var temp = {};
    var t1, def, t2;
    
    getFromSteam(req, res, 'steamItems2', function(rarity){
        getFromSteam(req, res, 'steamItems', function(items){
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
 * friends
 * http://steamcommunity.com/profiles/76561198065626987/friends?xml=1
 * 
 * market
 * http://steamcommunity.com/market/search/render/?query=&start=0&count=10
 * http://steamcommunity.com/market/listings/570/Cercus of Whirling Death/render/?query=&start=0&count=10
 * 
 * http://steamcommunity.com/market/search/render/?query=appid:570 fables/cercus/saberhorn/Countenance/ NOT inscribed/heroic/cursed&start=0&count=100
 */



