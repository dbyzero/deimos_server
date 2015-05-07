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
		var sessionid = connection.sessionid;
		GLOBAL.server.API.del('/session/'+sessionid,function(err,result){
			if(err) {
				if(err.name === 'NotFoundError') {
					Log.warning('Session '+sessionid+' already removed !'.bold.yellow);
					return;
				}
				throw err;
			} 
			//remove session from scene, connection and connections list
			delete connection[sessionid] ;
			delete GLOBAL.server.connections[sessionid] ; 
			GLOBAL.server.scene.removeAvatar(sessionid);
			Log.info(connection.remoteAddress + ' logout from session '.green + sessionid) ;
			Log.info('Session '+ sessionid + ' is deleted') ;
			GLOBAL.server.needSync = true;
		});
	}
}

//return the ActionLogout class
module.exports = ActionLogout ;

