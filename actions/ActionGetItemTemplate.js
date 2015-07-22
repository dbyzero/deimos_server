/**
 *
 * ActionGetItemTemplate class
 *
 * @author dbyzero
 * @date : 2014/03/27
 * 
 * */

var _					= require('underscore');
var crypto				= require('crypto');
var Config				= require('../Config.js');
var Log					= require('../utils/Log.js').Instance();
var MessageHandler		= require('../handler/MessageHandler.js');
var FactoryItem			= require('../factory/FactoryItem.js');
/**
 * Constructor
 */
var ActionGetItemTemplate = function() {
}

/**
 * Prototype methods
 */
ActionGetItemTemplate.prototype = { 
	load : function( connection, action ) {
		var _t = GLOBAL._t;
		FactoryItem.getById(action[_t['MESSAGE']][_t['MESSAGE_ITEM_ID']],null)
			.then(function(item) {
				var itemTemplateToSync = ItemTemplateHandler.cleanToSync(item);
				// var message = {};
				// message[_t.ACTION] = _t.ACTION_GET_ITEM_TEMPLATE
				// message[_t.MESSAGE] = itemTemplateToSync;
				MessageHandler.sendMessage(connection, _t.ACTION_GET_ITEM_TEMPLATE, itemTemplateToSync);
			});
	}
}

//return the ActionHandle class
module.exports = ActionGetItemTemplate ;
