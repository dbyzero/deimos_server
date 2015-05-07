/**
 *
 * Factory Projectile class
 *
 * @author dbyzero
 * @date : 2015/03/17
 * 
 * */

var _					= require('underscore');
var Q					= require('q');
var Log					= require('../utils/Log.js').Instance();
var Projectile			= require('../models/Projectile.js');
/**
 * Constructor
 */
var FactoryProjectile = {};

FactoryProjectile.getById = function(templateid, color, ownerId) {
	var deferred = Q.defer();
	GLOBAL.server.API.get('/itemtemplate/'+templateid,function(err,req,res,projectileData) {
		if(err) {
			deferred.reject(err);
		}
		projectileData.color		= color || 0;
		projectileData.ownerId		= ownerId || null;
		projectileData.templateId	= templateid || null;
		var projectile = new Projectile(projectileData);
		deferred.resolve(projectile);
	});
	return deferred.promise;
}

module.exports = FactoryProjectile;