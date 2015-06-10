/**
 *
 * ActionAuth class
 *
 * @author dbyzero
 * @date : 2013/09/07
 * 
 * */

var _				= require('underscore');
var crypto			= require('crypto');
var Log				= require('../utils/Log.js').Instance();
var MessageHandler	= require('../handler/MessageHandler.js');

/**
 * Constructor
 */
var ActionAuth = function(){
	//stub
} ;

/**
 * Prototype methods
 */
ActionAuth.prototype = { 
	load : function(connection,e) {
		var login = e[GLOBAL._t['MESSAGE']][GLOBAL._t['LOGIN']];
		var password = e[GLOBAL._t['MESSAGE']][GLOBAL._t['PASSWORD']];
		var current_url = e[GLOBAL._t['MESSAGE']][GLOBAL._t['MESSAGE_CURRENT_URL']];

		if(!(_.isString(login) && _.isString(password))) {
			MessageHandler.sendErrorMessage(connection,'unauthorized') ;
			Log.error('Action auth, login and pass are not both string') ;
			return;
		}

		GLOBAL.server.API.post(encodeURI('/account/register/'+login+'/'+password), function(err, req, res, result) {
			if(err !== null) {
				console.log('API Error'.red+' : '+err+''.bold)
				MessageHandler.sendErrorMessage(connection,err.body) ;
				return;
			}
			var sessionid = obj.sessionid;
			processLoginSuccess(sessionid, result, connection);
		});
	},

	loadByToken : function(connection,e) {
		var sessionid = e[GLOBAL._t['SESSION_ID']];

		if(!(_.isString(sessionid))) {
			MessageHandler.sendErrorMessage(connection,'unauthorized') ;
			Log.error('Action auth, sessionID not a string') ;
			return;
		}

		GLOBAL.server.API.post(encodeURI('/account/registerbytoken/'+sessionid), function(err, req, res, result) {
			if(err !== null) {
				console.log('API Error'.red+' : '+err+''.bold + ' token:'+sessionid);
				MessageHandler.sendErrorMessage(connection,err.body) ;
				return;
			}
			//register session
			processLoginSuccess(sessionid, result, connection);
		});
	}
}

processLoginSuccess = function(sessionid, result, connection) {
	var login = result.account;

	//register session
	connection.sessionid = sessionid;
	GLOBAL.server.connections[sessionid] = connection;

	//specify to connection we are logged and send avatar list
	var responce = {};
	responce[GLOBAL._t['ACTION']] = GLOBAL._t['ACTION_LOGGED_OK'];
	responce[GLOBAL._t['MESSAGE']] = {};
	responce[GLOBAL._t['MESSAGE']][GLOBAL._t['SESSION_ID']] = sessionid;

	GLOBAL.server.API.get('/avatar/byowner/'+login, function(err, req, res, obj) {
		if(err !== null) {
			// console.log('API Error'.red+' : '+err+''.bold)
			MessageHandler.sendErrorMessage(connection,err.body) ;
			return;
		}
		var avatars = [];
		var cur_avatar = null;
		for(avatar in obj) {
			cur_avatar = obj[avatar];
			var avatar = {};
			avatar[GLOBAL._t['ID']] = cur_avatar.id,
			avatar[GLOBAL._t['NAME']] = cur_avatar.name,
			avatar[GLOBAL._t["MESSAGE_SIZE"]] = cur_avatar.size,
			avatar[GLOBAL._t["MESSAGE_POSITION"]] = cur_avatar.position,
			avatar[GLOBAL._t["MESSAGE_VELOCITY"]] = cur_avatar.velocity,
			avatar[GLOBAL._t["MESSAGE_ACCELERATION"]] = cur_avatar.acceleration
			avatars.push(avatar);
		}
		responce[GLOBAL._t['MESSAGE']][GLOBAL._t['AVATARS']] = avatars;

		//adding info game zone
		responce[GLOBAL._t['MESSAGE']][GLOBAL._t['MESSAGE_GAME_AREA_NAME']] = GLOBAL.server.scene.name;
		responce[GLOBAL._t['MESSAGE']][GLOBAL._t['MESSAGE_GAME_AREA_DOM_ID']] = GLOBAL.server.scene.domId;
		responce[GLOBAL._t['MESSAGE']][GLOBAL._t['MESSAGE_GAME_AREA_WIDTH']] = GLOBAL.server.scene.width;
		responce[GLOBAL._t['MESSAGE']][GLOBAL._t['MESSAGE_GAME_AREA_HEIGHT']] = GLOBAL.server.scene.height;
		responce[GLOBAL._t['MESSAGE']][GLOBAL._t['MESSAGE_GAME_AREA_BLOCKS']] = GLOBAL.server.scene.blocks;
		responce[GLOBAL._t['MESSAGE']][GLOBAL._t['MESSAGE_GAME_MAX_INSTANCE']] = GLOBAL.server.scene.maxInstance;
		responce[GLOBAL._t['MESSAGE']][GLOBAL._t['MESSAGE_GAME_MAX_USER']] = GLOBAL.server.scene.maxUser;

		MessageHandler.sendMessage(connection,responce);
	});
}

//return the ActionAuth class
module.exports = ActionAuth ;
