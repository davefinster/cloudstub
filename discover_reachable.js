//takes a list of space separated IP ranges and prepares them for being part of a silver peak cloud app spec
var tcpping = require('tcp-ping');
var async = require('async');
var Netmask = require('netmask').Netmask
var ranges = [];
var addressList = [];
var reachableBlocks = [];
var reachableList = [];

for ( var i = 2; i < process.argv.length; i++ ){
	var block = new Netmask(process.argv[i]);
	var obj = {
		subnet: process.argv[i],
		reachableIp: null,
        pingMethod: 'TCP',
        pingPort: null,
        block: block
	}
	ranges.push(obj);
	block.forEach(function(ip, long, index){
		addressList.push({ip: ip, block: block});
	});
}

async.eachLimit(addressList, 4000, function(addressObj, callback){
	var address = addressObj;
	var asyncCallback = callback;
	if ( reachableBlocks.indexOf(address.block) != -1 ){
		console.log('Skipping ', address.ip);
		async.nextTick(function(){
			asyncCallback();
		});
		return;
	}
	tcpping.ping({
		address: address.ip,
		port: 443,
		attempts:1
	}, function(err, data){
		if ( !isNaN(data.avg) ){
			console.log('Subnet ', address.block.base, ' reachable at ', address.ip);
			reachableList.push(address);
			reachableBlocks.push(address.block);
		}else{
			console.log('Subnet ', address.block.base, ' not reachable at ', address.ip);
		}
		asyncCallback();
	});
}, function(err){
	var reachableRanges = [];
	for ( var i = 0; i < ranges.length; i++ ){
		var range = ranges[i];
		for ( var j = 0; j < reachableList.length; j++ ){
			var reachableObj = reachableList[j];
			if ( reachableObj.block == range.block ){
				reachableRanges.push({
					subnet: range.subnet,
					reachableIp: reachableObj.ip,
			        pingMethod: 'TCP',
			        pingPort: 443
				});
				break;
			}
		}
	}
	console.log(JSON.stringify(reachableRanges));
});