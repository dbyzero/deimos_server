/**
 *
 * ActionMove class
 *
 * @author dbyzero
 * @date : 2013/09/02
 * 
 * */

var _      			=    require('underscore');
var crypto  		=    require('crypto');
var Log    			=    require('../utils/Log.js').Instance();
var Avatar     		=    require('../models/Avatar.js');
var UserMovement	=    require('../models/UserMovement.js');
var Vector2 		=    require('../utils/Vector2.js');
var Config 			=    require('../Config.js');
var MessageHandler	=    require('../handler/MessageHandler.js');

/**
 * Constructor
 */
var ActionMove = function() {
}

var _cancelledActions = [];

/**
 * Prototype methods
 */
ActionMove.prototype = { 
	load : function(connection,action) {
		var _t = GLOBAL._t;
		try {
			switch(action[_t['ACTION']]) {
				case _t['ACTION_MOVE_START']:
						var avatar_hash = crypto.createHash('md5').update(connection.sessionid).digest("hex");
						var avatar = GLOBAL.server.scene.avatars[avatar_hash];
						if(avatar === null) return;

						if(action[_t['MESSAGE']][_t['MESSAGE_MOVE_TYPE']] === _t['LEFT']) {
							var force = new Vector2(-1 * parseInt(avatar.move_speed), 0);
							avatar.oriented = 'left';
						} else {
							var force = new Vector2( parseInt(avatar.move_speed), 0);
							avatar.oriented = 'right';
						}
						if(_cancelledActions.indexOf(action[_t['MESSAGE']][_t['MESSAGE_MOVE_ID']]) === -1) {
							var mvt = new UserMovement(
								action[_t['MESSAGE']][_t['MESSAGE_MOVE_ID']],
								action[_t['MESSAGE']][_t['MESSAGE_MOVE_TYPE']], 
								parseInt(action[_t['MESSAGE']][_t['MESSAGE_MOVE_START']]) + parseInt(connection.delta_time), 
								force
							);
							avatar.addUserInputs(mvt);
							GLOBAL.server.needSync = true;
							avatar.clientPosition.x = action[_t['MESSAGE']][_t['MESSAGE_POSITION']].x;
							avatar.clientPosition.y = action[_t['MESSAGE']][_t['MESSAGE_POSITION']].y;
							avatar.fixPositionWithClient(action[GLOBAL._t['MESSAGE_POSITION']]);

							GLOBAL.server.update();
							avatar.syncToAllClient(action);
						} else {
							_cancelledActions.splice(_cancelledActions.indexOf(action[_t['MESSAGE']][_t['MESSAGE_MOVE_ID']]),1);
						}
					break;
				case _t['ACTION_MOVE_STOP']:
					var avatar_hash = crypto.createHash('md5').update(connection.sessionid).digest("hex");
					var avatar = server.scene.avatars[avatar_hash];
					if(avatar.userInputs[action[_t['MESSAGE']][_t['MESSAGE_MOVE_ID']]] !== undefined) {
						avatar.userInputs[action[_t['MESSAGE']][_t['MESSAGE_MOVE_ID']]].duration = action[_t['MESSAGE']][_t['MESSAGE_DURATION']];
					} else {
						_cancelledActions.push(action[_t['MESSAGE']][_t['MESSAGE_MOVE_ID']]);
					}
					
					GLOBAL.server.needSync = true;
					avatar.clientPosition.x = action[_t['MESSAGE']][_t['MESSAGE_POSITION']].x;
					avatar.clientPosition.y = action[_t['MESSAGE']][_t['MESSAGE_POSITION']].y;
					avatar.fixPositionWithClient(action[GLOBAL._t['MESSAGE_POSITION']]);
					
					GLOBAL.server.update();
					avatar.syncToAllClient(action);
					break;
				default:
					Log.error('Unknow move action '+action[_t['ACTION']]);
					break;
			}
		} catch (e) {
			Log.error('Erreur dans l\'action Action Move');
			Log.error(e+"");
		}
	}
}

//return the ActionHandle class
module.exports = ActionMove ;