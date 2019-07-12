var express = require('express');
var router = express.Router();
const MongoDb = require('../modules/MongoDb.js');
const mongoDb = new MongoDb();
const MongoClient = require('mongodb').MongoClient;

router.get('/all', function(req, res, next) {

  MongoClient.connect(mongoDb.url, {useNewUrlParser: true}, function(err, db){
    if(err){
      console.log(err);
      throw err;
    }

    var sort = {};

    var dbo = db.db(mongoDb.dbName);

    let query = {};

    let limit = 500;

    if(req.query.limit){
      limit = parseInt(req.query.limit);
    }

    if(req.query.sort){
      if(sort === parseInt(1)){
        var sort = {'seenTime': 1};
      }
      else{
        var sort = {'seenTime': -1};
      }
    }

    dbo.collection(mongoDb.collectionName).find(query).limit(limit).sort(sort).toArray(function(err,result){
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
  
  MongoClient.connect(mongoDb.url, {useNewUrlParser: true}, function(err, db){
    if(err){
      console.log(err);
      throw err;
    }
    var dbo = db.db(mongoDb.dbName);
    let query = {};
    let limit = 100;

    if(req.query.limit){
      limit = parseInt(req.query.limit);
    }

    if(req.query.date_from && req.query.date_to){
      let startTime = getDateForQuery(req.query.date_from, 0);
      let endTime = getDateForQuery(req.query.date_to, 1);

      query = {
          "seenTime" : {
            $gte: startTime,
            $lt: endTime,
          }
      };
    }

    else if (req.query.delay){
      let startTime = getTimestampAgo( parseInt(req.query.delay), null );
      let endTime = getTimestampAgo(null, null);

      query = {
          "seenTime" : {
            $gte: startTime,
            $lt: endTime,
          }
      };
    }
    else{
      let timeLimit = getTimestampAgo(1, null);
      let cur = getTimestampAgo(0, null);
      query = {
          "seenTime" : {
            $gte: timeLimit,
            $lt: cur
          }
      };
    }

    dbo.collection(mongoDb.collectionName).find(query).limit(limit).toArray(function(err,result){
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
  MongoClient.connect(mongoDb.url, {useNewUrlParser: true}, function(err, db){
      if(err){
        console.log(err);
        throw err;
      }
      var dbo = db.db(mongoDb.dbName);

      var limit = 0;

      if(req.query.limit){
        limit = req.query.limit;
      }

      var query = {};
      
      if(req.params.clientMac){
        query = {"clientMac":req.params.clientMac};
      }

      if( req.params.clientMac && req.query.date_from && req.query.date_to ){
        let startTime = getDateForQuery(req.query.date_from, 0);
        let endTime = getDateForQuery(req.query.date_to, 1);

        query = {
          "clientMac":req.params.clientMac,
          "seenTime" : {
            $gte: startTime,
            $lt: endTime,
          }
        };
      }
      
      /**
        '-1' for descending order, 
        '1' for ascending order,
        since mongoDb created '_id' itself by time, it could be used for sorting order by timestamp
      */
      // var sort = {'_id': -1};
      var sort = {'seenTime': 1};
      if(req.query.sort){
        if(parseInt(req.query.sort) == -1){
          sort = {'seenTime': -1};
        }
      }

      dbo.collection(mongoDb.collectionName).find(query).sort(sort).limit(limit).toArray(function(err,result){
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
  MongoClient.connect(mongoDb.url, {useNewUrlParser: true}, function(err, db){
      if(err){
        console.log(err);
        throw err;
      }
      var dbo = db.db(mongoDb.dbName);
      var query = {};
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

module.exports = router;

function getTimestampAgo(delayMin, delayHr){
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
  if(delayHr){
    hr = hr - delayHr;
  }
  if(hr<10){
    hr = "0" + hr;
  }

  let min = now.getMinutes();
  if(delayMin){
    min = min - delayMin;
  }

  if(min<10) min = "0" + min;

  let sec = now.getSeconds();
  if(sec<10) sec = "0" + sec;

  let timestamp = yr + "-" + mon + "-" + date + "T" + hr + ":" + min + ":" + sec + "Z";
  return timestamp;
}

function getDateForQuery(givenTime, ending){

  let timeInFormat = new Date();

  if(givenTime){
    timeInFormat = new Date(givenTime);
  }

  let yr = timeInFormat.getFullYear();

  let mon = timeInFormat.getMonth() + 1;

  if(mon<10){
    mon = "0" + mon;
  }

  let date = timeInFormat.getDate() + ending;

  if(date<10){
    date = "0" + date;
  }

  let hr = "00";

  let min = "00";

  let sec = "00";

  let dateFormTimestamp = yr + "-" + mon + "-" + date + "T" + hr + ":" + min + ":" + sec + "Z";
  
  return dateFormTimestamp;
}
