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
		this.move_speed = 42;
		this.jump_speed = 500;
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
		data[_t['MESSAGE_POSITION']].x		= parseFloat(this.position.x);
		data[_t['MESSAGE_POSITION']].y		= parseFloat(this.position.y);
		data[_t['MESSAGE_VELOCITY']]		= {};
		data[_t['MESSAGE_VELOCITY']].x		= parseFloat(this.velocity.x);
		data[_t['MESSAGE_VELOCITY']].y		= parseFloat(this.velocity.y);
		data[_t['MESSAGE_ACCELERATION']]	= {};
		data[_t['MESSAGE_ACCELERATION']].x	= this.acceleration.x;
		data[_t['MESSAGE_ACCELERATION']].y	= this.acceleration.y;
		data[_t['MESSAGE_SIZE']]			= this.size;
		data[_t['MESSAGE_SKIN']]			= this.skin;
		data[_t['MESSAGE_DELTASHOW']]		= this.deltashow;
		data[_t['MESSAGE_MASS']]			= this.mass;
		data[_t['MESSAGE_COLOR']]			= this.color;
		data[_t['MESSAGE_DAMAGE']]			= this.damage;
		data[_t['MESSAGE_CURRENT_HP']]		= this.currentHP;
		data[_t['MESSAGE_HP']]				= this.hp;
		data[_t['MESSAGE_MOVE_SPEED']]		= this.move_speed;
		data[_t['MESSAGE_JUMP_SPEED']]		= this.jump_speed;
		data[_t['MESSAGE_ANIMATION']] = {};
		data[_t['MESSAGE_ANIMATION']][_t['MESSAGE_DIRECTION']] = this.animation.direction;
		return data;
	}

	Monster.prototype.update = function(dt, now) {
		if(this.isLanded && parseInt(Math.random()*100) === 1) {
			this.velocity.y = -700 - parseInt(Math.random() * 700);
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
		if(this.velocity.x > 0) {
			this.oriented = 'left';
			this.animation.direction = 'left';
			this.velocity.x = -this.move_speed;
		} else {
			this.oriented = 'right';
			this.animation.direction = 'right';
			this.velocity.x = this.move_speed;
		}
		this.syncToAllClient();
	}


	Monster.prototype.syncToAllClient = function(e) {
		var _t = GLOBAL._t;
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