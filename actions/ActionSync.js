/**
 *
 * ActionSync class
 *
 * @author dbyzero
 * @date : 2013/09/02
 * 
 * */

var _      					= require('underscore');
var crypto  				= require('crypto');
var Log    					= require('../utils/Log.js').Instance();
var Avatar     				= require('../models/Avatar.js');
var UserMovement			= require('../models/UserMovement.js');
var Vector2 				= require('../utils/Vector2.js');
var Config 					= require('../Config.js');
var MessageHandler			= require('../handler/MessageHandler.js');


/**
 * Constructor
 */
var ActionSync = function() {
}

/**
 * Prototype methods
 */
ActionSync.prototype = { 
	load : function(connection,e) {
		try {
			var _t = GLOBAL._t;
			var avatar_hash = crypto.createHash('md5').update(connection.sessionid).digest("hex");
			var avatar = GLOBAL.server.scene.avatars[avatar_hash];
			if(avatar === null) return;

			//kind of lagproof
			avatar.clientPosition.x = e[_t.MESSAGE_POSITION].x;
			avatar.clientPosition.y = e[_t.MESSAGE_POSITION].y;
			avatar.fixPositionWithClient();
			avatar.saying 			= e[_t.MESSAGE_SAYING];

			if(avatar.saying === 'mmm') {
				for(var i=1;i>0;i--) {
					var names = ['Willy', 'Abel', 'Marc', 'Agustin', 'Spencer', 'Eli', 'Leopoldo', 'Refugio', 'Antonia', 'Sydney',
					'Brant', 'Bradly', 'Devon', 'Sammie', 'Numbers', 'Chi', 'Reggie', 'Alvin', 'Lou', 'Cristobal','Sid', 'Winford',
					'Elias', 'Donald', 'Val', 'Arthur', 'Tyrell', 'Nathanael', 'Ashley', 'Nolan', 'Lupe', 'Carlos', 'Thad', 'Michal',
					'Lamont', 'Mel', 'Modesto', 'Jack', 'Gino', 'Norris', 'Thomas', 'Gerardo', 'Colin', 'Quincy', 'Elmo', 'Bart',
					'Damon', 'Hiram', 'Kim', 'Jarvis'];
					var templateMonsterId = 1;
					GLOBAL.server.scene.createMonster(
						templateMonsterId,
						parseInt(Math.random()*650),
						parseInt(Math.random()*150),
						parseInt(Math.random()*20)+30,
						parseInt(Math.random()*100)+400*-1,
						parseInt(Math.random()*16581375).toString(16),
						10,
						names[parseInt(Math.random()*50)],
						avatar.oriented,
						function(){}
					);
				}
			}

			if(avatar.saying === 'i6') {
				var templateItemId = 6;
				GLOBAL.server.scene.createItem(
						templateItemId,
						parseInt(Math.random()*650),
						parseInt(Math.random()*150),
						0,
						0,
						parseInt(Math.random()*16581375).toString(16),
						"",
						"left",
						function(){}
					);
			}

			if(avatar.saying === 'i7') {
				var templateItemId = 7;
				GLOBAL.server.scene.createItem(
						templateItemId,
						parseInt(Math.random()*650),
						parseInt(Math.random()*150),
						0,
						0,
						parseInt(Math.random()*16581375).toString(16),
						"",
						"left",
						function(){}
					);
			}

			if(avatar.saying === 'i8') {
				var templateItemId = 8;
				GLOBAL.server.scene.createItem(
						templateItemId,
						parseInt(Math.random()*650),
						parseInt(Math.random()*150),
						0,
						0,
						parseInt(Math.random()*16581375).toString(16),
						"",
						"left",
						function(){}
					);
			}

			if(avatar.saying === 'i9') {
				var templateItemId = 9;
				GLOBAL.server.scene.createItem(
						templateItemId,
						parseInt(Math.random()*650),
						parseInt(Math.random()*150),
						0,
						0,
						parseInt(Math.random()*16581375).toString(16),
						"",
						"left",
						function(){}
					);
			}

			if(avatar.saying === 'i10') {
				var templateItemId = 10;
				GLOBAL.server.scene.createItem(
						templateItemId,
						parseInt(Math.random()*650),
						parseInt(Math.random()*150),
						0,
						0,
						parseInt(Math.random()*16581375).toString(16),
						"",
						"left",
						function(){}
					);
			}
			avatar.syncToAllClient(e);
		} catch (exp) {
			Log.error('Erreur dans l\'action Action Sync');
			Log.error(exp+"");
		}
	}
}

//return the ActionSync class
module.exports = ActionSync ;