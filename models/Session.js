/**
 *
 * Session class
 *
 * @author dbyzero
 * @date : 2013/07/29
 * 
 * */

var _              =    require('underscore');
var crypto         =    require('crypto');
var Log            =    require('../utils/Log.js').Instance();
var util           =    require("util");

var Session = function(data) {
	this.id = data.id;
	this.ip = data.ip;
	this.account = data.account;
	this.avatar = data.avatar;
	this.delta_time = 0;
}


//return the Session class
module.exports = Session ;

