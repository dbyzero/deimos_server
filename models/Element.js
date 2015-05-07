/**
 *
 * Element class_id: 'minion1.example.com',
 *
 * @author dbyzero
 * @date : 2014/03/19
 * 
 * */

var _						= require('underscore');
var util					= require("util");
var Log						= require('../utils/Log.js').Instance();
var Vector2					= require('../utils/Vector2.js');
var Config					= require('../Config.js');
var Physics					= require('./Physics.js');
var AttackZone				= require('./AttackZone.js');
var utils					= require("util");
var events					= require("events");
var MessageHandler			= require('../handler/MessageHandler.js');

var Element = function(data) {
	//element
	this.id				= data.id || null;
	this.position		= data.position				|| Vector2.getNullVector();
	this.velocity		= data.velocity				|| Vector2.getNullVector();
	this.acceleration	= data.acceleration			|| Vector2.getNullVector();
	this.size			= data.size					|| Vector2.getNullVector();
	this.deltashow		= data.deltashow			|| Vector2.getNullVector();
	this.animation		= data.animation			|| {'direction':'right'};
	this.oriented		= this.animation.direction	|| 'right';
	this.skin			= data.skin					|| null;
	this.mass			= data.mass					|| 1;
	this.visible		= true;
	this.toMove 		= Vector2.getNullVector();
	this.isLanded		= false;
	this.inMove			= false;
	this.isLanded		= false;
	this.goingDown		= false;
	this.landedBlock	= null;
	this.attackProcess	= {type:'default'};
	this.attackRate		= 100; // = 100ms
	this.lastAttack		= null;

	 //translation from entity origine to apply to a proejectile
	this.projectileTranslation	= {
		left : new Vector2(0,0),
		right : new Vector2(0,0)
		
	};

	//map to set with what elements are collidable
	this.collisionTypeEnabled = {};
	this.collisionTypeEnabled['blocks'] = true;
	this.collisionTypeEnabled['gameArea'] = true;
	this.collisionTypeEnabled['plateforme'] = true;

	this.collisionTypeEnabled['bonus'] = false;
	this.collisionTypeEnabled['projectiles'] = false;
	this.collisionTypeEnabled['monsters'] = false;
	this.collisionTypeEnabled['avatars'] = false;
	this.collisionTypeEnabled['attackZone'] = false;

	this.vertexTL = new Vector2(this.position.x,this.position.y);
	this.vertexTR = new Vector2(this.position.x + this.size.x,this.position.y);
	this.vertexBL = new Vector2(this.position.x,this.position.y + this.size.y);
	this.vertexBR = new Vector2(this.position.x + this.size.x,this.position.y + this.size.y);

	this.name = data.name || "";

	events.EventEmitter.call(this); 
}

util.inherits(Element, events.EventEmitter);

Element.prototype.destroy = function() {
	throw new Error('Destroy method not defined for '+this.name);
};

//abstract
Element.prototype.save = function() {
	throw new Error('Save method has to be implemented in inherited classes')
};

Element.prototype.adaptAnimation = function() {

	var movement = this.toMove;
	/**
	 * Change Animation
	 *
	 * */
	//if walk
	var new_animation = null;
	if(movement.x != 0 && this.isLanded == true) {
		if( this.oriented === 'right' ) {
			new_animation = Element.Animation.Type.WALK_RIGHT ;
		} else {
			new_animation = Element.Animation.Type.WALK_LEFT ;
		}

	//if fly
	} else if (this.isLanded == false){
		if( this.oriented === 'right' ) {
			new_animation = Element.Animation.Type.FLY_RIGHT ;
		} else {
			new_animation = Element.Animation.Type.FLY_LEFT ;
		}

	//if see
	} else {
		if( this.oriented === 'right' ) {
			new_animation = Element.Animation.Type.SEE_RIGHT ;
		} else {
			new_animation = Element.Animation.Type.SEE_LEFT ;
		}
	}


	if( this.animation.value != new_animation.value) {
		this.animation = new_animation;
		return true ;
	}

	return false;
}

Element.prototype.update = function(dt, now)
{
	//fly if we have a negative vertical deplacement OR we leave our blocks
	if((this.isLanded && this.velocity.y < 0) ||
		(!!this.landedBlock && (this.position.x + this.size.x < this.landedBlock.vertexTL.x || this.position.x > this.landedBlock.vertexTR.x ))) {
		this.unlanded();
	}

	//adding gravity if we are not landed or outside of our landed block
	if(!this.isLanded) {
		this.acceleration = Physics.GRAVITY.duplicate();
		this.acceleration.y *= this.mass;
	} else {
		this.acceleration.y = 0;
	}

	var returnIntegrate = Physics.integrateKM4(this.position,this.velocity,this.acceleration,dt/1000);
	var movement = returnIntegrate.dx;

	this.velocity.x += returnIntegrate.dv.x;
	this.velocity.y += returnIntegrate.dv.y;

	movement.x += this.velocity.x * dt/1000;
	movement.y += this.velocity.y * dt/1000;

	//move Element if forces are != 0
	if(parseInt(movement.x) !== 0 || parseInt(movement.y) !== 0) {
		this.toMove.add(movement);
	}
}

Element.prototype.move = function() {
	var zoneWidth = GLOBAL.server.scene.width;
	var zoneHeight = GLOBAL.server.scene.height;

	var currentMovement = this.toMove;
	if(this.collisionTypeEnabled['avatars']) this.checkElementCollision( currentMovement, GLOBAL.server.scene.avatars );
	if(this.collisionTypeEnabled['monsters']) this.checkElementCollision( currentMovement, GLOBAL.server.scene.monsters );
	if(this.collisionTypeEnabled['attackZone']) this.checkElementCollision( currentMovement, GLOBAL.server.scene.attackZones );
	if(this.collisionTypeEnabled['projectiles']) this.checkElementCollision( currentMovement, GLOBAL.server.scene.projectiles );

	// we stop here if we dont move,
	// we suppose area, blocks, bonus arent reacheable without moving
	if( this.toMove.lengthSquare() === 0 ) {
		return false;
	}
	var initialPosition = {x:this.position.x,y:this.position.y} ;

	//move Element
	this.position.x = this.position.x + currentMovement.x ;
	this.position.y = this.position.y + currentMovement.y ;

	//check collisoin with Zone
	if(this.position.x < 0) {
		this.position.x = 0 ;
		this.onAreaCollisionLeft();
	}
	if(this.position.x + this.size.x > zoneWidth) {
		this.position.x = parseInt(zoneWidth - this.size.x) ;
		this.onAreaCollisionRight();
	}
	if(this.position.y < 0) {
		this.position.y = 0 ;
		this.onAreaCollisionTop();
	}
	if(this.position.y + this.size.y > zoneHeight) {
		this.position.y = parseInt(zoneHeight - this.size.y) ;
		this.onAreaCollisionBottom();
	}

	//colision with bloacks
	if(this.collisionTypeEnabled['blocks']) this.checkBlocksCollision( currentMovement );
	if(this.collisionTypeEnabled['bonus']) this.checkElementCollision( currentMovement, GLOBAL.server.scene.items );

	//check if need to sync
	if( initialPosition.x - this.position.x != 0 || 
		initialPosition.y - this.position.y != 0
	) {
		this.onMove();
		this.inMove = true;
		this.toSave = true;
	} else {
		if(this.inMove === true) {
			this.onStop();
			this.inMove = false;
		}
	}
	this.toMove = Vector2.getNullVector();
}

Element.prototype.checkBlocksCollision = function( currentMovement ) {
	//check for collision
	var testCollision = null ;
	var blocks = GLOBAL.server.scene.blocks;
	var keys = Object.keys(blocks);
	var i,block;
	for(i = 0; i < keys.length; i++) {
		block = blocks[keys[i]];
		//do not check if we not collide on plateforme
		if(block.type.type == 'plateform' && !this.collisionTypeEnabled['plateforme']) continue;
		//collision from Element bottom
		//we dont check for collision if avatar go bottom and block is a plateform
		if(block.type.type != 'plateform' || (block.type.type == 'plateform' && this.goingDown == false)) {
			if(currentMovement.y > 0) {
				testCollision = Physics.SegmentsCollision(
					this.vertexBL,
					{x:this.position.x,y:this.position.y + this.size.y},
					block.vertexTL,
					block.vertexTR
				);
				
				if(testCollision !== false) {
					this.onBlockCollisionBottom(testCollision,block);
					continue;
				}

				testCollision = Physics.SegmentsCollision(
					this.vertexBR,
					{x:this.position.x + this.size.x, y:this.position.y + this.size.y},
					block.vertexTL,
					block.vertexTR
				);
				
				if(testCollision !== false) {
					this.onBlockCollisionBottom(testCollision,block);
					continue;
				}
			}
		}

		//we stop here for plateforme
		if(block.type.type == 'plateform') continue;

		//collision from Element top
		if(currentMovement.y < 0) {
			testCollision = Physics.SegmentsCollision(
				this.vertexTL,
				{x:this.position.x,y:this.position.y},
				block.vertexBL,
				block.vertexBR
			);
			
			if(testCollision !== false) {
				this.onBlockCollisionTop(testCollision,block);
				continue;
			}

			testCollision = Physics.SegmentsCollision(
				this.vertexTR,
				{x:this.position.x + this.size.x,y:this.position.y},
				block.vertexBL,
				block.vertexBR
			);
			
			if(testCollision !== false) {
				this.onBlockCollisionTop(testCollision,block);
				continue;
			}
		}

		//collision from Element left
		if(currentMovement.x < 0) {
			testCollision = Physics.SegmentsCollision(
				this.vertexTL,
				{x:this.position.x,y:this.position.y},
				block.vertexTR,
				block.vertexBR
			);
			
			if(testCollision !== false) {
				this.onBlockCollisionLeft(testCollision,block);
				continue;
			}

			testCollision = Physics.SegmentsCollision(
				this.vertexBL,
				{x:this.position.x,y:this.position.y + this.size.y},
				block.vertexTR,
				block.vertexBR
			);
			
			if(testCollision !== false) {
				this.onBlockCollisionLeft(testCollision,block);
				continue;
			}
		}

		//collision from Element right
		if(currentMovement.x > 0) {
			testCollision = Physics.SegmentsCollision(
				this.vertexTR,
				{x:this.position.x + this.size.x,y:this.position.y},
				block.vertexTL,
				block.vertexBL
			);
			
			if(testCollision !== false) {
				this.onBlockCollisionRight(testCollision,block);
				continue;
			}

			testCollision = Physics.SegmentsCollision(
				this.vertexBR,
				{x:this.position.x + this.size.x,y:this.position.y + this.size.y},
				block.vertexTL,
				block.vertexBL
			);
			
			if(testCollision !== false) {
				this.onBlockCollisionRight(testCollision,block);
				continue;
			}
		}
	}
}

Element.prototype.checkElementCollision = function( currentMovement, elements ) {
	//todo
	var testCollision = null;
	var keys = Object.keys(elements);
	var i,element;
	for(i = 0; i < keys.length; i++) {
		element = elements[keys[i]];
		//we skip forbidden avatars
		if( this.type == 'avatar' && 
			!!element.skipAvatars && 
			element.skipAvatars.indexOf(this.id) != -1
		){
			continue;
		}
		//we skip forbidden monsters
		if( this.type == 'monster' && 
			!!element.skipMonsters && 
			element.skipMonsters.indexOf(this.id) != -1
		){
			continue;
		}
		if( element.type == 'avatar' && 
			!!this.skipAvatars && 
			this.skipAvatars.indexOf(element.id) != -1
		){
			continue;
		}
		//we skip forbidden monsters
		if( element.type == 'monster' && 
			!!this.skipMonsters && 
			this.skipMonsters.indexOf(element.id) != -1
		){
			continue;
		}
		if(Physics.SquareCollision(this,element)) {
			this.onElementCollision(element);
		}
		//collision from avatar bottom
		// if(currentMovement.y > 0) {
		// 	testCollision = Physics.SegmentsCollision(
		// 		this.vertexBL,
		// 		{x:this.position.x,y:this.position.y + this.size.y},
		// 		element.vertexTL,
		// 		element.vertexTR
		// 	);
			
		// 	if(testCollision !== false) {
		// 		this.onElementCollisionBottom(testCollision,element);
		// 		continue;
		// 	}

		// 	testCollision = Physics.SegmentsCollision(
		// 		this.vertexBR,
		// 		{x:this.position.x + this.size.x,y:this.position.y + this.size.y},
		// 		element.vertexTL,
		// 		element.vertexTR
		// 	);
			
		// 	if(testCollision !== false) {
		// 		this.onElementCollisionBottom(testCollision,element);
		// 		continue;
		// 	}
		// }

		// //collision from avatar top
		// if(currentMovement.y < 0) {
		// 	testCollision = Physics.SegmentsCollision(
		// 		this.vertexTL,
		// 		{x:this.position.x,y:this.position.y},
		// 		element.vertexBL,
		// 		element.vertexBR
		// 	);
			
		// 	if(testCollision !== false) {
		// 		this.onElementCollisionTop(testCollision,element);
		// 		continue;
		// 	}

		// 	testCollision = Physics.SegmentsCollision(
		// 		this.vertexTR,
		// 		{x:this.position.x + this.size.x,y:this.position.y},
		// 		element.vertexBL,
		// 		element.vertexBR
		// 	);
			
		// 	if(testCollision !== false) {
		// 		this.onElementCollisionTop(testCollision,element);
		// 		continue;
		// 	}
		// }

		// //collision from avatar left
		// if(currentMovement.x < 0) {
		// 	testCollision = Physics.SegmentsCollision(
		// 		this.vertexTL,
		// 		{x:this.position.x,y:this.position.y},
		// 		element.vertexTR,
		// 		element.vertexBR
		// 	);
			
		// 	if(testCollision !== false) {
		// 		this.onElementCollisionLeft(testCollision,element);
		// 		continue;
		// 	}

		// 	testCollision = Physics.SegmentsCollision(
		// 		this.vertexBL,
		// 		{x:this.position.x,y:this.position.y + this.size.y},
		// 		element.vertexTR,
		// 		element.vertexBR
		// 	);
			
		// 	if(testCollision !== false) {
		// 		this.onElementCollisionLeft(testCollision,element);
		// 		continue;
		// 	}
		// }

		// //collision from avatar right
		// if(currentMovement.x > 0) {
		// 	testCollision = Physics.SegmentsCollision(
		// 		this.vertexTR,
		// 		{x:this.position.x + this.size.x,y:this.position.y},
		// 		element.vertexTL,
		// 		element.vertexBL
		// 	);
			
		// 	if(testCollision !== false) {
		// 		this.onElementCollisionRight(testCollision,element);
		// 		continue;
		// 	}

		// 	testCollision = Physics.SegmentsCollision(
		// 		this.vertexBR,
		// 		{x:this.position.x + this.size.x,y:this.position.y + this.size.y},
		// 		element.vertexTL,
		// 		element.vertexBL
		// 	);
			
		// 	if(testCollision !== false) {
		// 		this.onElementCollisionRight(testCollision,element);
		// 		continue;
		// 	}
		// }
	}
}

Element.prototype.onElementCollision = function(collisionElement) {
	//stub
	// console.log(this.name +' collide '+collisionElement.name);
},


Element.prototype.onElementCollisionRight = function(collisionElement) {
	this.onElementCollision(collisionElement);
}

Element.prototype.onElementCollisionLeft = function(collisionElement) {
	this.onElementCollision(collisionElement);
}

Element.prototype.onElementCollisionTop = function(collisionElement) {
	this.onElementCollision(collisionElement);
}

Element.prototype.onElementCollisionBottom = function(collisionElement) {
	this.onElementCollision(collisionElement);
}

Element.prototype.onMove = function() {
	this.vertexTL.x = this.position.x;
	this.vertexTL.y = this.position.y;
	this.vertexBL.x = this.position.x;
	this.vertexBL.y = this.position.y + this.size.y;
	this.vertexTR.x = this.position.x + this.size.x;
	this.vertexTR.y = this.position.y;
	this.vertexBR.x = this.position.x + this.size.x;
	this.vertexBR.y = this.position.y + this.size.y;
}

Element.prototype.onStop = function() {
	//stub
}

Element.prototype.onAreaCollision = function() {
	//stub
}

Element.prototype.onAreaCollisionRight = function() {
	this.velocity.x = 0;
	this.onAreaCollision();
}

Element.prototype.onAreaCollisionLeft = function() {
	this.velocity.x = 0;
	this.onAreaCollision();
}

Element.prototype.onAreaCollisionTop = function() {
	this.velocity.y = 0;
	this.onAreaCollision();
}

Element.prototype.onAreaCollisionBottom = function() {
	this.velocity.y = 0;
	this.onAreaCollision();
	this.landed(false);
}

Element.prototype.onBlockCollision = function(coordCollision,itemCollide) {
	//stub
}

Element.prototype.onBlockCollisionTop = function(coordCollision,itemCollide) {
	this.position.y = coordCollision.y;
	this.velocity.y = 0;
	this.onBlockCollision(coordCollision,itemCollide);
}

Element.prototype.onBlockCollisionBottom = function(coordCollision,itemCollide) {
	this.position.y = coordCollision.y - this.size.y;
	this.velocity.y = 0;
	this.landedBlock = itemCollide;
	this.landed(itemCollide);
	this.onBlockCollision(coordCollision,itemCollide);
}

Element.prototype.onBlockCollisionLeft = function(coordCollision,itemCollide) {
	this.position.x = coordCollision.x ;
	this.velocity.x = 0;
	this.onBlockCollision(coordCollision,itemCollide);
}

Element.prototype.onBlockCollisionRight = function(coordCollision,itemCollide) {
	this.position.x = coordCollision.x - this.size.x ;
	this.velocity.x = 0;
	this.onBlockCollision(coordCollision,itemCollide);
}

Element.prototype.onJustLand = function() {
	//stub
}

Element.prototype.onUnland = function() {
	//stub
}

Element.prototype.landed = function(element) {
	this.isLanded = true;
	this.landedBlock = element;
	this.onJustLand()
}

Element.prototype.unlanded = function() {
	this.isLanded = false;
	this.landedBlock = null;
	this.onUnland()
}

Element.prototype.isAttacking = function() {
	return (
		!!this.attackRate && //if has attack 
		(this.lastAttack + this.attackRate > new Date().getTime()) //and last attck in timer
	);
}

Element.prototype.attack = function() {
	if(!this.isAttacking()) {
		switch(this.attackProcess.type) {
			case "projectile":
				this.attackRanged();
				break;
			default:
				this.attackMelee();
				break;
		}
		this.lastAttack = new Date().getTime();
	} else {
		Log.info('Have to wait');
	}
}

Element.prototype.attackMelee = function() {
	var attackZone = GLOBAL.server.scene.createAttackZone(
		{
			'x':this.position.x + (this.oriented === 'right' ? this.size.x : -45),
		 	'y':this.position.y
		 },
		{'x':45,'y':50},
		this.id,
		150
	);
}

Element.prototype.attackRanged = function() {
	GLOBAL.server.scene.createProjectile(
		this.attackProcess.projectileId,
		this.position.x + (this.oriented === 'right' ? this.projectileTranslation.right.x : this.projectileTranslation.left.x),
		this.position.y + (this.oriented === 'right' ? this.projectileTranslation.right.y : this.projectileTranslation.left.y),
		(this.oriented === 'right' ? parseInt(this.attackProcess.initialX) : -1 * parseInt(this.attackProcess.initialX)),
		this.attackProcess.initialY,
		this.id,
		this.attackProcess.projectileColor,
		this.oriented,
		function(p) {
			this.lastAttack = new Date().getTime();
		}.bind(this)
	);
}

Element.prototype.touched = function(collisionElement) {
	//if we can apply damage and we are attacking, go for it!
	if(!collisionElement.isAttacking() && !!collisionElement.damage) {
		collisionElement.lastAttack = new Date().getTime();
		this.damaged(collisionElement);
	}
}

Element.prototype.damaged = function(collisionElement) {
	this.currentHP -= collisionElement.damage;
	var _t = GLOBAL._t;
	var message = {};
	message[_t.ACTION] = _t.ACTION_COLLIDE;
	message[_t.MESSAGE] = {}
	message[_t.MESSAGE][_t['MESSAGE_FROM']]			 =	collisionElement.id;
	message[_t.MESSAGE][_t['MESSAGE_FROM_TYPE']]	 =	collisionElement.type;
	message[_t.MESSAGE][_t['MESSAGE_FROM_POSITION']] =	collisionElement.position;
	message[_t.MESSAGE][_t['MESSAGE_TO']]			 =	this.id;
	message[_t.MESSAGE][_t['MESSAGE_TO_TYPE']] 		 =	this.type;
	message[_t.MESSAGE][_t['MESSAGE_TO_POSITION']]	 =	this.position;
	message[_t.MESSAGE][_t['MESSAGE_LANDED']] 		 =	this.isLanded;
	//synchro death
	if(this.currentHP <= 0) {
		message[_t.MESSAGE][_t['MESSAGE_IS_DEAD']] =	true;
		this.die();
	//or synchro lost HP
	} else {
		message[_t.MESSAGE][_t['MESSAGE_IS_DEAD']] =	false;
	}
	MessageHandler.sendMessageToAll(message);
	console.log(this.name+' lost '+collisionElement.damage+' hp! current hp : ('+this.currentHP+'/'+this.hp+')');
}

Element.prototype.die = function() {
	this.destroy();
}

/**
 * Type of animation
 * 
 * Different kind of animation types
 *
 **/
Element.Animation = {} ;
Element.Animation.Type = {
	WALK_RIGHT : {value: 0, type:'walk', direction:'right'},
	WALK_LEFT : {value: 1, type:'walk', direction:'left'},

	JUMP_RIGHT : {value: 2, type:'jump', direction:'right'},
	JUMP_LEFT : {value: 3, type:'jump', direction:'left'},
	
	SEE_RIGHT : {value: 4, type:'see', direction:'right'},
	SEE_LEFT : {value: 5, type:'see', direction:'left'},
	
	FLY_RIGHT : {value: 6, type:'fly', direction:'right'},
	FLY_LEFT : {value: 7, type:'fly', direction:'left'},
}

//return the Element class
module.exports = Element ;