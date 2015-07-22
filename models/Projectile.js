	/**
	 *
	 * Projectile class
	 *
	 * @author dbyzero
	 * @date : 2014/11/15
	 *
	 * */
	 	
	var _						= require('underscore');
	var util					= require("util");
	var Element					= require('./Element.js');
	var Monster					= require('./Monster.js');
	var Avatar					= require('./Avatar.js');
	var Log						= require('../utils/Log.js').Instance();
	var Vector2					= require('../utils/Vector2.js');
	var MessageHandler			= require('../handler/MessageHandler.js');


	var lastId = 0;
	/**
	 * Constructor, we dont use any kind of DB to make projectile, so lets go with the manual way
	 *
	 * */
	var Projectile = function(data) {
		//call parent constructor
		Projectile.super_.call(this,data)

		//Projectile specific datas
		this.templateId		= data.templateId;
		this.ownerId		= data.ownerId;
		this.skipAvatars	= this.ownerId ? [this.ownerId] : [];
		this.skipMonsters	= [];

		this.id		= ++lastId;
		this.damage	= data.damage	|| 0;
		this.color	= data.color	|| 0;

		this.collisionTypeEnabled['avatars'] = true;
		this.collisionTypeEnabled['monsters'] = true;
		this.collisionTypeEnabled['plateforme'] = false;
		this.type = GLOBAL._t.MESSAGE_PROJECTILE;
	}
	util.inherits(Projectile, Element);


	Projectile.prototype.getCleanData = function() {
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
		data[_t['MESSAGE_DAMAGE']] = this.damage;
		data[_t['MESSAGE_MASS']] = this.mass;
		data[_t['MESSAGE_OWNER']] = this.ownerId;
		data[_t['MESSAGE_COLOR']] = this.color;
		data[_t['MESSAGE_ORIENTATION']] = this.oriented;
		return data;
	}

	Projectile.prototype.onAreaCollision = function(collisionCoord, collisionElement) {
		this.onBlockCollision(collisionCoord, collisionElement);
	};

	Projectile.prototype.onBlockCollision = function(collisionCoord, collisionElement) {
		GLOBAL.server.scene.destroyProjectile(this);
	};


	Projectile.prototype.syncToAllClient = function(e) {
		var _t = GLOBAL._t;
		// var message = {};
		// message[_t['ACTION']] = _t['ACTION_SYNC_PROJECTILE'];
		// message[_t['MESSAGE']] = this.getCleanData();
		MessageHandler.sendMessageToAll(_t['ACTION_SYNC_PROJECTILE'], this.getCleanData());
	}


	Projectile.prototype.onElementCollision = function(collisionElement) {
		Projectile.super_.prototype.onElementCollision.call(this, collisionElement);
		collisionElement.touched(this);
	}

	//return the Projectile class
	module.exports = Projectile ;