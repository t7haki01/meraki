var express = require('express');
var router = express.Router();
const MongoDb = require('../modules/MongoDb.js');
const mongoDb = new MongoDb();
const MongoClient = require('mongodb').MongoClient;

router.get('/all', function(req, res, next) {

  MongoClient.connect(mongoDb.url, function(err, db){
    if(err){
      console.log(err);
      throw err;
    }

    var dbo = db.db(mongoDb.dbName);
    let query = {};

    dbo.collection(mongoDb.collectionName).find(query).limit(100).toArray(function(err,result){
      if(err){
        console.log(err);
        throw err;
      }
      res.json(result);
      db.close();
    });
  });
});



router.get('/', function(req, res, next) {
  
  MongoClient.connect(mongoDb.url, function(err, db){
    if(err){
      console.log(err);
      throw err;
    }
    var dbo = db.db(mongoDb.dbName);
    let query = {};

    if(req.query.date){
      let startTime = getDateForQuery(req.query.date, 0);
      let endTime = getDateForQuery(req.query.date, 1);

      query = {
          "seenTime" : {
            $gte: startTime,
            $lt: endTime,
          }
      };
    }
    else{
      let timeLimit = getTimestampAgo(1);
      let cur = getTimestampAgo(0);
      query = {
          "seenTime" : {
            $gte: timeLimit,
            $lt: cur
          }
      };
    }

    dbo.collection(mongoDb.collectionName).find(query).toArray(function(err,result){
      if(err){
        console.log(err);
        throw err;
      }
      res.json(result);
      db.close();
    });
  });
});

router.get('/:clientMac?', function(req, res, next){
  MongoClient.connect(mongoDb.url, function(err, db){
      if(err){
        console.log(err);
        throw err;
      }
      var dbo = db.db(mongoDb.dbName);
      var query = {};

      if(req.query.date){
        let startTime = getDateForQuery(req.query.date, 0);
        let endTime = getDateForQuery(req.query.date, 1);
  
        query = {
            "seenTime" : {
              $gte: startTime,
              $lt: endTime,
            },
            clientMac: req.params.clientMac,
        };
      }
      
      else{
        let startTime = getDateForQuery("", 0);
        let endTime = getDateForQuery("", 1);
        query = {
          "seenTime" : {
            $gte: startTime,
            $lt: endTime,
          },
          clientMac: req.params.clientMac
        };
      }
      /**
        '-1' for descending order, 
        '1' for ascending order,
        since mongoDb created '_id' itself by time, it could be used for sorting order by timestamp
        theoretically but weird behaviour observed 24.5.2019 - need to take a look more into
        so currently sort by seenTime which is timestamp / UTC time still
      */
      // var sort = {'_id': -1};
      var sort = {'seenTime': 1};

      dbo.collection(mongoDb.collectionName).find(query).sort(sort).toArray(function(err,result){
        if(err){
          console.log(err);
          throw err;
        }
        res.json(result);
        db.close();
      });
    });
});

router.get('/lastseen/:clientMac?', function(req, res, next){
  MongoClient.connect(mongoDb.url, function(err, db){
      if(err){
        console.log(err);
        throw err;
      }
      var dbo = db.db(mongoDb.dbName);
      var query = {clientMac: req.params.clientMac};
      var sort = {'_id': -1};

      dbo.collection(mongoDb.collectionName).find(query).sort(sort).limit(1).toArray(function(err,result){
        if(err){
          console.log(err);
          throw err;
        }
        res.json(result);
        db.close();
      });
    });
});

router.delete('/', function(req, res, next) {

  MongoClient.connect(mongoDb.url, function(err, db){
    if(err){
      console.log(err);
      throw err;
    }
    let aMonthAgo = getDateForQuery("",8);
    let futureDate = getDateForQuery("",1);
    var dbo = db.db(mongoDb.dbName);
    let query = {
      "seenTime":{
        $lt: aMonthAgo,
        $gte: futureDate
      }
    };
    
    dbo.collection(mongoDb.collectionName).deleteMany(query, function(err, obj){
      if(err){
        console.log(err);
        throw err;
      }
      console.log(obj);
      db.close();
    });
  });
});


module.exports = router;

function getTimestampAgo(delay){
  let now = new Date();
  let yr = now.getFullYear();
  let mon = now.getMonth() + 1;
  if(mon<10){
    mon = "0" + mon;
  }
  let date = now.getDate();
  if(date<10){
    date = "0" + date;
  }
  let hr = now.getHours();
  if(hr<10){
    hr = "0" + hr;
  }
  let min = now.getMinutes()-delay;
  if(min<10) min = "0" + min;
  let sec = now.getSeconds();
  if(sec<10) sec = "0" + sec;
  let timestamp = yr + "-" + mon + "-" + date + "T" + hr + ":" + min + ":" + sec + "Z";
  return timestamp;
}

function getDateForQuery(givenTime, ending){

  let timeInFormat = new Date(givenTime);

  let yr = timeInFormat.getFullYear();

  let mon = timeInFormat.getMonth() + 1;

  if(mon<10){
    mon = "0" + mon;
  }

  let date = timeInFormat.getDate() + ending;

  let hr = "00";

  let min = "00";

  let sec = "00";

  let dateFormTimestamp = yr + "-" + mon + "-" + date + " " + hr + ":" + min + ":" + sec;
  return dateFormTimestamp;
}
