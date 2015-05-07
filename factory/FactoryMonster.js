/**
 *
 * Factory Monster class
 *
 * @author dbyzero
 * @date : 2015/03/17
 * 
 * */

var _					= require('underscore');
var Q					= require('q');
var Log					= require('../utils/Log.js').Instance();
var Monster				= require('../models/Monster.js');
/**
 * Constructor
 */
var FactoryMonster = {};

FactoryMonster.getById = function(templateid,color,name,damage) {
	var deferred = Q.defer();
	GLOBAL.server.API.get('/monstertemplate/'+templateid,function(err,req,res,monsterData) {
		if(err) {
			deferred.reject(err);
		}
		monsterData.templateId	= templateid	|| null;
		monsterData.name		= name			|| "";
		monsterData.color		= color			|| 0;
		monsterData.damage		= damage		|| 0;
		var monster = new Monster(monsterData);
		deferred.resolve(monster);
	});
	return deferred.promise;
}

module.exports = FactoryMonster;