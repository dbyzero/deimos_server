	/**
	 *
	 * Monster class
	 *
	 * @author dbyzero
	 * @date : 2014/11/25
	 *
	 * */
	 	
	var _						= require('underscore');
	var util					= require("util");
	var Element					= require('./Element.js');
	var Avatar					= require('./Avatar.js');
	var Log						= require('../utils/Log.js').Instance();
	var Vector2					= require('../utils/Vector2.js');
	var MessageHandler			= require('../handler/MessageHandler.js');


	var lastId = 0;

	var Monster = function(data) {
		//call parent constructor
		Monster.super_.call(this,data)

		this.id			= ++lastId;
		this.templateid	= data.templateId;
		this.damage		= data.damage || 0;
		this.color		= data.color;
		this.hp			= data.hp;
		this.currentHP	= data.hp;
		this.attackRate	= 500;
		this.type		= "monster";
	}
	util.inherits(Monster, Element);

	Monster.prototype.destroy = function() {
		console.log('dead monster : '+this.name);
		GLOBAL.server.scene.removeMonster(this.id);
	},


	Monster.prototype.getCleanData = function() {
		var _t = GLOBAL._t;
		var date = new Date().getTime();
		var data = {};
		data = {};
		data[_t['NAME']]					= this.name;
		data[_t['ID']]						= this.id;
		data[_t['MESSAGE_ELEMENT_ID']]		= this.templateid;
		data[_t['MESSAGE_POSITION']]		= {};
		data[_t['MESSAGE_POSITION']].x		= parseInt(this.position.x);
		data[_t['MESSAGE_POSITION']].y		= parseInt(this.position.y);
		data[_t['MESSAGE_VELOCITY']]		= {};
		data[_t['MESSAGE_VELOCITY']].x		= parseInt(this.velocity.x);
		data[_t['MESSAGE_VELOCITY']].y		= parseInt(this.velocity.y);
		data[_t['MESSAGE_ACCELERATION']]	= {};
		data[_t['MESSAGE_ACCELERATION']].x	= this.acceleration.x;
		data[_t['MESSAGE_ACCELERATION']].y	= this.acceleration.y;
		data[_t['MESSAGE_SIZE']]			= this.size;
		data[_t['MESSAGE_SKIN']]			= this.skin;
		data[_t['MESSAGE_DELTASHOW']]		= this.deltashow;
		data[_t['MESSAGE_MASS']]			= this.mass;
		data[_t['MESSAGE_COLOR']]			= this.color;
		data[_t['MESSAGE_DAMAGE']]			= this.damage;
		data[_t['MESSAGE_ORIENTATION']]		= this.oriented;
		data[_t['MESSAGE_CURRENT_HP']]		= this.currentHP;
		data[_t['MESSAGE_HP']]				= this.hp;
		return data;
	}

	Monster.prototype.update = function(dt, now) {
		if(this.isLanded && parseInt(Math.random()*2) === 1) {
			this.velocity.y = -300-parseInt(Math.random()*700);
			this.syncToAllClient();
		}
		Monster.super_.prototype.update.call(this,dt,now);
	}

	Monster.prototype.onAreaCollision = function(collisionCoord, collisionElement) {
		//we want to change the default behavior so parent not called
		//to clean when we while stop tests
		// Monster.super_.prototype.onAreaCollision.call(this, collisionCoord, collisionElement);
		this.onBlockCollision(collisionCoord, collisionElement);
	};

	Monster.prototype.onBlockCollisionLeft = function(coordCollision,itemCollide) {
		//we want to change the default behavior so parent not called
		//to clean when we while stop tests
		// Monster.super_.prototype.onBlockCollisionLeft.call(this,coordCollision,itemCollide);
		this.onBlockCollisionLeftRight();
	}

	Monster.prototype.onBlockCollisionRight = function(coordCollision,itemCollide) {
		//we want to change the default behavior so parent not called
		//to clean when we while stop tests
		// Monster.super_.prototype.onBlockCollisionRight.call(this,coordCollision,itemCollide);
		this.onBlockCollisionLeftRight();
	}

	Monster.prototype.onAreaCollisionLeft = function() {
		//we want to change the default behavior so parent not called
		//to clean when we while stop tests
		// Monster.super_.prototype.onAreaCollisionLeft.call(this);
		this.onBlockCollisionLeftRight();
	}

	Monster.prototype.onAreaCollisionRight = function() {
		//we want to change the default behavior so parent not called
		//to clean when we while stop tests
		// Monster.super_.prototype.onAreaCollisionRight.call(this);
		this.onBlockCollisionLeftRight();
	}

	Monster.prototype.onBlockCollisionLeftRight = function() {
		this.velocity.x = -1*parseInt(this.velocity.x);
	}


	Monster.prototype.syncToAllClient = function(e) {
		var _t = GLOBAL._t;
		// var message = {};
		// message[_t['ACTION']] = _t['ACTION_SYNC_MONSTER'];
		// message[_t['MESSAGE']] = this.getCleanData();
		MessageHandler.sendMessageToAll(_t['ACTION_SYNC_MONSTER'], this.getCleanData());
	}


	Monster.prototype.onElementCollision = function(collisionElement) {
		Monster.super_.prototype.onElementCollision.call(this, collisionElement);
		if(collisionElement instanceof Avatar) {
			collisionElement.touched(this);
		}
	}

	//return the Monster class
	module.exports = Monster;