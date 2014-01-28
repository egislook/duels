var request = require('request');
var fs = require('fs');
var key = '54478825b5a9575';
var url = 'https://api.imgur.com/3/image';


module.exports.upload = upload;
module.exports.get = get;

function upload(path, callback){
    var opts = {
        uri: url,
        headers: {
        'Authorization': 'Client-ID '+key
        },
        qs: {}
    }
    
    fs.readFile(path, function(e, data) {
        if(e) callback(e);
        else{
          opts.qs.type = 'base64';
          opts.body = data.toString('base64');
          
          request.post(opts, function(e, r, body) {
            if(e) callback(e);
            else if (r.statusCode !== 200 || body.error) callback(false);
            else callback(JSON.parse(body).data);
          });
        }
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