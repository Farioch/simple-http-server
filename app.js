var express = require('express')
  , request = require('request')
var app = express();

//setting view engine to EJS
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//handle for all requests at localhost:3000/
app.get('/', function (req, res) {
	if (req.query.url !== undefined) {
		request({
			method: 'GET',
  			url: req.query.url,
  			followRedirect: false,
  			timeout: 2000
  			}, function (error, response, body) {
  				//simply put error in status field
  				if (error) {
  					res.render('view', { resp_status: error,
  										 resp_body: ''});
  				} else {
  					//for httpStatusCode 200-299 - status: success, body: plain text
  					if (response.statusCode >= 200 && response.statusCode < 300) {
  					res.render('view', { resp_status: 'Success', 
  									     resp_body: body});
  					} else
  					//for httpStatusCode 300-399 - status: redirect, body: location
  					if (response.statusCode >= 300 && response.statusCode < 400) {
  					res.render('view', { resp_status: 'Redirect', 
  									     resp_body: response.headers.location});
  					} else 
  					//for other httpStatusCode - status: code + message, body: empty
  					if (response.statusCode >= 400) {
  					res.render('view', { resp_status: response.statusCode+' '+response.statusMessage, 
  									     resp_body: ''});
  					} 
  				}
 			});
	} else {
		//response with no query
  		res.send('Http-server is working. Try quering as /?url=<your url>. Include http:// in your url if possible.');
 	}
});

//error handler, just in case, may be redundant
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//error handler for 404 Not found, just in case, may be redundant
app.use(function(req, res, next) {
  res.status(404).send('Sorry, cant find that!');
});

//server port listening
app.listen(3000, function () {
  console.log('Http-server started on port 3000!');
});
