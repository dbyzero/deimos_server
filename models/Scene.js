	/**
	 *
	 * Scene class
	 *
	 * @author dbyzero
	 * @date : 2013/09/16
	 *
	 *
	 * */
	var _       				=	require('underscore');
	var events  				=	require("events");
	var crypto  				=	require('crypto');
	var util					=	require("util");
	var Log     				=	require('../utils/Log.js').Instance();
	var Vector2 				=	require('../utils/Vector2.js');
	var MessageHandler			=	require('../handler/MessageHandler.js');
	var Projectile 				=	require('../models/Projectile.js');
	var Physics					=	require('./Physics.js');
	var AttackZone 				=	require('../models/AttackZone.js');
	var FactoryProjectile		=	require('../factory/FactoryProjectile.js');
	var FactoryMonster			=	require('../factory/FactoryMonster.js');
	var FactoryItem				=	require('../factory/FactoryItem.js');

	var Scene = function(config, level) {
		this.items = {};
		this.avatars = {};
		this.monsters = {};
		this.projectiles = {};
		this.projectilesToCleanNextStep = [];
		this.attackZones = {};

		this.name = level.name;
		this.width = level.width;
		this.height = level.height;
		this.blocks = level.blocks;

		this.maxInstance = config.maxInstance;
		this.minDeltaSaveElement = config.minDeltaSaveElement;
		this.maxUser = config.maxUser;
	}

	util.inherits(Scene, events.EventEmitter);

	Scene.prototype.addAvatar = function(sessionid,avatar) {
		sessionid_hash = crypto.createHash('md5').update(sessionid).digest("hex");
		if(this.avatars[sessionid_hash] !== undefined) {
			Log.error('Avatar already on scene!');
			return;
		}

		this.avatars[sessionid_hash] = avatar;
	}

	Scene.prototype.removeAvatar = function(sessionid) {
		sessionid_hash = crypto.createHash('md5').update(sessionid).digest("hex");
		if(this.avatars[sessionid_hash] === undefined) {
			Log.error('Avatar not on scene!');
			return;
		} 
		delete this.avatars[sessionid_hash];
	}

	Scene.prototype.removeMonster = function(id) {
		delete this.monsters[id];
	}

	Scene.prototype.removeProjectile = function(id) {
		delete this.projectiles[id];
	}

	Scene.prototype.removeItems = function(id) {
		delete this.items[id];
	}

	Scene.prototype.update = function(dt, now){

		//update
		var keys,i,item,avatar,proj,mon;

		for(i=0;i<this.projectilesToCleanNextStep.length;i++) {
			proj = this.projectilesToCleanNextStep[i];
			this.projectilesToCleanNextStep.slice(proj.id,1);
			delete this.projectiles[proj.id];
		}

		keys = Object.keys(this.avatars);
		for(i=0;i<keys.length;i++) {
			avatar = this.avatars[keys[i]];
			avatar.update(dt, now);
		}
		keys = Object.keys(this.items);
		for(i=0;i<keys.length;i++) {
			item = this.items[keys[i]];
			item.update(dt, now);
		}
		keys = Object.keys(this.projectiles);
		for(i=0;i<keys.length;i++) {
			proj = this.projectiles[keys[i]];
			proj.update(dt, now);
		}
		keys = Object.keys(this.monsters);
		for(i=0;i<keys.length;i++) {
			mon = this.monsters[keys[i]];
			mon.update(dt, now);
		}
		keys = Object.keys(this.attackZones);
		for(i=0;i<keys.length;i++) {
			az = this.attackZones[keys[i]];
			if(az.update(dt, now) === false) {
				delete this.attackZones[keys[i]];
			}
		}

		//move
		keys = Object.keys(this.avatars);
		for(i=0;i<keys.length;i++) {
			avatar = this.avatars[keys[i]];
			avatar.move();
			avatar.adaptAnimation();
			// avatar.manageWaitingForces(now);
		}
		keys = Object.keys(this.items);
		for(i=0;i<keys.length;i++) {
			this.items[keys[i]].move();
		}
		keys = Object.keys(this.projectiles);
		for(i=0;i<keys.length;i++) {
			this.projectiles[keys[i]].move();
		}
		keys = Object.keys(this.monsters);
		for(i=0;i<keys.length;i++) {
			this.monsters[keys[i]].move();
		}
	}

	Scene.prototype.getCleanData = function(now) {
		var returnObj = {};
		var _t = GLOBAL._t;
		returnObj[_t.AVATARS] = {};
		returnObj[_t.ITEMS] = {};
		returnObj[_t.PROJECTILES] = {};
		returnObj[_t.MONSTERS] = {};

		var keys,i,objAvatar,objItem,projectile,monster;
		keys = Object.keys(this.avatars);
		for(i=0;i<keys.length;i++) {
			objAvatar = this.avatars[keys[i]];
			returnObj[_t.AVATARS][keys[i]] = objAvatar.getCleanData();
		}

		keys = Object.keys(this.items);
		for(i=0;i<keys.length;i++) {
			objItem = this.items[keys[i]];
			returnObj[_t.ITEMS][keys[i]] = objItem.getCleanData();
		}

		keys = Object.keys(this.projectiles);
		for(i=0;i<keys.length;i++) {
			projectile = this.projectiles[keys[i]];
			returnObj[_t.PROJECTILES][keys[i]] = projectile.getCleanData();
		}

		keys = Object.keys(this.monsters);
		for(i=0;i<keys.length;i++) {
			monster = this.monsters[keys[i]];
			returnObj[_t.MONSTERS][keys[i]] = monster.getCleanData();
		}

		return returnObj;
	};

	Scene.prototype.createAttackZone = function( position,size,ownerId,duration ) {
		var attackZone = new AttackZone(position,size,ownerId,duration);
		this.attackZones[attackZone.id] = attackZone;
		attackZone.syncToAllClient();
	}

	Scene.prototype.createProjectile = function(templateId, x, y, vx, vy, ownerId, color, orientation, callback ) {
		FactoryProjectile.getById(templateId,color,ownerId)
			.then(function(projectile){
				projectile.position.x = x;
				projectile.position.y = y;
				projectile.velocity.x = vx;
				projectile.velocity.y = vy;
				projectile.oriented = orientation;

				//check if it not inside a blocks at initial position
				keys = Object.keys(Object.keys(this.blocks));
				for(i=0;i<keys.length;i++) {
					element = this.blocks[keys[i]];
					if(element.type.type == 'plateform') {
						continue;
					}
					if(!element.size) {
						element.size = {
							'x':element.width,
							'y':element.height
						}
					}
					if(Physics.SquareCollision(element,projectile)) {
						delete projectile;
						return;
					}
				}
				this.projectiles[projectile.id] = projectile;
				projectile.syncToAllClient();
				callback(projectile);
			}.bind(this))
			.fail(function(err){
				throw err;
			}.bind(this));
	}

	Scene.prototype.createMonster = function(templateId, x, y, vx, vy, color, damage, name, orientation, callback ) {
		FactoryMonster.getById(templateId,color,name,damage)
			.then(function(monster){
				monster.position.x = x;
				monster.position.y = y;
				monster.velocity.x = vx;
				monster.velocity.y = vy;
				monster.oriented = orientation;

				this.monsters[monster.id] = monster;
				monster.syncToAllClient();
				callback(monster);
			}.bind(this))
			.fail(function(err){
				throw err;
			}.bind(this));
	}

	Scene.prototype.createItem = function(templateId, x, y, vx, vy, color, name, orientation, callback ) {
		var position = new Vector2(x,y);
		var velocity = new Vector2(vx,vy);
		var acceleration = new Vector2(0,0);
		FactoryItem.getById(templateId,color,name,orientation)
			.then(function(item){
				item.position.x = x;
				item.position.y = y;
				item.velocity.x = vx;
				item.velocity.y = vy;
				item.oriented = orientation;
				this.items[item.id] = item;
				item.syncToAllClient();
				callback(item);
			}.bind(this))
			.fail(function(err){
				throw err;
			});
	}

	Scene.prototype.destroyProjectile = function(projectile) {
		//if exsists
		if(!!this.projectiles[projectile.id]) {
			this.projectilesToCleanNextStep.push(projectile);
		}
	}

	//return the Avatar class
	module.exports = Scene ;