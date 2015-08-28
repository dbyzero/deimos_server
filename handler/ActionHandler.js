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

ActionHandle.isAuthorized = function(socket) {
	//@TODO
	return true ;
}


ActionHandle.bind = function(socket) {
	socket.on(GLOBAL._t['LOGIN'], function(message) {
		var auth = new ActionAuth();
		auth.load( socket, message );
	});
	socket.on( GLOBAL._t['AUTH_BY_TOKEN'], function(message) {
		var auth = new ActionAuth();
		auth.loadByToken( socket, message );
	});
	socket.on( GLOBAL._t['ACTION_CHOOSE_CHAR'], function(message) {
		var chooseAvatar = new ActionChooseAvatar() ;
		chooseAvatar.load( socket, message ) ;
	});
	socket.on( GLOBAL._t['ACTION_SYNC'], function(message) {
		var sync = new ActionSync() ;
		sync.load( socket, message ) ;
	});
	socket.on( GLOBAL._t['ACTION_LOGOUT'], function(message) {
		var logout = new ActionLogout() ;
		logout.load( socket, message ) ;
	});
	socket.on( GLOBAL._t['ACTION_MOVE_START'], function(message) {
		var move = new ActionMove() ;
		move.load( socket, message, 'start' ) ;
	});
	socket.on( GLOBAL._t['ACTION_MOVE_STOP'], function(message) {
		var move = new ActionMove() ;
		move.load( socket, message, 'stop' ) ;
	});
	socket.on( GLOBAL._t['ACTION_JUMP'], function(message) {
		var jump = new ActionJump() ;
		jump.load( socket, message ) ;
	});
	socket.on( GLOBAL._t['ACTION_ATTACK'], function(message) {
		var attack = new ActionAttack() ;
		attack.load( socket, message ) ;
	});
	socket.on( GLOBAL._t['ACTION_GET_ITEM_TEMPLATE'], function(message) {
		var attack = new ActionGetItemTemplate() ;
		attack.load( socket, message ) ;
	});
	socket.on( GLOBAL._t['ACTION_GOING_DOWN'], function(message) {
		var goingDown = new ActionGoingDown() ;
		goingDown.load( socket, message, true ) ;
	});
	socket.on( GLOBAL._t['ACTION_GOING_DOWN_STOP'], function(message) {
		var goingDown = new ActionGoingDown() ;
		goingDown.load( socket, message, false ) ;
	});
}

//return the ActionHandle class
module.exports = ActionHandle ;
