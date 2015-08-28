// ActionGoingDown
/**
 *
 * ActionGoingDown class
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
var ActionGoingDown = function() {
}

/**
 * Prototype methods
 */
ActionGoingDown.prototype = { 
	load : function( connection, action, status ) {
		var _t = GLOBAL._t;
		var avatar_hash = crypto.createHash('md5').update(connection.sessionid).digest("hex");
		var avatar = GLOBAL.server.scene.avatars[avatar_hash];
		if(avatar === null) return;

		avatar.goingDown = status;

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
module.exports = ActionGoingDown ;
