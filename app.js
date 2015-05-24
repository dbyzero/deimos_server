/**
 *
 * Main script
 *
 * @author dbyzero
 * @date : 2013/05/14
 * @description : main script
 * 
 * */

var Server			=	require('./models/Server.js');
var Log				=	require('./utils/Log.js').Instance();
var Config			=	require('./Config.js');
var Element			=	require('./models/Element.js');
var MessageHandler	=	require('./handler/MessageHandler.js');
var colors			=	require('colors');

try {
	//Network messages
	GLOBAL._t = MessageHandler.CODE[ Config.Network.compression ];

	//Start server
	GLOBAL.server = new Server() ;

	GLOBAL.server.init();

	GLOBAL.server.on('INITIALIZED',function(){
		server.start();
	}) ;

	GLOBAL.server.on('STARTED',function(){
		Log.success('Server started on port '+Config.Server.server_port+'!'.green);
	}) ;
} catch(e) {
	console.log("error catched in main script")
	console.log(e);
}
