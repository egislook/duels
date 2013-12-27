var express = require('express'),
    http = require('http'),
    path = require('path'),
    steam = require('./lib/steam/steam.js'),
    auth = require('./lib/steam/auth.js'),
    cheerio = require('cheerio'),
    app = express();
    

var curency = { '$': 0.745};

app.enable('strict routing');



app.set('port', 3000);
app.set('view engine', 'dot');
app.engine('dot', require('express-dot').__express);
//app.use(express.methodOverride());
app.set(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'whatever'}));

app.use('/js' , express.static(path.join(process.cwd(), '/public/js')));
app.use('/css' , express.static(path.join(process.cwd(), '/public/css')));
app.use(app.router);




//routs

app.get('/', function(req, res){
	
	req.session.steamid = '76561198065626987';
	
    if(req.session.steamid){
        res.render('index', { steamid : req.session.steamid});
    }  
    else
        res.send('Please login to the system <a href="/login">login</a>');
        
    //res.send('User steam id: '+req.session.steamid+' <a href="/logout">logout</a>');

});

app.get('/scan/?(:page)?', function(req, res){
	req.session.steamid = '76561198065626987';
	
	steam.getFromSteam('trash', 'market', function(market){
		
		var $ = cheerio.load(market);
		var items = [];
		var temp = {};
		var price = '';
		
		$("a").each(function(i, elem) {
			temp['href'] = $(this).attr('href').split('?')[0];
  			temp['img'] = $(this).find('img').attr("src");
  			temp['name'] = $(this).find('span.market_listing_item_name').text();
  			//temp['count'] = $(this).find('span.market_listing_num_listings_qty').text();
  			var price = ($(this).find('div.market_listing_num_listings').text()).split('$')[1].replace(/(\r\n\t|\n|\r|\t)/gm,"");
  			temp['price'] = Math.floor((price * curency['$']) * 100) / 100;
  			items.push(temp);
  			temp={};
		});
		
		var newItems = items.sort(function(a, b){
			return a.price-b.price;
		});
		
		res.render('scan', { items : newItems, page : req.params.page, limit : '10'});
		//res.send(market);
	}, req.params.page);
});

app.get('/market/(:method)/(:page)', function(req, res){
	req.session.steamid = '76561198065626987';
	
	console.log(req.params.page);
	if(!req.params.method)
		var method = 'market';
	else
		var method = req.params.method;
		
	steam.getFromSteam(method, 'market', function(market){
		
		var $ = cheerio.load(market);
		var items = [];
		var temp = {};
		var price = '';
		
		$("a").each(function(i, elem) {
			price = ($(this).find('div.market_listing_num_listings').text()).split('$')[1].replace(/(\r\n\t|\n|\r|\t)/gm,"");
			
			temp['href'] = $(this).attr('href').split('?')[0];
  			temp['img'] = $(this).find('img').attr("src");
  			var count = ($(this).find('span.market_listing_num_listings_qty').text()).split(',');
  			temp['name'] = $(this).find('span.market_listing_item_name').text();
  			temp['count'] = count[0]+''+count[1];
  			price = Math.floor((price * curency['$']) * 100) / 100;
  			temp['price'] = price;
  			items.push(temp);
  			temp={};
		});
		
		var newItems = items.sort(function(a, b){
			return a.price-b.price;
		});
		
		res.render('market', { items : newItems, method : method});
		//res.send(market);
	}, req.params.page);
});

app.get('/user/?(:id)?', function(req, res){
    
    req.session.steamid = '76561198065626987';
    
    if(req.session.steamid){
        steam.getFromSteam(req, res, 'userData', function(userData){
			friends(req, res, function(userFriends){
				inventory(req, res, function(inventory, count, userInventory){
    				res.render('user', { user : userData[0] , friends : userFriends, inventory : inventory, count : count, temp : userInventory});
    				//res.send(inv);
    			}, req.params.id);
			});
        });
        
    }  
    else
        res.send('Please login to the system <a href="/login">login</a>');
});



app.get('/f', function(req, res){
	req.session.steamid = '76561198065626987';
	
	/*friends(req, res, function(userFriends){
		res.send(userFriends);
	});*/
	
	steam.getFromSteam(req, res, 'userFriends', function(friendList){
		res.send(friendList);
	});
	
});

app.get('/c', function(req, res){
    req.session.steamid = '76561198065626987';
    
    steam.getFromSteam(req.session.steamid, 'fullUserInventory', function(data, count){
		res.send(data);
    });
});

app.get('/i', function(req, res){
    req.session.steamid = '76561198065626987';
    var id = req.session.steamid;
    inventory(id, function(data, count){
    	console.log(count);
    	res.send(data);
    });
    
});

app.get('/t', function(req, res){
	req.session.steamid = '76561198065626987';
	steam.getFromSteam(req.session.steamid, 'userInventory', function(inv){
		res.send(inv);
    });
});
    

app.get('/login', function(req, res){
    if(req.session.steamid)
        res.redirect('/');
    else
        auth.redirect(res);
});

app.get('/data', function(req, res) {
    
    auth.steam(req, res, '/');
    
});

app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});
 
function friends(req, res, callback){
	steam.getFromSteam(req, res, 'userFriends', function(friendList){
		
		var friendListnew = friendList.sort(function(a, b){
			return -a.friend_since+b.friend_since;
		});
		
		var friends = [];
		for(var i in friendListnew){
			friends[i] = friendList[i].steamid;
		}
		
		steam.getFromSteam(req, res, 'userData', function(data){
		
			var newData = [];
			for(var i in friends){
				for(var u in data){
					if(friends[i] == data[u].steamid){
						newData[i] = data[u];
					}
				}
			}
			
			callback(newData);
		}, friends);
    });
}

function inventory(id, callback){
	steam.getFromSteam(id, 'userInventory', function(userInventory, itemCount){
		
        if(itemCount != -1){
	        var arr = [];
	        var count = {};
	        var defindex = 0;
	        for(var i in userInventory){
	        	defindex = userInventory[i].defindex;
	            arr[i] = defindex;
	            count[defindex] = count[defindex] ? count[defindex]+1 : 1;
	        }
	        
	        count['all'] = itemCount;
	        steam.allItems(id, arr, function(data){
	        	callback(data, count);
	        });
        }
        else
        	callback(userInventory, itemCount);
    }, id);
}

/*function inventory(id, callback){
	steam.getFromSteam(id, 'userInventory', function(userInventory, itemCount){
        
        if(itemCount !== -1){
	        var arr = [];
	        var count = {};
	        var defindex = 0;
	        for(var i in userInventory){
	        	defindex = userInventory[i].defindex;
	            arr[i] = defindex;
	            count[defindex] = count[defindex] ? count[defindex]+1 : 1;
	        }
	        
	        count['all'] = itemCount;
	        steam.allItems(arr, function(data){
	        	callback(data, count);
	        });
        }
        else
        	callback(userInventory, itemCount);
    }, id);
}*/

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});