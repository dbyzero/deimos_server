/********
 *
 * Log Object
 *
 * @author dbyzero
 * @date : 2013/07/28
 * @description : Log model
 * 
 **/

var color = require('colors');
var _ = require('underscore');
var util = require('util') ;
_.str = require('underscore.string');
_.mixin(_.str.exports());

/***
 * Singleton part
 */
var instance = null ;
var Instance = function() {
	if(instance == null) {
		instance = new Log() ;
	}
	return instance ;
}

/******
 * Log constructor
 *
 **/
var Log = function() {
}

/******
 * Log methods
 *
 **/
Log.prototype = {
	"getDate" : function(msg) {
		var d = new Date() ;
		return '('+
			d.getFullYear() + '/' + 
			_.pad(d.getMonth(),2,'0') + '/' + 
			_.pad(d.getDate(),2,'0') + ' ' + 
			_.pad(d.getHours(),2,'0') + ':' + 
			_.pad(d.getMinutes(),2,'0') + ':' + 
			_.pad(d.getSeconds(),2,'0') + ')' ;
	},
	"gay" : function(msg) {
		if(msg instanceof Object) {
			msg = JSON.stringify(msg) ;
		}
		console.log('rainbow:'.rainbow.bold + ' ' + this.getDate().grey + ' : ' + msg)
	},
	"success" : function(msg) {
		if(msg instanceof Object) {
			msg = JSON.stringify(msg) ;
		}
		console.log('success:'.green.bold + ' ' + this.getDate().grey + ' : ' + msg)
	},
	"info" : function(msg) {
		if(msg instanceof Object) {
			msg = JSON.stringify(msg) ;
		}
		console.log('info:'.yellow + '    ' + this.getDate().grey + ' : ' + msg)
	},
	"debug" : function(msg) {
		if(msg instanceof Object) {
			msg = JSON.stringify(msg) ;
		}
		console.log('debug:'.cyan.bold + '   ' + this.getDate().grey + ' : ' + msg)
	},
	"warning" : function(msg) {
		if(msg instanceof Object) {
			msg = JSON.stringify(msg) ;
		}
		console.log('warning:'.red + ' ' + this.getDate().grey + ' : ' + msg)
	},
	"error" : function(msg) {
		if(msg instanceof Object) {
			msg = JSON.stringify(msg) ;
		}
		console.log('error:'.red.bold + '   ' + this.getDate().grey + ' : ' + msg)
	},
	"alert" : function(msg) {
		if(msg instanceof Object) {
			msg = JSON.stringify(msg) ;
		}
		console.log('alert:'.red.bold + '   ' + this.getDate().grey + ' : ' + msg)
		//TODO send mail
	},
	"inspect" : function(object) {
		console.log('inspect:'.blue.bold + ' ' + this.getDate().grey + ' : ' + util.inspect(object,{colos:true}));
		//TODO send mail
	}
}

//return the Server class
module.exports.Instance = Instance ;

