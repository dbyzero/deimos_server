/**
 *
 * Config Object
 *
 * @author dbyzero
 * @date : 2013/11/14
 * @description : Configuration file
 * 
 * */

 var Config = {};

/**
 * ENGINE
 * */
Config.Engine = {};
Config.Engine.MAIN_LOOP_DELAY = 33; //40 = 25FPS, 33 = 33FPS, 20 = 50FPS, 
Config.Engine.SYNCHRO_MAX_DELAY = 9000; //40 = 25FPS, 33 = 33FPS, 20 = 50FPS, 
Config.Engine.SYNCHRO_MIN_DELAY = 3000; //40 = 25FPS, 33 = 33FPS, 20 = 50FPS, 

Config.Server = {};
Config.Server.server_port = 1337;

Config.Scene = {};
Config.Scene.maxInstance = 20;
Config.Scene.maxUser = 20;
Config.Scene.minDeltaSaveElement = 5000;
Config.Scene.name = 'deimos test';
Config.Scene.domId = 'gamezone';
Config.Scene.regexUrl = 'http://localhost/deimos_client';

Config.API = {};
Config.API.url = 'http://localhost:39999/';

/**
 * Network
 * */
Config.Network = {};
Config.Network.compression = 'verbose'; // text | verbose

/**
 * CLIENT
 * */ 
Config.Client = {};
//Square distance where the client is the authority (square to speed up calcs)
Config.Client.SQUARE_AUTHORITY_DISTANCE = 100*100;




//MOCKUP
Config.Scene.width = 675;
Config.Scene.height = 500;
Config.Scene.blocks =  [  {       "position" : {  "x" : 349,      "y" : 349 },    "height" : 10,  "width" : 100,  "type" : {      "value" : 0,    "type" : "blocks" },    "id" : "block-1-by-id-testBlock",      "vertexTL" : {  "x" : 349,      "y" : 349 },    "vertexTR" : {  "x" : 449,      "y" : 349 },    "vertexBL" : {  "x" : 349,      "y" : 359 },    "vertexBR" : {  "x" : 449,      "y" : 359 } },  {       "position" : {         "x" : 100,      "y" : 400 },    "height" : 100,         "width" : 100,  "type" : {      "value" : 0,    "type" : "blocks" },    "id" : "block-2-by-id-testBlock2",      "vertexTL" : {  "x" : 100,      "y" : 400 },    "vertexTR" : {         "x" : 200,      "y" : 400 },    "vertexBL" : {  "x" : 100,      "y" : 500 },    "vertexBR" : {  "x" : 200,      "y" : 500 } },  {       "position" : {  "x" : 540,      "y" : 250 },    "height" : 200,         "width" : 100, "type" : {      "value" : 0,    "type" : "blocks" },    "id" : "block-3-by-id-testBlock3",      "vertexTL" : {  "x" : 540,      "y" : 250 },    "vertexTR" : {  "x" : 640,      "y" : 250 },    "vertexBL" : {  "x" : 540,      "y" : 450 },  "vertexBR" : {   "x" : 640,      "y" : 450 } },  {       "position" : {  "x" : 500,      "y" : 150 },    "height" : 50,  "width" : 200,  "type" : {      "value" : 0,    "type" : "plateform" },         "id" : "block-4-by-id-testBlock4",    "vertexTL" : {   "x" : 500,      "y" : 150 },    "vertexTR" : {  "x" : 700,      "y" : 150 },    "vertexBL" : {  "x" : 500,      "y" : 200 },    "vertexBR" : {  "x" : 700,      "y" : 200 } } ];




module.exports = Config;