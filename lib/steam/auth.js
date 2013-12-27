var querystring = require('querystring'),
    request = require('request');

var authOpts = {
    url: 'https://steamcommunity.com/openid/login?',
    openid:{
        'openid.return_to' : 'http://gogobaby.herokuapp.com/data',
        'openid.realm' : 'http://gogobaby.herokuapp.com/',
        'openid.ns' : 'http://specs.openid.net/auth/2.0',
        'openid.mode' : 'checkid_setup',
        'openid.identity' : 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id' : 'http://specs.openid.net/auth/2.0/identifier_select'
    }
}

function redirectSteam(res){
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
                    req.session.steamid = id;
                    
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

module.exports.redirect = redirectSteam;
module.exports.steam = authenticateSteam;