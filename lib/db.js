var mongoDb = require("mongodb");
var ObId = mongoDb.ObjectID;

var dbOpts = {
    league : 'mongodb://good:goodreadandwrite@ds061938.mongolab.com:61938/leage'
}

module.exports.con = con;
module.exports.col = col;
module.exports.get = get;
module.exports.add = add;
module.exports.remove = remove;
module.exports.update = update;
module.exports.id = id;


function con(dbName, callback){
	mongoDb.MongoClient.connect(dbOpts[dbName], function (err, db) {
		if(err){
			console.log(err);
			callback(false);
		} else {
			console.log('<DB> connected: '+ db.databaseName);
			callback(db);
		}
	});
}

function get(app, colName, callback, query){
    query = query || {};
    var db = app.cache.db;
    col(db, colName, function(collection){
        collection.find(query).toArray(function(e, data){
            callback(data);
        });
    })
}

function id(id){
    return new ObId(id);
}

function add(app, colName, data, callback, back){
    var db = app.cache.db; 
    col(db, colName, function(collection){
        collection.insert(data, function(e){
            if (e) callbback(e);
            else if(back == 'id') {
                var temp = [];
                for(i in data){
                    temp.push(data[i]._id);
                }
                callback(temp);
            } else
                callback();
        });
    })
}

function save(app, colName, data, callback){
    var db = app.cache.db; 
    col(db, colName, function(collection){
        collection.insert(data, function(e){
            if (e) callbback(e);
            else callback(data._id);
        });
    })
}


function remove(app, colName, query, callback){
    var db = app.cache.db;
    col(db, colName, function(collection){
        collection.remove(query, function(e){
            callback(e);
        });
    });
}

function update(app, colName, where, query, callback){
    var db = app.cache.db;
    col(db, colName, function(collection){
        collection.update(where, query, function(e){
            callback(e);
        });
    });
}

function col(db, colName, callback){
    
    if(db){
        db.collection(colName, function(e, collection){
    		if(!e){
    			callback(collection);
    		} else {
    		    console.log('<DB> faled to select collection');
    			console.log(e);
    			callback(false);
    		}
    	});
    } else 
        callback(false);
}