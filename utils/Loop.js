/**
 *
 * Loop Object
 *
 * @author dbyzero
 * @date : 2013/07/28
 * @description : Loop model
 * 
 * */

var async = require('async');
var Log = require('../utils/Log.js').Instance();

/**
 * Loop constructor
 * @params desc string 		Description of the loop, usefull for debug
 * @params delay int 		time in ms, wainting time between each loop
 * @params ttl int|optional	time in ms, Max time to loop before stopping
 * */
var Loop = function(desc,delay,ttl) {

	//default value for ttl
	ttl = typeof ttl !== 'undefined' ? ttl : 0;

	this.description = desc ;
	this.loopId = 0 ;
	this.lastUpdate = new Date().getTime() ;
	this.delay = delay ;
	this.active = false ;
	this.ttl = ttl ;
}

/**
 * Loop methods
 *
 * */
Loop.prototype = {
	"start" : function(loopedFunction) {
		this.active = true ;
        loopedFunction.bind(this) ;

        //loopiiiing
        (function loop(){
            loopedFunction();
            this.loopId = setTimeout(loop.bind(this),this.delay) ;
        }).call(this) ;

        //ttl manage
		if(this.ttl > 0) {
			var safeFunction = function(){
				if(this.active) {
					Log.warning('TTL reach for loop '+this.description) ;
					this.stop() ;
				}
			} ;
			setTimeout(safeFunction.bind(this),this.ttl) ;
		}
	},
	"stop" : function() {
		this.active = false ;
		clearTimeout(this.loopId) ;
	}
}

//return the Server class
module.exports = Loop ;
