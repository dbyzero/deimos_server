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
var socketio            =   require('socket.io');
var util                =   require('util');
var events              =   require('events');
var crypto              =   require('crypto');
var restify             =   require('restify');
var Promise             =   require('promise');
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

	this.listen_port        = Config.Server.server_port;
	this.needSync           = false;
	this.lastUpdate         = null;
	this.lastSync           = null;
	this.lastAliveSync      = null;

	events.EventEmitter.call(this); 

	//to use it in connection methods
	var server = this;

}

util.inherits(Server, events.EventEmitter);

/**
 * Init method
 * */
Server.prototype.init = function() {

	/**
	 * Define Websocket Server 
	 * */
	this.httpServer = http.createServer();

	// add websocket componant to httpserver
	this.wsServer = socketio(this.httpServer);
	MessageHandler.setWebsocketServer(this.wsServer);

	/**
	 * Manage websocket event
	 **/
	this.wsServer.on('connection', function(socket) {

		//for now alltime accept connections
		Log.info('Connection'.yellow + ' from ' + socket.handshake.address);

		//bind action to socket
		// ActionHandle.bind(socket);

		//note : errors trigg close event too
		socket.on('disconnect', function(reason) {
			// delete session
			if(socket.sessionid !== undefined) {
				this.removeSession(socket);
			}
			Log.info(socket.handshake.address + " disconnected.".yellow);
		}.bind(this));

	}.bind(this));

};


Server.prototype.start = function() {
	//start websocket
	var gameLevel = process.env.SERVER_NAME;
	return new Promise(function(resolv,reject){
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

			//start game on level loaded
			this.API.get(encodeURI('/gamearea/byname/'+gameLevel),
				function(err,req,res){
					Log.info('Level : '+gameLevel);

					if(err) {
						reject(err);
						return;
					}
					this.scene = new Scene(Config, gameLevel);

					/**
					 * GAME LOOP 
					 */
					this.loop = new Loop( 'main_loop', Config.Engine.MAIN_LOOP_DELAY, 0 ) ;
					var loopingFunction = function() {
						this.update();
					}

					this.loop.start(loopingFunction.bind(this)) ;

					var levelData = JSON.parse(res.body);

					resolv({
						"width":levelData.width,
						"height":levelData.height,
						"areaDomID":levelData.areaDomID,
						"blocks":levelData.blocks
					});
				}.bind(this)
			);
		}.bind(this));
	}.bind(this))
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
	MessageHandler.sendMessageToAll(GLOBAL._t.ACTION_SYNC, this.scene.getCleanData(now));
	this.needSync = false;
	this.lastSync = now;
	this.lastAliveSync = now;
}

Server.prototype.removeSession = function(connection) {
	//remove session from scene, connection and connections list
	var sessionid = connection.sessionid
	delete GLOBAL.server.connections[sessionid] ; 
	delete connection[sessionid] ;
	GLOBAL.server.scene.removeAvatar(sessionid);
	Log.info(connection.handshake.address + ' logout from session '.green + sessionid) ;
	GLOBAL.server.needSync = true;
}

//return the Server class
module.exports = Server;
