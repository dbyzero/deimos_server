/**
 *
 * ActionJump class
 *
 * @author dbyzero
 * @date : 2013/09/29
 * 
 * */

var _      			=    require('underscore');
var crypto  		=    require('crypto');
var Log    			=    require('../utils/Log.js').Instance();
var Avatar     		=    require('../models/Avatar.js');
var Element     	=    require('../models/Element.js');
var UserMovement	=    require('../models/UserMovement.js');
var Vector2 		=    require('../utils/Vector2.js');
var Config 			=    require('../Config.js');

/**
 * Constructor
 */
var ActionJump = function() {
}

/**
 * Prototype methods
 */
ActionJump.prototype = { 
	load : function( connection, action ) {

		var _t = GLOBAL._t;
		var avatar_hash = crypto.createHash('md5').update(connection.sessionid).digest("hex");
		var avatar = GLOBAL.server.scene.avatars[avatar_hash];
		if(avatar === null) return;

		// var force = new Vector2( 0, -1 * parseInt(avatar.jump_speed));
		// var forceToApply = {
		// 	"vector":force,
		// 	"time":parseInt(action[_t['MESSAGE_MOVE_START']]) + parseInt(connection.delta_time)
		// }
		// avatar.addForceNextStep(forceToApply);

		avatar.velocity.y -= parseInt(avatar.jump_speed);

		// var newAction = {
		// 	'position':action[_t['MESSAGE_POSITION']],
		// 	'type':'jump',
		// 	'force':force,
		// 	'time':new Date().getTime()
		// };
		//todo ? forcer le point de depart sur le client !

		avatar.clientPosition.x = action[_t['MESSAGE_POSITION']].x;
		avatar.clientPosition.y = action[_t['MESSAGE_POSITION']].y;
		avatar.fixPositionWithClient(action.position);

		avatar.unlanded();
		GLOBAL.server.update();
		avatar.syncToAllClient(action);
		GLOBAL.server.needSync = true;
	}
}

//return the ActionHandle class
module.exports = ActionJump ;
