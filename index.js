var system = require('./confidentials&settings/settings.json');
var port = system.meraki.port;
var secret = system.meraki.secret;
var validator = system.meraki.validator;
var route = system.meraki.route;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');


/**
 * For the cors policy, lazy implementation which is not including header
 * separately, using one dependency "cors"
 */
app.use(cors());
app.use(bodyParser.json({ limit: '25mb' }));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(path.join(__dirname, 'dist/meraki')));


const meraki = require('./routes/meraki');

app.use('/meraki', meraki);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/meraki/index.html'));
});

/**Since MySQL was unstable with occuring "too many connections error" or "timeout error"
 * even connections bulked up with pools or error handling, remained unstable.
 * With considering several aspects, such as disk usage, handling big data or
 * query timing(actually not so difference in condition of setting that for the best performance in MySQL or MongoDB),
 * currently in processing implementation, MySQL seems not gonna be used but leave it be for the further development in future
 * in case of possible reference.
 */
// const MysqlDb =  require('./modules/MysqlDb.js');
// const mysqlDb = new MysqlDb();

const MongoDb = require('./modules/MongoDb.js');
const mongoDb = new MongoDb();

// Start server
app.listen(port, function() {
    console.log('Server listening on port: ' + port);
});

//Here comes posting from meraki 
app.get(route, function(req, res) {
    console.log('Validator = ' + validator);
    res.status(200).send(validator);
});

// Getting the flow of data every 1 to 2 minutes
app.post(route, function(req, res) {
	if (req.body.secret == secret) {
        console.log('Secret verified');
    	console.log(req.body.data.observations.length + " " + ", raw data posted");
        // Here was the part saving data from posting from meraki server
        //        mysqlDb.insertToDb(req.body);
        mongoDb.insertToCol(null, null, mongoDb.trimDataMongo(req.body));
        mongoDb.deleteAmonthOlder();
    } 
    else {
		console.log('Secret was invalid');
	}
	res.status(200);
});
