/**
 *
 * ActionChooseAvatar class
 *
 * @author dbyzero
 * @date : 2013/09/14
 * 
 * */

var _      				=    require('underscore');
var crypto      		=    require('crypto');
var Log    				=    require('../utils/Log.js').Instance();
var MessageHandler 		=    require('../handler/MessageHandler.js');
var FactoryAvatar 		=    require('../factory/FactoryAvatar.js');

/**
 * Constructor
 */
var ActionChooseAvatar = function(){
	//stub
} ;

/**
 * Prototype methods
 */
ActionChooseAvatar.prototype = { 
	load : function(connection,e) {
		var _t = GLOBAL._t;
		if(e[_t.MESSAGE_CHARNAME] === null) {
			MessageHandler.sendErrorMessage(connection,'No avatar selected');
			Log.error('Session '+connection.sessionid+' didn\'t select an avatar');
			return;
		}

		GLOBAL.server.API.get('/session/'+connection.sessionid,function(err,req,res,sessionData) {
			if(err) throw err;
			GLOBAL.server.API.get('/avatar/byowner/'+sessionData.account,function(err,req,res,avatars) {
				if(err) throw err;
				var granted = false;
				var synchedAvatar = null;
				for(key in avatars){
					if(avatars[key].id === parseInt(e[_t.MESSAGE_CHAR])) {
						granted = true;
						synchedAvatar = avatars[key];
						break
					}
				}
				if(granted) {
					Log.info('Account '+sessionData.account.toString().yellow+' on session '+connection.sessionid+' use avatar '+synchedAvatar.name.toString().yellow+'('+synchedAvatar.id.toString().yellow+')');
					
					var avatar = null;
					FactoryAvatar.getById(parseInt(e[_t.MESSAGE_CHAR]))
						.then(function(newAvatar){
							avatar = newAvatar;

							// message[_t.ACTION] = _t.ACTION_CHOOSE_CHAR_OK;
							var message = {};
							message[_t.MESSAGE_CHAR] = avatar.getCleanData();

							//adding info game zone
							message[_t['MESSAGE_GAME_AREA_NAME']] = GLOBAL.server.scene.name;
							message[_t['MESSAGE_GAME_AREA_DOM_ID']] = GLOBAL.server.scene.domId;
							message[_t['MESSAGE_GAME_AREA_WIDTH']] = GLOBAL.server.scene.width;
							message[_t['MESSAGE_GAME_AREA_HEIGHT']] = GLOBAL.server.scene.height;
							message[_t['MESSAGE_GAME_AREA_BLOCKS']] = GLOBAL.server.scene.blocks;
							message[_t['MESSAGE_GAME_MAX_INSTANCE']] = GLOBAL.server.scene.maxInstance;
							message[_t['MESSAGE_GAME_MAX_USER']] = GLOBAL.server.scene.maxUser;
							GLOBAL.server.scene.addAvatar(connection.sessionid,avatar);

							message[_t.ACTION_SYNC] = server.scene.getCleanData(new Date().getTime());
							MessageHandler.sendMessage(connection, _t.ACTION_CHOOSE_CHAR_OK, message);
						},function(err){
							throw err;
						})
				} else {
					Log.alert('Session '+connection.sessionid+' ask for a forbidden avatar');
					MessageHandler.sendErrorMessage(connection,"unauthorized");
				}
			});
		});
	}
}

//return the ActionChooseAvatar class
module.exports = ActionChooseAvatar ;
