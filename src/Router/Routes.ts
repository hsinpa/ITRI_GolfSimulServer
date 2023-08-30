import { FastifyInstance, FastifyReply } from "fastify";
import Models from "../Model/Models";
import {send_email} from "../Utility/EmailUtility";
import set_user_routes from "./UserRoutes";
import set_setting_routes from "./SettingRoutes";
import set_game_routes from "./GameRoutes";
import SocketManager from "../Socket/SocketManager";

export default class Routes {

    private _fastify: FastifyInstance;
    private _models: Models;

    constructor(fastify: FastifyInstance, models: Models, sockets: SocketManager) {
        this._fastify = fastify;
        this._models = models;

        this.set_general_routes();
        set_user_routes(fastify, models, sockets);
        set_setting_routes(fastify, models);
        set_game_routes(fastify, models, sockets);
    }

    private set_general_routes() {
        this._fastify.get('/', function (request, reply) {
            reply.send({ hello: 'world' })
        });

        this._fastify.get('/test_email', function (request, reply) {
            send_email("Hell oworld", "No thing ehrere", "hsinpa@gmail.com");

            reply.send({ hello: 'world' });
        });
    }
} 

export function ReplyResult(reply: FastifyReply, result: any, fallback: string) {
    if (result != null) 
        reply.send({ status: true, result: result});
    else 
        reply.send({ status: false, result: fallback});
}