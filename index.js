var restify = require('restify');
var fs = require('fs');
var util = require('util');
var extraApps = JSON.parse(fs.readFileSync('./additional_apps.json').toString());
var server = restify.createServer({
  name: 'cloudportal',
  version: '0.0.1',
  key: fs.readFileSync('./server.key'),
  certificate: fs.readFileSync('./server.crt')
});
var jsonClient = restify.createJsonClient({
	url: 'https://cloudportal.silver-peak.com'
});
var stringClient = restify.createStringClient({
	url: 'https://cloudportal.silver-peak.com'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.post('/portal/apis/public/rest/stats/updateStats', function (req, response, next){
	jsonClient.post('/portal/apis/public/rest/stats/updateStats', req.params, function(err, req, res, obj) {
		response.send(obj);
	});
});

server.post('/portal/apis/public/rest/hello', function (req, response, next){
	jsonClient.post('/portal/apis/public/rest/hello', req.params, function(err, req, res, obj) {
		console.log(obj);
		response.send(obj);
	});
});

server.post('/portal/apis/public/rest/registerUuid', function (req, response, next){
	console.log(req.params);
	jsonClient.post('/portal/apis/public/rest/registerUuid', req.params, function(err, req, res, obj) {
		console.log(obj);
		response.send(obj);
	});
});

server.post('/portal/apis/public/rest/register/getInfo', function (req, response, next){
	console.log('GETINFO REQ', req.headers, req.params);
	jsonClient.post('/portal/apis/public/rest/register/getInfo', req.params, function(err, req, res, obj) {
		console.log('GETINFO RES', obj);
		response.send(obj);
	});
});

server.post('/portal/apis/public/rest/secondaryPortal', function (req, response, next){
	console.log('SECONDARY REQ', req.headers, req.params);
	jsonClient.post('/portal/apis/public/rest/secondaryPortal', req.params, function(err, req, res, obj) {
		console.log('SECONDARY RES', obj);
		response.send(obj);
	});
});

server.post('/portal/apis/public/rest/caBundle', function (req, response, next){
	console.log('CABUNDLE REQ', req.headers, req.params);
	jsonClient.post('/portal/apis/public/rest/caBundle', req.params, function(err, req, res, obj) {
		console.log('CABUNDLE RES', obj);
		response.send(obj);
	});
});

server.post('/portal/apis/public/rest/phonehome', function (req, response, next){
	console.log('PHONEHOME REQ', req.headers, req.params);
	jsonClient.post('/portal/apis/public/rest/phonehome', req.params, function(err, req, res, obj) {
		console.log('PHONEHOME RES', obj);
		response.send(obj);
	});
});

server.post('/portal/apis/public/rest/cloudapplication', function (req, response, next){
	console.log('CLOUDAPPLICATION REQ', req.headers, req.params);
	jsonClient.post('/portal/apis/public/rest/cloudapplication', req.params, function(err, req, res, obj) {
		console.log('CLOUDAPPLICATION RES', util.inspect(obj, { showHidden: true, depth: null }));
		if ( obj.length != undefined ){
			//actual response
			for ( var i = 0 ; i < extraApps.length; i++ ){
				obj.push(extraApps[i]);
			}
		}
		console.log(JSON.stringify(obj));
		response.send(obj);
	});
});

server.post('/portal/apis/public/rest/register', function (req, response, next){
	console.log('REGISTER REQ', req.headers, req.params);
	jsonClient.post('/portal/apis/public/rest/register', req.params, function(err, req, res, obj) {
		console.log('REGISTER RES', obj);
		response.send(obj);
	});
});

server.post('/portal/apis/public/rest/internetDb/geoLocateIp', function (req, response, next){
	console.log('geoLocateIp REQ', req.headers, req.params);
	jsonClient.post('/portal/apis/public/rest/internetDb/geoLocateIp', req.params, function(err, req, res, obj) {
		console.log('geoLocateIp RES', obj);
		response.send(obj);
	});
});

server.get('/portal/apis/public/rest/internetDb/text', function (req, response, next){
	console.log('internetDb REQ', req.headers, req.params);
	stringClient.get('/portal/apis/public/rest/internetDb/text', req.params, function(err, req, res, data) {
		response.send(data);
	});
})

server.on('NotFound', function (request, response, cb) {
	console.log('NOTFOUND', request.headers, request.href(), request.path(), request.params);
});

server.listen(8000, function () {
  console.log('%s listening at %s', server.name, server.url);
});