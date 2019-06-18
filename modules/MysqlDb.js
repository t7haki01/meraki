var mysql = require('mysql');
var system = require('../confidentials&settings/settings.json');

module.exports = class MysqlDb{
    constructor(){
        this.connection = null;
        this.db = system.sql;
    }

    insertToDb(data){
        let con = mysql.createConnection(this.db);
        con.connect(function(err){
            if(err){
                console.log(err);
                handleDisconnect();
                throw err;
            }
            else{
//                console.log("MySQL connected!");
                let values = [];
                values = trimDataSql(data);
                if(values !== 'undefined' && values && values.length>1 && values !== null){
                    var insertQuery = "INSERT INTO info (seenBy,seenType,apFloor,lat,lng,unc,x,y,seenTime,clientMac,seenEpoch,rssi,manufacturer) VALUES ?";
                    if(data.data.observations.length>0){
                        con.query(insertQuery, [values], function(err, result){
                            if(err){
                                console.log(err);
                                con.end();
                                handleDisconnect();
                                throw err;
                            }
                            else{
                                console.log(result.affectedRows + " records inserted in MySQL!");
                                con.end();
                            }
                        });
                    }
                }
            }
        });//end of db connection
    }
};//end of mysql class

function trimDataSql(data){
    var values = [];

    for(var i = 0; i<data.data.observations.length;i++){
        if(data.data.observations[i].location!== null){
            var timeStamp = JSON.stringify(data.data.observations[i].seenTime);
            //Trimming time value from meraki server to sql datetime format
            timeStamp = timeStamp.replace('T',' ');
            timeStamp = timeStamp.replace('Z','');
            timeStamp = timeStamp.replace('\"','');
            timeStamp = timeStamp.replace('\"','');
            var dataToPush =
                [
                    JSON.stringify(data.data.apMac)!=null?JSON.stringify(data.data.apMac):null,
                    JSON.stringify(data.type)!=null?JSON.stringify(data.type):null,
                    JSON.stringify(data.data.apFloors)!=null?JSON.stringify(data.data.apFloors):null,
                    JSON.stringify(data.data.observations[i].location.lat)!=null?JSON.stringify(data.data.observations[i].location.lat):null,
                    JSON.stringify(data.data.observations[i].location.lng)!=null?JSON.stringify(data.data.observations[i].location.lng):null,
                    JSON.stringify(data.data.observations[i].location.unc)!=null?JSON.stringify(data.data.observations[i].location.unc):null,
                    JSON.stringify(data.data.observations[i].location.x)!=null?JSON.stringify(data.data.observations[i].location.x):null,
                    JSON.stringify(data.data.observations[i].location.y)!=null?JSON.stringify(data.data.observations[i].location.y):null,
                    timeStamp!=null?timeStamp:null,
                    JSON.stringify(data.data.observations[i].clientMac)!=null?JSON.stringify(data.data.observations[i].clientMac):null,
                    JSON.stringify(data.data.observations[i].seenEpoch)!=null?JSON.stringify(data.data.observations[i].seenEpoch):null,
                    JSON.stringify(data.data.observations[i].rssi)!=null?JSON.stringify(data.data.observations[i].rssi):null,
                    JSON.stringify(data.data.observations[i].manufacturer)!=null?JSON.stringify(data.data.observations[i].manufacturer):null
                ];
            values.push(dataToPush);
        }
    }//This is end of for loop
    return values;
}

function handleDisconnect() {
    // Recreate the connection, since
    // the old one cannot be reused.
    connection = mysql.createConnection(system.sql); 
    
    // The server is either down
    // or restarting (takes a while sometimes).
    connection.connect(function(err) {     
        if(err) {
            console.log('error when connecting to db:', err);
            // Here introduce a delay before attempting to reconnect,
            // to avoid a hot loop, and to allow our node script to
            // process asynchronous requests in the meantime.
            setTimeout(handleDisconnect, 2000);
        }
    });
    // In case, also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);

        // Connection to the MySQL server is usually
        // lost due to either server restart, or a
        // connnection idle timeout (the wait_timeout
        // server variable configures this)

        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnect();                         
        } 
        else {                                      
            throw err;                                  
        }
    });
}
