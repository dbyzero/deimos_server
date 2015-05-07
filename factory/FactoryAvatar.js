/**
 *
 * Factory Avatar class
 *
 * @author dbyzero
 * @date : 2015/03/17
 * 
 * */

var _					= require('underscore');
var Q					= require('q');
var Log					= require('../utils/Log.js').Instance();
var Avatar 				= require('../models/Avatar.js');
/**
 * Constructor
 */
var FactoryAvatar = {};

FactoryAvatar.getById = function(id) {
	var deferred = Q.defer();
	GLOBAL.server.API.get('/avatar/'+id,function(err,req,res,avatarData) {
		if(err) {
			deferred.reject(err);
		}

		var avatar = new Avatar(avatarData);
		if(avatar.item_slot_right_hand instanceof Object) {
			var weaponId = avatar.item_slot_right_hand.id;
			GLOBAL.server.API.get('/itemtemplate/'+weaponId,function(err,req,res,armItemTemplate) {
				//clean the attack object to use better named attributs
				if(armItemTemplate.attack instanceof Object) {
					switch(armItemTemplate.attack.t) {
						case 'p' :
							GLOBAL.server.API.get('/itemtemplate/'+armItemTemplate.attack.i,function(err,req,res,projectileTemplate) {
								this.projectileTranslation.right.x = parseInt(this.size.x/2) + armItemTemplate.attack.deltashow.x + projectileTemplate.deltashow.x;
								this.projectileTranslation.right.y = armItemTemplate.attack.deltashow.y + projectileTemplate.deltashow.y;
								this.projectileTranslation.left.x = parseInt(this.size.x/2) - armItemTemplate.attack.deltashow.x + projectileTemplate.deltashow.x - projectileTemplate.size.x;
								this.projectileTranslation.left.y = armItemTemplate.attack.deltashow.y + projectileTemplate.deltashow.y;
								this.projectileTranslation.left.y = armItemTemplate.attack.deltashow.y + projectileTemplate.deltashow.y;
								this.attackProcess = {
									type:'projectile',
									projectileId:projectileTemplate.id,
									projectileColor:armItemTemplate.attack.c,
									frequency:armItemTemplate.f,
									initialX:armItemTemplate.attack.x,
									initialY:armItemTemplate.attack.y,
								}
								deferred.resolve(avatar);
							}.bind(this));
						break;
					}
				} else {
					deferred.resolve(avatar);
				}
			}.bind(avatar));
		} else {
			deferred.resolve(avatar);
		}
	});
	return deferred.promise;
}

module.exports = FactoryAvatar ;