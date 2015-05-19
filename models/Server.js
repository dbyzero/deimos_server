/**
 *
 * Server Object
 *
 * @author dbyzero
 * @date : 2013/05/14
 * @description : Websocket module server
 * 
 * Emits : INITIALIZED, STARTED
 *
 * */

var _                   =   require('underscore');
var http                =   require('http');
var colors              =   require('colors');
var WebSocketServer     =   require('websocket').server;
var util                =   require('util');
var events              =   require('events');
var crypto              =   require('crypto');
var restify             =   require('restify');
var Scene               =   require('./Scene.js');
var Config              =   require('../Config.js');
var Loop                =   require('../utils/Loop.js');
var Log                 =   require('../utils/Log.js').Instance();
var ActionHandler       =   require('../handler/ActionHandler.js');
var MessageHandler      =   require('../handler/MessageHandler.js');


var Server = function() {

	if(typeof(GLOBAL.server) !== "undefined") {
		Log.error('Only one server can be instancied - @Server.js');
		return;
	}

	//array of connection
	this.connections = {};

	this.scene              = new Scene(Config.Scene);
	this.listen_port        = Config.Server.server_port;
	this.needSync           = false;
	this.lastUpdate         = null;
	this.lastSync           = null;
	this.lastAliveSync      = null;

	events.EventEmitter.call(this); 

	//to use it in connection methods
	var server = this;
	var _t = GLOBAL._t;

	/**
	 * Define Websocket Server 
	 * */
	this.httpServer = http.createServer();

	// add websocket componant to httpserver
	this.wsServer = new WebSocketServer({
		httpServer: this.httpServer
	});

	/**
	 * Manage websocket event
	 **/
	this.wsServer.on('request', function(request) {

		//for now alltime accept connections
		var connection = request.accept(null, request.origin);
		Log.info('Connection'.yellow + ' from ' + connection.remoteAddress + ' with protocol version ' + connection.webSocketVersion);

		//handle message
		connection.on('message', function(message) {
			if (message.type === 'utf8') {
				try {
					var messageParsed = JSON.parse(message.utf8Data);
					/**
					 * Lot of sanity check
					 * */
					if(messageParsed[_t.TRACE_ID] === undefined) {
						Log.error('no trace id');
						MessageHandler.sendErrorMessage(connection,'unauthorized') ;
						return ;
					}

					 //PAS SECURE !!! On ne check pas si la session existe!!
					if( messageParsed[_t.SESSION_ID] === undefined && 
						messageParsed[_t.ACTION] !== 'login' ) {
						Log.error('no session id and no auth action');
						MessageHandler.sendErrorMessage(connection,'unauthorized') ;
						return ;
					}

					//Load action
					if(ActionHandle.isAuthorized(connection)) {
						connection.currentTraceId = messageParsed[_t.TRACE_ID];
						ActionHandler.load(connection,messageParsed) ;
					}

				} catch (err) {
					Log.error(err +' '+ err.messageParsed);
					throw err ;
				}
			} else {
				MessageHandler.sendErrorMessage(connection,'Server message type is not UTF8') ;
			}
		});

		//note : errors trigg close event too
		connection.on('close', function(reason,description) {
			// delete session
			if(this.sessionid !== undefined) {
				var sessionid = this.sessionid;
				GLOBAL.server.API.del('/session/'+sessionid,function(err,result){
					if(err) {
						if(err.name === 'NotFoundError') {
							Log.warning('Session '+sessionid+' already removed !');
							return;
						}
						throw err;
					} 
					//remove session from scene, connection and connections list
					delete GLOBAL.server.connections[sessionid] ; 
					delete connection[sessionid] ;
					GLOBAL.server.scene.removeAvatar(sessionid);
					Log.info(connection.remoteAddress + ' logout from session '.green + sessionid) ;
					Log.info('Session '+ sessionid + ' is deleted') ;
					GLOBAL.server.needSync = true;
				});
			}
			Log.info(this.remoteAddress + " disconnected.".yellow + ', reason : ' + description);
		});

	});

}

util.inherits(Server, events.EventEmitter);

/**
 * Init method
 * */
Server.prototype.init = function() {
	
	//start websocket
	this.httpServer.listen(this.listen_port, function() {
		Log.success('Websocket binded'.green.bold);

		//Define and connect API
		Log.info('Connecting to API...');
		this.API = restify.createJsonClient({
			url: Config.API.url,
			agent:false,
			headers:{
				// connection:'close'
			}
		});
		Log.success('API connected'.green.bold);

		this.emit('INITIALIZED',this);
	}.bind(this));

};


Server.prototype.start = function() {
	this.API.del(encodeURI('/session/clean/'+this.scene.name),function(err,req,res,data){
			if(err) throw err;
		}.bind(this)
	);
	var _t = GLOBAL._t;
	this.loop = new Loop( 'main_loop', Config.Engine.MAIN_LOOP_DELAY, 0 ) ;

	/**
	 * GAME LOOP 
	 */
	var loopingFunction = function() {
		this.update();
	}

	this.loop.start(loopingFunction.bind(this)) ;
	this.emit('STARTED',this);

};


Server.prototype.update = function() {
	//we want precise integration, so we use spend time (not approximative loop time)
	if(this.lastUpdate === null)
	{
		this.lastUpdate = new Date().getTime();
	}
	var now = new Date().getTime();
	var dt = now - this.lastUpdate;
	this.scene.update(dt, now);
	this.lastUpdate += dt;

	//we can sync only if we are inside delay (reach max delay or ask a sync after min delay)
	if( (this.needSync && now - this.lastSync > Config.Engine.SYNCHRO_MIN_DELAY)
		|| now - this.lastAliveSync > Config.Engine.SYNCHRO_MAX_DELAY ) {

		this.syncScene();
	}
}

Server.prototype.syncScene = function() {
	var now = new Date().getTime();
	var message = {};
	message[_t.ACTION] = _t.ACTION_SYNC;
	message[_t.MESSAGE] = this.scene.getCleanData(now);
	MessageHandler.sendMessageToAll(message);
	this.needSync = false;
	this.lastSync = now;
	this.lastAliveSync = now;
}

//return the Server class
module.exports = Server;
