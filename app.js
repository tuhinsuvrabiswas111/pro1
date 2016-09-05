var express = require('express');
var mysql  = require('mysql');
var path = require('path');
var session = require('express-session');
var crypto = require('crypto');
var bodyParser = require('body-parser')

var app = express();

app.use('/node', express.static('node_modules'));
app.use('/src/js', express.static('app/js'));
app.use(session({
    secret: 'test',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
})); 
app.use( bodyParser.json() );       // to support JSON-encoded bodies




var con = mysql.createConnection({
	host 	 		: "localhost",
	user 	 		: "root",
	password 		: "",
	database 		: "test"
});


con.connect(function(err){
	if(err){
    	console.log('Error connecting to Db');
    	return;
  	}
  	console.log('Connection established');
});

/*con.end(function(err) {
	// The connection is terminated gracefully
  	// Ensures all previously enqueued queries are still
  	// before sending a COM_QUIT packet to the MySQL server.
	if(err){
    	console.log('connection not closed yet!');
    	return;
  	}
  	console.log('Connection clo');
});*/

/*var server = app.listen('8081',function(){
		var host = server.address().address;
	  	var port = server.address().port;
		console.log("Example app listening at http://%s:%s", host, port);
});*/

app.listen('8081',function(){
		console.log("Example app listening at 8081");
});
app.get('/',function( req, res ){
	res.sendFile(path.join(__dirname+ "/app/index.html" ));
});

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  
  if (req.session && req.session.user_id && req.session.admin && req.session.curr_session == req.sessionID){

    return next();
 } else {
  		   req.session.destroy();
  		   res.redirect('/');  
    //return res.sendStatus(401);
   }
};

// Login endpoint
app.post('/api/login', function (req, res) {
	// console.log(req.body);
	// console.log(req.query);
	//res.send(req);
  if (!req.body.username || !req.body.password) {
    res.send('login failed');
  } else {
  	
  	var pass = crypto.createHash('md5').update(req.body.password).digest("hex");
  	con.query("SELECT * FROM `stock_user` WHERE `user_name`= ? and `user_password` = ? limit 1",[ req.body.username, pass ], function(err, row, fields) {
			  if (err){
			  	console.log(err);
			  	throw err ;
			  } 
			 req.session.regenerate(function(){ 
				  req.session.user = row.user_name;
				  req.session.user_id = row.id;
			      req.session.admin = true;
			      req.session.curr_session = req.sessionID;
		       }); 

		      //res.send('success');
		      res.redirect('/admin');  
		      //res.json(row);

		});
    
  	}
});

// Logout endpoint
app.get('/api/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});

// Get content endpoint
app.get('/api/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
});

app.get('/admin',  function (req, res) {
  var sess = req.session;
  res.send("You can only see this after you've logged in.");
});