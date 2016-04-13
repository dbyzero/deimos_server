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

config = {};

config.Engine = {};
config.Engine.MAIN_LOOP_DELAY = 33; //40 = 25FPS, 33 = 33FPS, 20 = 50FPS, 
config.Engine.SYNCHRO_MAX_DELAY = 9000;
config.Engine.SYNCHRO_MIN_DELAY = 3000;
config.Server = {};
config.Server.server_port = 80;
config.Scene = {};
config.Scene.maxInstance = 20;
config.Scene.maxUser = 20;
config.Scene.minDeltaSaveElement = 5000;
config.API = {};
config.API.url = 'http://172.19.0.2';
config.Network = {};
config.Network.compression = 'verbose'; // text | verbose
config.Client = {};
//Sqaue where the client is the authority (square to speed up calcs)
config.Client.SQUARE_AUTHORITY_DISTANCE = 100*100;

module.exports = config;