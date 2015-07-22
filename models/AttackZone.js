	/**
	 *
	 * AttackZone class
	 *
	 * @author dbyzero
	 * @date : 2015/01/20
	 *
	 * */

	var events					= require("events");
	var Log						= require('../utils/Log.js').Instance();
	var MessageHandler			= require('../handler/MessageHandler.js');

	var lastId = 0;

	var AttackZone = function(position,size,ownerId,duration) {
		this.id = lastId++;
		this.position = position;
		this.size = size;
		this.ownerId = ownerId;
		this.duration = duration;
		this.damage = 1;
		this.name = "Attackzone "+this.id;
		this.lastUpdate = new Date().getTime();
		this.skipAvatars = [ownerId];
		this.skipMonsters = [];
		events.EventEmitter.call(this);
	}

	//to be element method complient ~~~ gruikyyyyyyy!
	AttackZone.prototype.isAttacking = function() {
		return false;
	}

	AttackZone.prototype.getCleanData = function() {
		var _t = GLOBAL._t;
		var data = {};
		data[_t['NAME']] = this.name;
		data[_t['MESSAGE_ELEMENT_ID']] = this.id;
		data[_t['MESSAGE_POSITION']] = this.position;
		data[_t['MESSAGE_SIZE']] = this.size;
		data[_t['MESSAGE_DURATION']] = this.duration;
		data[_t['MESSAGE_OWNER']] = this.ownerId;
		return data;
	}

	AttackZone.prototype.update = function(dt, now) {
		this.duration += (this.lastUpdate - new Date().getTime());
		if(this.duration < 0) {
			return false;
		}
	}

	AttackZone.prototype.syncToAllClient = function(e) {
		var _t = GLOBAL._t;
		// var message = {};
		// message[_t['ACTION']] = _t['ACTION_SYNC_ATTACK_ZONE'];
		// message[_t['MESSAGE']] = this.getCleanData();
		MessageHandler.sendMessageToAll(_t['ACTION_SYNC_ATTACK_ZONE'],this.getCleanData());
	}

	//return the Monster class
	module.exports = AttackZone ;