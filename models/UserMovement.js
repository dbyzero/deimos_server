	/**
	 *
	 * UserMovement Object
	 *
	 * @author dbyzero
	 * @date : 2013/10/29
	 * @description : User movement force
	 *
	 **/

	var _       =    require('underscore');
	var Log     =    require('../utils/Log.js').Instance();


	/**
	 * User Movement constructor
	 * 
	 * @param Vector force
	 * @param string movement class of the movement type 
	 * 
	 **/

	var UserMovement = function (id, type, start, force) {
		this.id = id;
		this.movement = force;
		this.startTimestamp = start;
		this.durationIntegrated = 0;
		this.duration = null;
		this.type = type;
	}

	// UserMovement.lastid = 0;


	module.exports = UserMovement ;