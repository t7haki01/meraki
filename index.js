var system = require('./confidentials&settings/settings.json');
var port = system.meraki.port;
var secret = system.meraki.secret;
var validator = system.meraki.validator;
var route = system.meraki.route;
var session_setting = system.session;

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


/**From here. making api secure */

/**
 * Attackers can use this header (which is enabled by default) to detect apps running Express and then launch specifically-targeted attacks.
 * from https://expressjs.com/en/advanced/best-practice-security.html
 */
// since i will use helmet, no need to duplicating "x-powered-by" hiding for preventing attack
// but for the purpose of learning, let here be with commenting
// when not using helmet, minimum security option can be "disabled" x-powered-by

// app.disable('x-powered-by');

/**
 * Helmet can help protect app from some well-known web vulnerabilities by setting HTTP headers appropriately.
 * Helmet is actually just a collection of smaller middleware functions that set security-related HTTP response headers
 * 
 * -List ref: https://expressjs.com/en/advanced/best-practice-security.html
 * csp sets the Content-Security-Policy header to help prevent cross-site scripting attacks and other cross-site injections.
 * hidePoweredBy removes the X-Powered-By header.
 * hpkp Adds Public Key Pinning headers to prevent man-in-the-middle attacks with forged certificates.
 * hsts sets Strict-Transport-Security header that enforces secure (HTTP over SSL/TLS) connections to the server.
 * ieNoOpen sets X-Download-Options for IE8+.
 * noCache sets Cache-Control and Pragma headers to disable client-side caching.
 * noSniff sets X-Content-Type-Options to prevent browsers from MIME-sniffing a response away from the declared content-type.
 * frameguard sets the X-Frame-Options header to provide clickjacking protection.
 * xssFilter sets X-XSS-Protection to enable the Cross-site scripting (XSS) filter in most recent web browsers.
 */
var helmet = require('helmet');
app.use(helmet());

/**
 * From here setting some secure setting for cookies & session
 * 
 * Using the default session cookie name can open your app to attacks.
 * The security issue posed is similar to X-Powered-By: 
 * a potential attacker can use it to fingerprint the server and target attacks accordingly.
 */
var session = require('cookie-session')
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(session({
    secret: session_setting.secret,
    name: session_setting.name,
    keys: [session_setting.key1, session_setting.key2],
    cookie: {
        secure: true,
        httpOnly: true,
        domain: session_setting.domain,
        path: session_setting.path,
        expires: expiryDate
    }
}))

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

let nowInHr = new Date().getHours();
let nowInDate = new Date().getDate();

// Getting the flow of data every 1 to 2 minutes
app.post(route, function(req, res) {
	if (req.body.secret == secret) {
        console.log('Secret verified');
        if(req.body.data.observations){
            console.log(req.body.data.observations.length + " " + ", raw data posted");
            mongoDb.insertToCol(null, null, mongoDb.trimDataMongo(req.body));

            if(runOnceInAHour((new Date()).getHours())){
                mongoDb.deleteAmonthOlder();
            }

            if(runOnceInADay((new Date()).getDate())){
                mongoDb.deleteNonsense();
            }
        }
        // Here was the part saving data in MySQL
        //        mysqlDb.insertToDb(req.body);
    } 
    else {
        console.log(req);
		console.log('Secret was invalid');
	}
	res.status(200);
});



function runOnceInAHour(curHr){
    if(curHr !== nowInHr){
        nowInHr = curHr;
        console.log("Hourly deleting function performed");
        return true;
    }
    else{
        return false;
    }
}

function runOnceInADay(today){
    if(today !== nowInDate){
        nowInDate = today;
        console.log("Daily deleting function performed");
        return true;
    }
    else{
        return false;
    }
}