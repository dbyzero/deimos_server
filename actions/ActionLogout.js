/**
 *
 * ActionLogout class
 *
 * @author dbyzero
 * @date : 2013/09/11
 * 
 * */

var _           =    require('underscore');
var crypto      =    require('crypto');
var Log         =    require('../utils/Log.js').Instance();

/**
 * Constructor
 */
var ActionLogout = function(){
	//stub
} ;

/**
 * Prototype methods
 */
ActionLogout.prototype = { 
	load : function(connection,action) {
		GLOBAL.server.removeSession(connection);
	}
}

//return the ActionLogout class
module.exports = ActionLogout ;

