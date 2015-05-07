	/**
	 *
	 * Item class
	 *
	 * @author dbyzero
	 * @date : 2014/11/25
	 *
	 * */

	var _						= require('underscore');
	var util					= require("util");
	var Element					= require('./Element.js');
	var Log						= require('../utils/Log.js').Instance();
	var Vector2					= require('../utils/Vector2.js');
	var MessageHandler			= require('../handler/MessageHandler.js');

	var lastId = 0;
	/**
	 * Constructor, we dont use any kind of DB to make monster, so lets go with the manual way
	 *
	 * */
	var Item = function(data) {
		Item.super_.call(this,data)

		this.id			= lastId++;
		this.kind		= data.kind;
		this.templateid	= data.templateId;
		this.color		= data.color;
		this.attack		= data.attack;
		this.type		= GLOBAL._t.MESSAGE_ITEM;
	}
	util.inherits(Item, Element);

	Item.prototype.getCleanData = function() {
		var _t = GLOBAL._t;
		var date = new Date().getTime();
		var data = {};
		data = {};
		data[_t['NAME']] = this.name;
		data[_t['ID']] = this.id;
		data[_t['MESSAGE_ELEMENT_ID']] = this.templateid;
		data[_t['MESSAGE_POSITION']] = {};
		data[_t['MESSAGE_POSITION']].x = parseInt(this.position.x);
		data[_t['MESSAGE_POSITION']].y = parseInt(this.position.y);
		data[_t['MESSAGE_VELOCITY']] = {};
		data[_t['MESSAGE_VELOCITY']].x = parseInt(this.velocity.x);
		data[_t['MESSAGE_VELOCITY']].y = parseInt(this.velocity.y);
		data[_t['MESSAGE_ACCELERATION']] = {};
		data[_t['MESSAGE_ACCELERATION']].x = this.acceleration.x;
		data[_t['MESSAGE_ACCELERATION']].y = this.acceleration.y;
		data[_t['MESSAGE_SIZE']] = this.size;
		data[_t['MESSAGE_SKIN']] = this.skin;
		data[_t['MESSAGE_DELTASHOW']] = this.deltashow;
		data[_t['MESSAGE_MASS']] = this.mass;
		data[_t['MESSAGE_COLOR']] = this.color;
		data[_t['MESSAGE_ORIENTATION']] = this.oriented;
		return data;
	}

	Item.prototype.update = function(dt, now) {
		Item.super_.prototype.update.call(this,dt,now);
	}

	Item.prototype.syncToAllClient = function(e) {
		var _t = GLOBAL._t;
		var message = {};
		message[_t['ACTION']] = _t['ACTION_SYNC_ITEM'];
		message[_t['MESSAGE']] = this.getCleanData();
		MessageHandler.sendMessageToAll(message);
	}

	Item.prototype.grabbed = function(grabber) {
		if(grabber.addItem(this)) {
			var _t = GLOBAL._t;
			var message = {};
			message[_t.ACTION] = _t.ACTION_ITEM_GRABBED;
			message[_t.MESSAGE] = {}
			message[_t.MESSAGE][_t['MESSAGE_ITEM']]				= this.id;
			message[_t.MESSAGE][_t['MESSAGE_TO']]				= grabber.id;
			message[_t.MESSAGE][_t['MESSAGE_TO_POSITION']]		= grabber.position;
			MessageHandler.sendMessageToAll(message);
			this.destroy();
		}
	}

	Item.prototype.destroy = function() {
		GLOBAL.server.scene.removeItems(this.id);
	},

	//return the Monster class
	module.exports = Item ;