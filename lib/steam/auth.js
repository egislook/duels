var querystring = require('querystring'),
    request = require('request');

var authOpts = {
    url: 'https://steamcommunity.com/openid/login?',
    openid:{
        'openid.return_to' : 'https://league-c9-noneede.c9.io/data',
        'openid.realm' : 'https://league-c9-noneede.c9.io/',
        'openid.ns' : 'http://specs.openid.net/auth/2.0',
        'openid.mode' : 'checkid_setup',
        'openid.identity' : 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id' : 'http://specs.openid.net/auth/2.0/identifier_select'
    }
}

function redirectSteam(req, res){
	var url = req.protocol + "://" + req.get('host');
	if(url.indexOf("rhcloud.com") != -1)
	    url = "https://league-c9-noneede.c9.io";
	    
	
	authOpts.openid['openid.return_to'] = url+'/data';
	authOpts.openid['openid.realm'] = url;
    res.redirect(authOpts.url+querystring.stringify(authOpts.openid));
}

function authenticateSteam(req, res, red){
    var data = req.query;
    if(data['openid.mode']){
        data['openid.mode'] = 'check_authentication';
        
        var string = querystring.stringify(data);
        var url = authOpts.url+string;
        
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                
                if(body.indexOf("is_valid:true") != -1){
                    var id = data['openid.identity'].toString().substr(-17, 17);
                    var status = checkStatus(req, res, id);
                    req.session.user = {
                        'loged' : true,
                        'steamid' : id,
                        'status' : status
                    };
                    
                	res.send(body);
                	res.redirect(red);
                }
                else
                	res.redirect('/error');
                
            }
            else
                res.redirect('/error');
        });
    }
    else
    	res.send('no data set');
}

function checkStatus(req, res, id){
    var status = 'blocked';
    var steamidList = req.app.cache.steamid;
    if(id){
        status = 'neutral';
        if(steamidList.good){
            for(var i in steamidList.good){
        		if(steamidList.good[i] == id){
        		    status='good';
        		}
        	}
        }
    	return status;
    }
    else
        return status;
}

module.exports.redirect = redirectSteam;
module.exports.steam = authenticateSteam;