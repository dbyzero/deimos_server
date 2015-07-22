/**
 *
 * config Object
 *
 * @author dbyzero
 * @date : 2013/11/14
 * @description : Configuration file
 *
 * Depends on params --env
 *
 * */

var config= {};

/**************
/* LOCALHOST **
**************/

config['localhost'] = {};

config['localhost'].Engine = {};
config['localhost'].Engine.MAIN_LOOP_DELAY = 33; //40 = 25FPS, 33 = 33FPS, 20 = 50FPS, 
config['localhost'].Engine.SYNCHRO_MAX_DELAY = 9000;
config['localhost'].Engine.SYNCHRO_MIN_DELAY = 3000;
config['localhost'].Server = {};
config['localhost'].Server.server_port = 1337;
config['localhost'].Scene = {};
config['localhost'].Scene.maxInstance = 20;
config['localhost'].Scene.maxUser = 20;
config['localhost'].Scene.minDeltaSaveElement = 5000;
config['localhost'].API = {};
config['localhost'].API.url = 'http://localhost:1081';
config['localhost'].Network = {};
config['localhost'].Network.compression = 'verbose'; // text | verbose
config['localhost'].Client = {};
//Square distance where the client is the authority (square to speed up calcs)
config['localhost'].Client.SQUARE_AUTHORITY_DISTANCE = 100*100;

/**************
/* DOCKER **
**************/

config['docker'] = {};

config['docker'].Engine = {};
config['docker'].Engine.MAIN_LOOP_DELAY = 33; //40 = 25FPS, 33 = 33FPS, 20 = 50FPS, 
config['docker'].Engine.SYNCHRO_MAX_DELAY = 9000;
config['docker'].Engine.SYNCHRO_MIN_DELAY = 3000;
config['docker'].Server = {};
config['docker'].Server.server_port = 80;
config['docker'].Scene = {};
config['docker'].Scene.maxInstance = 20;
config['docker'].Scene.maxUser = 20;
config['docker'].Scene.minDeltaSaveElement = 5000;
config['docker'].API = {};
config['docker'].API.url = 'http://api:80';
config['docker'].Network = {};
config['docker'].Network.compression = 'verbose'; // text | verbose
config['docker'].Client = {};
//Sqaure distance where the client is the authority (square to speed up calcs)
config['docker'].Client.SQUARE_AUTHORITY_DISTANCE = 100*100;

//Script d'amalyse des arguments
var args = {};
for (var idx = process.argv.length - 1; idx >= 0; idx--) {
	var argumentRaw = process.argv[idx];
	//not a valid arg
	if(argumentRaw.substr(0,2) !== '--') continue;
	var argument = argumentRaw.split('=');
	if(argument.length === 1) {
		args[argument] = null;
	} else {
		args[argument[0].substr(2)] = argument[1];
	}
};

if(args['env'] === undefined) throw new Error('No environement specified');
if(config[args['env']] === undefined) throw new Error('Unknow environnement');
if(args['level'] === undefined) throw new Error('No level specified');

console.log('Using level : '+args['level']);
config[args['env']]['level'] = args['level'];

console.log('Using configuration : ');
console.log(config[args['env']]);

module.exports = config[args['env']];