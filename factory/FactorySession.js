/**
 *
 * Factory Session class
 *
 * @author dbyzero
 * @date : 2015/03/20
 * 
 * */

var _					= require('underscore');
var Q					= require('q');
var Log					= require('../utils/Log.js').Instance();
var Session				= require('../models/Session.js');

/**
 * Constructor
 */
var FactorySession = {};

FactorySession.getById = function(id) {
	var deferred = Q.defer();
	GLOBAL.server.API.get('/session/'+id,function(err,req,res,sessionData) {
		if(err) {
			deferred.reject(err);
		}

		var session = new Session(sessionData);
		deferred.resolve(session);
	});
	return deferred.promise;
}

module.exports = FactorySession;