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
config['localhost'].API.url = 'http://localhost:39999';
config['localhost'].Network = {};
config['localhost'].Network.compression = 'verbose'; // text | verbose
config['localhost'].Client = {};
//Square distance where the client is the authority (square to speed up calcs)
config['localhost'].Client.SQUARE_AUTHORITY_DISTANCE = 100*100;


//MOCKUP
config['localhost'].Scene.name = 'deimos test';
config['localhost'].Scene.domId = 'gamezone';
config['localhost'].Scene.regexUrl = 'http://localhost/deimos_client';
config['localhost'].Scene.width = 675;
config['localhost'].Scene.height = 500;
config['localhost'].Scene.blocks =  [  {       "position" : {  "x" : 349,      "y" : 349 },    "height" : 10,  "width" : 100,  "type" : {      "value" : 0,    "type" : "blocks" },    "id" : "block-1-by-id-testBlock",      "vertexTL" : {  "x" : 349,      "y" : 349 },    "vertexTR" : {  "x" : 449,      "y" : 349 },    "vertexBL" : {  "x" : 349,      "y" : 359 },    "vertexBR" : {  "x" : 449,      "y" : 359 } },  {       "position" : {         "x" : 100,      "y" : 400 },    "height" : 100,         "width" : 100,  "type" : {      "value" : 0,    "type" : "blocks" },    "id" : "block-2-by-id-testBlock2",      "vertexTL" : {  "x" : 100,      "y" : 400 },    "vertexTR" : {         "x" : 200,      "y" : 400 },    "vertexBL" : {  "x" : 100,      "y" : 500 },    "vertexBR" : {  "x" : 200,      "y" : 500 } },  {       "position" : {  "x" : 540,      "y" : 250 },    "height" : 200,         "width" : 100, "type" : {      "value" : 0,    "type" : "blocks" },    "id" : "block-3-by-id-testBlock3",      "vertexTL" : {  "x" : 540,      "y" : 250 },    "vertexTR" : {  "x" : 640,      "y" : 250 },    "vertexBL" : {  "x" : 540,      "y" : 450 },  "vertexBR" : {   "x" : 640,      "y" : 450 } },  {       "position" : {  "x" : 500,      "y" : 150 },    "height" : 50,  "width" : 200,  "type" : {      "value" : 0,    "type" : "plateform" },         "id" : "block-4-by-id-testBlock4",    "vertexTL" : {   "x" : 500,      "y" : 150 },    "vertexTR" : {  "x" : 700,      "y" : 150 },    "vertexBL" : {  "x" : 500,      "y" : 200 },    "vertexBR" : {  "x" : 700,      "y" : 200 } } ];

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


//MOCKUP
config['docker'].Scene.name = 'deimos test';
config['docker'].Scene.domId = 'gamezone';
config['docker'].Scene.regexUrl = 'http://localhost/deimos_client';
config['docker'].Scene.width = 675;
config['docker'].Scene.height = 500;
config['docker'].Scene.blocks =  [  {       "position" : {  "x" : 349,      "y" : 349 },    "height" : 10,  "width" : 100,  "type" : {      "value" : 0,    "type" : "blocks" },    "id" : "block-1-by-id-testBlock",      "vertexTL" : {  "x" : 349,      "y" : 349 },    "vertexTR" : {  "x" : 449,      "y" : 349 },    "vertexBL" : {  "x" : 349,      "y" : 359 },    "vertexBR" : {  "x" : 449,      "y" : 359 } },  {       "position" : {         "x" : 100,      "y" : 400 },    "height" : 100,         "width" : 100,  "type" : {      "value" : 0,    "type" : "blocks" },    "id" : "block-2-by-id-testBlock2",      "vertexTL" : {  "x" : 100,      "y" : 400 },    "vertexTR" : {         "x" : 200,      "y" : 400 },    "vertexBL" : {  "x" : 100,      "y" : 500 },    "vertexBR" : {  "x" : 200,      "y" : 500 } },  {       "position" : {  "x" : 540,      "y" : 250 },    "height" : 200,         "width" : 100, "type" : {      "value" : 0,    "type" : "blocks" },    "id" : "block-3-by-id-testBlock3",      "vertexTL" : {  "x" : 540,      "y" : 250 },    "vertexTR" : {  "x" : 640,      "y" : 250 },    "vertexBL" : {  "x" : 540,      "y" : 450 },  "vertexBR" : {   "x" : 640,      "y" : 450 } },  {       "position" : {  "x" : 500,      "y" : 150 },    "height" : 50,  "width" : 200,  "type" : {      "value" : 0,    "type" : "plateform" },         "id" : "block-4-by-id-testBlock4",    "vertexTL" : {   "x" : 500,      "y" : 150 },    "vertexTR" : {  "x" : 700,      "y" : 150 },    "vertexBL" : {  "x" : 500,      "y" : 200 },    "vertexBR" : {  "x" : 700,      "y" : 200 } } ];


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

console.log('Using configuration : ');
console.log(config[args['env']]);

module.exports = config[args['env']];