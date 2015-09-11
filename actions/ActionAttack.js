/**
 *
 * ActionAttack class
 *
 * @author dbyzero
 * @date : 2014/03/27
 * 
 * */

var _					= require('underscore');
var crypto				= require('crypto');
var Log					= require('../utils/Log.js').Instance();
var Avatar				= require('../models/Avatar.js');
var Vector2				= require('../utils/Vector2.js');
var Config				= require('../Config.js');

/**
 * Constructor
 */
var ActionAttack = function() {}

/**
 * Prototype methods
 */
ActionAttack.prototype = { 
	load : function( connection, action ) {
		var avatar_hash = crypto.createHash('md5').update(connection.sessionid).digest("hex");
		var avatar = GLOBAL.server.scene.avatars[avatar_hash];
		if(avatar === null) return;
		avatar.clientPosition.x = action[_t.MESSAGE_POSITION].x;
		avatar.clientPosition.y = action[_t.MESSAGE_POSITION].y;
		avatar.fixPositionWithClient();
		avatar.attack();
	},
}

//return the ActionHandle class
module.exports = ActionAttack ;
