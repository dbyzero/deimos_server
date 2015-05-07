/**
 *
 * Factory Item class
 *
 * @author dbyzero
 * @date : 2015/03/20
 * 
 * */

var _					= require('underscore');
var Q					= require('q');
var Log					= require('../utils/Log.js').Instance();
var Item				= require('../models/Item.js');
/**
 * Constructor
 */
var FactoryItem = {};

FactoryItem.getById = function(templateid,color) {
	var deferred = Q.defer();
	GLOBAL.server.API.get('/itemtemplate/'+templateid,function(err,req,res,itemData) {
		if(err) {
			deferred.reject(err);
		}
		itemData.templateId	= templateid	|| null;
		itemData.color		= color			|| 0;
		var item = new Item(itemData);
		
		deferred.resolve(item);
	});
	return deferred.promise;
}

FactoryItem.getTemplateById = function(templateid) {
	var deferred = Q.defer();
	GLOBAL.server.API.get('/itemtemplate/'+templateid,function(err,req,res,itemData) {
		if(err) {
			deferred.reject(err);
		}
		deferred.resolve(itemData);
	});
	return deferred.promise;
}

module.exports = FactoryItem;