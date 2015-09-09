	/**
	 *
	 * Avatar class
	 *
	 * @author dbyzero
	 * @date : 2013/09/05
	 *
	 * 
	 * */
	 	
	var _						= require('underscore');
	var util					= require("util");
	var Element					= require('./Element.js');
	var AttackZone				= require('./AttackZone.js');
	var FactoryItem				= require('../factory/FactoryItem.js');
	var Item					= require('./Item.js');
	var UserMovement			= require('./UserMovement.js');
	var Log						= require('../utils/Log.js').Instance();
	var Vector2					= require('../utils/Vector2.js');
	var Config					= require('../Config.js');
	var MessageHandler			= require('../handler/MessageHandler.js');

	var Avatar = function(data) {
		//call parent constructor
		Avatar.super_.call(this,data);
		
		//Avatar specific datas
		this.inventory				= data.inventory			|| [];
		this.agility				= data.agility				|| 0;
		this.intelligence			= data.intelligence			|| 0;
		this.focusing				= data.focusing				|| 0;
		this.magic					= data.magic				|| 0;
		this.mental					= data.mental				|| 0;
		this.willpower				= data.willpower			|| 0;
		this.strengh				= data.strengh				|| 0;
		this.hp						= data.hp					|| null;
		this.titleOwned				= data.titleOwned			|| [];
		this.titleSelected			= data.titleSelected		|| null;
		this.item_slot_chest		= data.item_slot_chest		|| null;
		this.item_slot_foot			= data.item_slot_foot		|| null;
		this.item_slot_head			= data.item_slot_head		|| null;
		this.item_slot_left_hand	= data.item_slot_left_hand	|| null;
		this.item_slot_right_hand	= data.item_slot_right_hand	|| null;
		this.move_speed				= data.move_speed			|| 0;
		this.jump_speed				= data.jump_speed			|| 0;
		this.rgba					= data.rgba					|| 0;
		
		this.toSave				= false;
		this.timestampLastSaved	= new Date().getTime() - 5000;
		this.currentHP			= (!!this.hp) ? this.hp : null;
		this.accountName		= data.account_name;
		this.clientPosition		= Vector2.getNullVector();
		this.sessionDeltaTime	= 0;
		this.clientIsAuthorithy	= false;
		// this.waitingForce		= []; //forces to add next update
		this.userInputs			= {}; //current user inputs
		this.userActions		= []; //current user inputs
		this.saying				= "" ;
		this.type				= GLOBAL._t.MESSAGE_AVATAR;

		this.collisionTypeEnabled['bonus'] = true;
		this.collisionTypeEnabled['attackZone'] = true;

	}
	util.inherits(Avatar, Element);

	Avatar.prototype.destroy = function(){
		//TODO
		Log.warning(this.name + ' is DEAD!');
	};

	Avatar.prototype.save = function(callback){
		//this to minimize save occurencies
		if(this.timestampLastSaved + GLOBAL.server.scene.minDeltaSaveElement < new Date().getTime()) {
			this.timestampLastSaved = new Date().getTime();
			GLOBAL.server.API.post(encodeURI('/avatar/'+this.id+'/position/'+this.position.x+'/'+this.position.y+'/'+this.animation.direction),function(err,result){
				if(err) throw err;
				if (typeof (callback) === 'function') {
					callback();
				}
			});
		}
	};

	Avatar.prototype.addUserInputs = function(mvt) {
		this.userInputs[mvt.id] = mvt ;
	};

	//adding force next step
	// Avatar.prototype.addForceNextStep = function(force) {
	// 	this.waitingForce.push(force) ;
	// };

	//mergin waiting forces
	// Avatar.prototype.manageWaitingForces = function(now) {
	// 	for(force in this.waitingForce) {
	// 		if(force.time > now) continue;
	// 		var daForce = this.waitingForce[force];
	// 		this.waitingForce.splice(this.waitingForce.indexOf(force),1);
	// 		this.velocity.x = this.velocity.x + daForce.vector.x;
	// 		this.velocity.y = this.velocity.y + daForce.vector.y;
	// 	}
	// };

	Avatar.prototype.update = function(dt, now) {

		//call standard movement with collision check
		Avatar.super_.prototype.update.call(this, dt, now);

		if(this.toSave) {
			this.save(function(){
				this.toSave = false;
			}.bind(this));
		}

		//adding user action through keyboard to the movement
		var movement = Vector2.getNullVector();
		for(id in this.userInputs) {
			var input = this.userInputs[id];
			//move input
			if(input.type === GLOBAL._t['LEFT'] || input.type === GLOBAL._t['RIGHT']) { 
				//if event not yet in timeline, we wait next update
				if(input.startTimestamp >= now) continue;

				//move it !
				movement.x = parseFloat(movement.x + input.movement.x * dt/1000 * Math.min(1,input.durationIntegrated/100));//to make possible small mvt
				movement.y = parseFloat(movement.y + input.movement.y * dt/1000);
				input.durationIntegrated = input.durationIntegrated + dt;

				//finish the interpolation
				if(input.duration !== null) {
					
					//hack if collision on x do not negative interpolate
					if(this.collisionOnX === true) {
						//@note : commented because problem on jump
						//input.duration = Math.max(input.durationIntegrated,input.duration);
					}
					var missingIntegration = input.duration - input.durationIntegrated;

					movement.x = parseFloat(movement.x + input.movement.x * missingIntegration/1000);
					movement.y = parseFloat(movement.y + input.movement.y * missingIntegration/1000);

					delete this.userInputs[id];
				}
			}

			//jump input
			if(input.type === 'jump_start') {
				if(input.startTimestamp > now) continue;
				this.velocity.y += input.movement.y;
				delete this.userInputs[id];
			}
		}

		movement.x = parseFloat(movement.x);
		movement.y = parseFloat(movement.y);
		this.toMove.add(movement);

		if( this.orientation === 'left' ) {
			if(this.serverPosition.x < this.position.x) {
				//the Math.min is used to not go through the server position
				this.toMove.x = -1 * Math.min(
					(this.move_speed * dt/1000),
					(this.position.x - this.serverPosition.x)
				);
			}
			if(this.serverPosition.x > this.position.x) {
				this.toMove.x = 0;
			}
		}
		if( this.orientation === 'right' ) {
			if(this.serverPosition.x > this.position.x) {
				//the Math.min is used to not go through the server position
				this.toMove.x = Math.min(
					(this.move_speed * dt/1000),
					(this.serverPosition.x - this.position.x)
				);
			}
			if(this.serverPosition.x < this.position.x) {
				// console.log('stop it');
				this.toMove.x = 0;
			}
		}
	};


	Avatar.prototype.syncToAllClient = function(e) {
		var _t = GLOBAL._t;
		MessageHandler.sendMessageToAll(_t['ACTION_SYNC_AVATAR'],this.getCleanData());
	}

	Avatar.prototype.onMove = function() {
		Avatar.super_.prototype.onMove.call(this);
		GLOBAL.server.needSync = true ;
	}

	Avatar.prototype.onStop = function() {
		GLOBAL.server.needSync = true ;
	}

	Avatar.prototype.onUnland = function() {
		this.syncToAllClient();
	}

	Avatar.prototype.getCleanData = function() {
		var _t = GLOBAL._t;
		var date = new Date().getTime();

		//adding user action through keyboard to the movement
		// for(id in this.userInputs) {
		// 	//we dont sync inputUser stopping
		// 	var inputUser = this.userInputs[id];
		// 	var input = {};

		// 	if(inputUser.duration !== null) continue;
		// 	input.i = input.id;
		// 	input.m = { 
		// 		'x' :inputUser.movement ? inputUser.movement.x : 0,
		// 		'y' :inputUser.movement ? inputUser.movement.y : 0
		// 	};
		// 	input.t = inputUser.startTimestamp;
		// 	input.s = inputUser.durationIntegrated;
		// 	input.d = inputUser.duration;
		// 	input.id = inputUser.movement.id
		// 	input.t = inputUser.type;
		// 	inputUserVelocity.push(input);
		// }

		// var sumWaitingForce = new Vector2(0,0);
		// for(id in this.waitingForce) {
		// 	var force = this.waitingForce[id]
		// 	sumWaitingForce.add(force.vector);
		// }
		var data = {};
		data = {};
		data[_t['NAME']] = this.name;
		data[_t['ID']] = this.id;
		data[_t['MESSAGE_GOING_DOWN']] = this.goingDown;
		data[_t['MESSAGE_POSITION']] = {};
		data[_t['MESSAGE_POSITION']].x = parseFloat(this.position.x);
		data[_t['MESSAGE_POSITION']].y = parseFloat(this.position.y);
		data[_t['MESSAGE_VELOCITY']] = {};
		data[_t['MESSAGE_VELOCITY']].x = (parseFloat(this.velocity.x)/* + parseFloat(sumWaitingForce.x)*/);
		data[_t['MESSAGE_VELOCITY']].y = (parseFloat(this.velocity.y)/* + parseFloat(sumWaitingForce.y)*/);
		data[_t['MESSAGE_ACCELERATION']] = {};
		data[_t['MESSAGE_ACCELERATION']].x = this.acceleration.x;
		data[_t['MESSAGE_ACCELERATION']].y = this.acceleration.y;
		data[_t['MESSAGE_SAYING']] = this.saying || '';
		data[_t['MESSAGE_USER_INPUT']] = this.userActions;
		data[_t['MESSAGE_SIZE']] = this.size;
		data[_t['MESSAGE_JUMP_SPEED']] = this.jump_speed;
		data[_t['MESSAGE_MOVE_SPEED']] = this.move_speed;
		data[_t['MESSAGE_ANIMATION']] = {};
		data[_t['MESSAGE_ANIMATION']][_t['MESSAGE_DIRECTION']] = this.animation.direction;
		data[_t['MESSAGE_TIMESTAMP']] = date - this.sessionDeltaTime;
		data[_t['MESSAGE_SKIN']] = this.skin;
		data[_t['MESSAGE_DELTASHOW']] = this.deltashow;
		data[_t['MESSAGE_CURRENT_HP']] = this.currentHP;
		data[_t['MESSAGE_HP']] = this.hp;
		data[_t['MESSAGE_LANDED']] = this.isLanded;
		data[_t['MESSAGE_MASS']] = this.mass;
		data[_t['ITEM_SLOT_HEAD']] = this.item_slot_head || null;
		data[_t['ITEM_SLOT_CHEST']] = this.item_slot_chest || null;
		data[_t['ITEM_SLOT_FOOT']] = this.item_slot_foot || null;
		data[_t['ITEM_SLOT_LEFT_HAND']] = this.item_slot_left_hand || null;
		data[_t['ITEM_SLOT_RIGHT_HAND']] = this.item_slot_right_hand || null;
		return data;
	}

	Avatar.prototype.fixPositionWithClient = function() {
		//kind of lagproof
		var deltaX = this.clientPosition.x - parseFloat(this.position.x);
		var deltaY = this.clientPosition.y - parseFloat(this.position.y);
		var squareHypothenus = deltaX*deltaX + deltaY*deltaY;
		if( squareHypothenus < Config.Client.SQUARE_AUTHORITY_DISTANCE ) {
			this.position.x = this.clientPosition.x;
			this.position.y = this.clientPosition.y;
			this.onMove();
		}
	}

	Avatar.prototype.onElementCollision = function(collisionElement) {
		Avatar.super_.prototype.onElementCollision.call(this, collisionElement);
		if(collisionElement instanceof Item) {
			collisionElement.grabbed(this);
			Log.info(this.name+' grab item '+collisionElement.id);
		}
		if(collisionElement instanceof AttackZone) {
			collisionElement.skipAvatars.push(this.id);
			this.touched(collisionElement);
		}
	}

	Avatar.prototype.addItem = function(item) {
		GLOBAL.server.API.post('/avatar/'+this.id+'/additem/'+item.templateid+'/'+item.color+'/'+item.kind,function(err,req,res,body){
			if(err) throw err;
			if(res.statusCode == 304) {
				Log.error('Inventory full for ' + this.name);
				return false;
			}
			this.inventory = item.inventory;
			Log.info('Inventory saved for '+this.name);
		}.bind(this))
		return true;
		// 	}
		// }

		
		return false;
	}

	//return the Avatar class
	module.exports = Avatar ;