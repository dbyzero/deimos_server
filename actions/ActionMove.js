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
	load : function(connection,action,_type) {
		var _t = GLOBAL._t;
		try {
			switch(_type) {
				case 'start':
						var avatar_hash = crypto.createHash('md5').update(connection.sessionid).digest("hex");
						var avatar = GLOBAL.server.scene.avatars[avatar_hash];
						if(avatar === null) return;

						if(action.type === _t['LEFT']) {
							var force = new Vector2(-1 * parseInt(avatar.move_speed), 0);
							avatar.oriented = 'left';
						} else {
							var force = new Vector2( parseInt(avatar.move_speed), 0);
							avatar.oriented = 'right';
						}

						//set userActions
						if(avatar.userActions.indexOf(action.type) !== -1) {
							var idx = avatar.userActions.indexOf(action.type);
							avatar.userActions.splice(idx,1);
						}
						avatar.userActions.push(action.type);

						if(_cancelledActions.indexOf(action[_t['MESSAGE_MOVE_ID']]) === -1) {
							var mvt = new UserMovement(
								action.id,
								action.type, 
								parseInt(action.startTimestamp),
								force
							);
							avatar.addUserInputs(mvt);
							GLOBAL.server.needSync = true;
							avatar.clientPosition.x = action[_t['MESSAGE_POSITION']].x;
							avatar.clientPosition.y = action[_t['MESSAGE_POSITION']].y;
							avatar.fixPositionWithClient();

							GLOBAL.server.update();
							avatar.syncToAllClient(action);
						} else {
							_cancelledActions.splice(_cancelledActions.indexOf(action[_t['MESSAGE_MOVE_ID']]),1);
						}
					break;
				case 'stop':
					// console.log(action);
					var avatar_hash = crypto.createHash('md5').update(connection.sessionid).digest("hex");
					var avatar = server.scene.avatars[avatar_hash];
					if(avatar.userInputs[action.id] !== undefined) {
						avatar.userInputs[action.id].duration = action.duration;
					} else {
						_cancelledActions.push(action.id);
					}

					//clean userAction
					if(avatar.userActions.indexOf(action.type) !== -1) {
						avatar.userActions.splice(avatar.userActions.indexOf(action.type),1);
					}

					GLOBAL.server.needSync = true;
					avatar.clientPosition.x = action[_t['MESSAGE_POSITION']].x;
					avatar.clientPosition.y = action[_t['MESSAGE_POSITION']].y;
					avatar.fixPositionWithClient(action[GLOBAL._t['MESSAGE_POSITION']]);
					
					GLOBAL.server.update();
					avatar.syncToAllClient(action);
					break;
				default:
					Log.error('WTF is '+ _type);
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