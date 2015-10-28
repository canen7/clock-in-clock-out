//dependencies
var express = require('express')
 ,  connect = require('connect') // don't need
 ,  inspect = require('util').inspect // don't need
 ,  http = require('http') // don't need
 ,  path = require('path')
 ,  session = require('express-session')
 ,  cookieParser = require('cookie-parser')
 ,  fs = require('fs-extra') //file system - for file manipulation
 ,  multer = require('multer'); //middleware for form/file upload

// set the app variable
var app = express();

app.use(session({
  secret: 'qwerty',
  resave: false,
  saveUninitialized: true
}))

// all environments
app.set('port', process.env.PORT || 3000); // process.env.PORT is important for staging and production environments
app.set('views', path.join(__dirname, './server/views')); // get rid of templating
app.set('view engine', 'ejs'); // get rid of this

// HTTP request logger
var morgan = require('morgan')
app.use(morgan('dev'));

// body parser for getting data through the request
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())

// allows you to use http verbs that aren't supported by the browser if the header is 'X-HTTP-Method-Override'
var methodOverride = require('method-override')
app.use(methodOverride('X-HTTP-Method-Override'));

// static files
app.use(express.static(path.join(__dirname, 'public'))); // serve all static files

// development only
var errorhandler = require('errorhandler')
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

// use multer, important: multer will not process any form which is not multipart/form-data
var done = false;
app.use(multer({
	//dest: './public/img/profile_pic/'
	dest: './temp_uploads/'
	// , rename: function (fieldname, filename) {
	// 		return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
	// 	}
	, limits: {
			files : 1
		}
	// , onFileUploadStart: function (file) {
 //  		console.log(file.fieldname + ' is starting ...')
	// 	}
	// , onFileUploadComplete: function (file) {
 //  		console.log(file.fieldname + ' uploaded to  ' + file.path);
 //  		done = true;
	// 	}
	, onFilesLimit: function () {
		  console.log('Crossed file limit!')
		}
}));

// load up and invoke the routes function returned as an export in routes.js
require('./server/routes')(app); // require runs the code 

// set server to listen on the appropriate port
app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
