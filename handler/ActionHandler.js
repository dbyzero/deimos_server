/**
 *
 * ActionHandler class
 *
 * @author dbyzero
 * @date : 2013/07/29
 * 
 * */

var _						=	require('underscore');
var crypto					=	require('crypto');
var Log						=	require('../utils/Log.js').Instance();
var ActionMove				=	require('../actions/ActionMove.js');
var ActionJump				=	require('../actions/ActionJump.js');
var ActionAuth				=	require('../actions/ActionAuth.js');
var ActionLogout			=	require('../actions/ActionLogout.js');
var ActionChooseAvatar		=	require('../actions/ActionChooseAvatar.js');
var ActionSync				=	require('../actions/ActionSync.js');
var ActionAttack			=	require('../actions/ActionAttack.js');
var ActionGetItemTemplate	=	require('../actions/ActionGetItemTemplate.js');
var ActionGoingDown			=	require('../actions/ActionGoingDown.js');

ActionHandle = {} ;

/**
 * check if an action is authorized
 * */

ActionHandle.isAuthorized = function(connection) {
	//@TODO
	return true ;
}


ActionHandle.load = function(connection,e) {
	try {
		connection.delta_time = new Date().getTime() - e[GLOBAL._t['DATE']];
		switch(e[GLOBAL._t['ACTION']]) {
			//connection action
			case GLOBAL._t['LOGIN'] :
				var auth = new ActionAuth();
				auth.load(connection,e);
				break ;
			case GLOBAL._t['ACTION_CHOOSE_CHAR'] :
				var chooseAvatar = new ActionChooseAvatar() ;
				chooseAvatar.load(connection,e) ;
				break ;
			case GLOBAL._t['ACTION_SYNC']:
				var sync = new ActionSync() ;
				sync.load(connection,e) ;
				break ;
			case GLOBAL._t['ACTION_LOGOUT']:
				var logout = new ActionLogout() ;
				logout.load(connection,e) ;
				break ;
			case GLOBAL._t['ACTION_MOVE_START']:
				var move = new ActionMove() ;
				move.load(connection,e) ;
				break;
			case GLOBAL._t['ACTION_MOVE_STOP']:
				var move = new ActionMove() ;
				move.load(connection,e) ;
				break;
			case GLOBAL._t['ACTION_JUMP']:
				var jump = new ActionJump() ;
				jump.load(connection,e) ;
				break;
			case GLOBAL._t['ACTION_ATTACK']:
				var attack = new ActionAttack() ;
				attack.load(connection,e) ;
				break;
			case GLOBAL._t['ACTION_GET_ITEM_TEMPLATE']:
				var attack = new ActionGetItemTemplate() ;
				attack.load(connection,e) ;
				break;
			case GLOBAL._t['ACTION_GOING_DOWN']:
				var goingDown = new ActionGoingDown() ;
				goingDown.load(connection,e, true) ;
				break;
			case GLOBAL._t['ACTION_GOING_DOWN_STOP']:
				var goingDown = new ActionGoingDown() ;
				goingDown.load(connection,e, false) ;
				break;
			default :
				Log.error('Unknow action '+e[GLOBAL._t['ACTION']]) ;
				break ;
		}
	} catch (err) {
		throw err;
		return false;
	}
}

//return the ActionHandle class
module.exports = ActionHandle ;
