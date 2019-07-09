const MongoClient = require('mongodb').MongoClient;
var system = require('../confidentials&settings/settings.json')

module.exports = class MongoDb{
    constructor(){
        this.url = system.mongoDb.url;
        this.dbName = system.mongoDb.database;
        this.collectionName = system.mongoDb.collectionName;
    }

    createDb(dbName){
        if(dbName === null){
            dbName = this.dbName;
        }
        /**
         * Creating database in mongodb,
         * check currently running mongdb in server with "netstat -plntu"
         * port can be modified in "/etc/mongod.conf",
         * instead of ubuntu distribution mongodb, official mongodb org community edition is used 
         * for the further own studying purpose
         */

        // var url = "mongodb://127.0.0.1:27017/" + dbName;

        MongoClient.connect(this.url + dbName, {useNewUrlParser: true}, function(err, db) {
          if (err){
            console.log(err);
            throw err;
          }
          console.log("Database created!");
          db.close();
        });
    }

    createCollection(dbName, collectionName){
        if(dbName === null){
            dbName = this.dbName;
        }
        if(collectionName === null){
            collectionName = this.collectionName;
        }
        //127.0.0.1 can be replaced with localhost
        // var url = "mongodb://127.0.0.1:27017/";

        MongoClient.connect(this.url, {useNewUrlParser: true}, function(err, db) {
            if (err){
                console.log(err);
                throw err;
            } 
            var dbo = db.db(dbName);
            dbo.createCollection(collectionName, function(err, res) {
                if (err){
                    console.log(err);
                    throw err;   
                }
                console.log(res);
                console.log("Collection created!");
                db.close();
            });
        });
    }

    insertToCol(dbName, collectionName, data){
        // var url = "mongodb://localhost:27017/";
        if(dbName === null){
            dbName = this.dbName;
        }

        if(collectionName === null){
            collectionName = this.collectionName;
        }

        MongoClient.connect(this.url, {useNewUrlParser: true}, function(err, db) {
            if (err){
                console.log(err);
                throw err;
            }
            var dbo = db.db(dbName);
            var obj = data;

            if(typeof obj !== 'undefined' && obj){
                if(data.length>1 && data !== null){
                    dbo.collection(collectionName).insertMany(obj, function(err, res) {
                        if (err){
                            console.log("From line 84 ",err);
                            throw err;
                        }
                       // console.log("Number of documents inserted: " + res.insertedCount);
			console.log(res.insertedCount + " " + "inserted in MongoDB");
                        db.close();
                    });
                }
                else if(data.length === 1 && data !== null){
                    dbo.collection(collectionName).insertOne(obj[0], function(err, res) {
                        if (err){
                            console.log("From line 96 ",err);
                            throw err;
                        }
                        console.log("1 document inserted");
                        db.close();
                    });
                }
            }
        });
    }

    trimDataMongo(data){
        var values = [];

        for(var i = 0; i<data.data.observations.length;i++){
            if(data.data.observations[i].location!== null){
                var timeStamp = JSON.stringify(data.data.observations[i].seenTime);
                //Trimming time value from meraki server to sql datetime format
                timeStamp = timeStamp.replace('\"','');
                timeStamp = timeStamp.replace('\"','');
        		timeStamp = new Date(timeStamp).toIsoString();

//                timeStamp = timeStamp.replace('T',' ');
//                timeStamp = timeStamp.replace('Z','');
                var dataToPush =
                    {
                        "apMac" : JSON.stringify(data.data.apMac)!=null?JSON.stringify(data.data.apMac):null,
                        "type" : JSON.stringify(data.type)!=null?JSON.stringify(data.type):null,
                        "apFloors" : JSON.stringify(data.data.apFloors)!=null?JSON.stringify(data.data.apFloors):null,
                        "lat" : JSON.stringify(data.data.observations[i].location.lat)!=null?JSON.stringify(data.data.observations[i].location.lat):null,
                        "lng" : JSON.stringify(data.data.observations[i].location.lng)!=null?JSON.stringify(data.data.observations[i].location.lng):null,
                        "unc" : JSON.stringify(data.data.observations[i].location.unc)!=null?JSON.stringify(data.data.observations[i].location.unc):null,
                        "x" : JSON.stringify(data.data.observations[i].location.x)!=null?JSON.stringify(data.data.observations[i].location.x):null,
                        "y" : JSON.stringify(data.data.observations[i].location.y)!=null?JSON.stringify(data.data.observations[i].location.y):null,
                        "seenTime" : timeStamp!=null?timeStamp:null,
                        "clientMac" : JSON.stringify(data.data.observations[i].clientMac)!=null?JSON.stringify(data.data.observations[i].clientMac):null,
                        "seenEpoch" : JSON.stringify(data.data.observations[i].seenEpoch)!=null?JSON.stringify(data.data.observations[i].seenEpoch):null,
                        "rssi" : JSON.stringify(data.data.observations[i].rssi)!=null?JSON.stringify(data.data.observations[i].rssi):null,
                        "manufacturer" : JSON.stringify(data.data.observations[i].manufacturer)!=null?JSON.stringify(data.data.observations[i].manufacturer):null
                    };
                values.push(dataToPush);
            }
        }//This is end of for loop
        return values;
    }

    deleteAmonthOlder(){
        let dbName = this.dbName;
        let collectionName = this.collectionName;
        let aMonthAgo = getDateForQuery(0,1,0,0);
        let query ={
            "seenTime":{
              $lt: aMonthAgo,
            }
        };
        MongoClient.connect(this.url, {useNewUrlParser: true}, function(err, db){
            if(err){
                console.log(err);
                throw err;
            }
            var dbo = db.db(dbName);
            
            dbo.collection(collectionName).deleteMany(query, function(err, obj){
                if(err){
                    console.log(err);
                    throw err;
                }
                console.log(obj.deletedCount + " deleted!");
                db.close();
            })

        })//end of mongo Db connection
    }
    
    deleteNonsense(){
        let dbName = this.dbName;
        let collectionName = this.collectionName;
        let tomorrow = getDateForQuery(0,0,-1,0);
        let query ={
            "seenTime":{
              $gte: tomorrow,
            }
        };
        MongoClient.connect(this.url, {useNewUrlParser: true}, function(err, db){
            if(err){
                console.log(err);
                throw err;
            }
            var dbo = db.db(dbName);
            
            dbo.collection(collectionName).deleteMany(query, function(err, obj){
                if(err){
                    console.log(err);
                    throw err;
                }
                console.log(obj.deletedCount + " deleted!");
                db.close();
            })

        })//end of mongo Db connection
    }
};//ending of MongoDb Class


Date.prototype.toIsoString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds())
	+'Z';
	// Here for the possible to get difference between UTC and Local
        // dif + pad(tzo / 60) +
        // ':' + pad(tzo % 60);
}


function getDateForQuery(yrAgo, monAgo, dateAgo, hrAgo){

    let timeInFormat = new Date();
    
    let yr = timeInFormat.getFullYear();
    yr = yr - yrAgo;
  
    let mon = timeInFormat.getMonth() + 1;
    mon = mon - monAgo; 
  
    if(mon<10){
      mon = "0" + mon;
    }
  
    let date = timeInFormat.getDate();
    date = date - dateAgo;

    if(date<10){
        date = "0" + date;
    }
  
    let hr = timeInFormat.getHours();
    hr = hr - hrAgo;
    if(hr<10){
        hr = "0" + hr;
    }
  
    let min = "00";
  
    let sec = "00";
  
    let dateFormTimestamp = yr + "-" + mon + "-" + date + "T" + hr + ":" + min + ":" + sec + "Z";
    console.log("Older than " + dateFormTimestamp + " will be deleted");
    return dateFormTimestamp;
}