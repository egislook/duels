var request = require('request');
var session = '07dbb9cf467271a23c0b1742bb0de85be3a28af3541d8c9e7906b32dd45fb8177701a2a7bece26a4950217c05d22a156a675db6ef08b886dbbeeff678f2d5dac';
var form = require('form-data');
var fs = require('fs');

var api = {
    'session' : 'https://share-img.appspot.com/api?create_session=true',
    'public' : 'https://share-img.appspot.com/api?set_security=public&session='+session,
    'url' : 'https://share-img.appspot.com/api?create_uploadurl='+session,
    'id' : 'https://share-img.appspot.com/api?get_imageid='
};

module.exports.generateUrl = generateUrl;
module.exports.upload = upload;
module.exports.get = get;




function generateUrl(callback){
    request(api.session, function (error, response, body) {
        session = body;
        if (!error && response.statusCode == 200){
            request(api.public, function (error, response, body) {
                if (!error && response.statusCode == 200){
                    request(api.url, function (error, response, body) {
                        if (!error && response.statusCode == 200){
                            callback(body);
                        }
                        else callback('cannot get img upload url');
                    });
                }
                else callback('cannot set public img upload session');
            });
        }
        else callback('cannot img upload session');
    });
}

function uploadOld(data, callback){
    generateUrl(function(url){
        url = 'http://uploads.im/api';
        var file = {
            // encode the file read from the filesystem (passed through the data argument in the function)
    		file: new Buffer(data).toString('base64'),
            // If you want, you can rename the file on the fly
    		filename: "bar.jpg"
	    };
	    
	    var options = {
        	uri: url,
        	headers: {
        	    'Content-type': 'application/x-www-form-urlencoded',
        	    'charset': 'utf-8'
        	},
        	method: "POST",
        	json: true,
        	body: file
        };
        
        request(options, function(error, response, body){
            if (!error && response.statusCode == 200) {
                callback(body);
            }
            else{
                callback(body);
            }
            
            
        });
    });
}

function get(callback){
    var url = 'https://share-img.appspot.com/api?get_imageid='+session;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = body;
            callback(data);
        }
        else
            callback('cannot get image list from api');
    });
};