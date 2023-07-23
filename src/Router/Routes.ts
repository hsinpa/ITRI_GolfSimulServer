import { FastifyInstance } from "fastify";
import Models from "../Model/Models";
import {send_email} from "../Utility/EmailUtility";
import set_user_routes from "./UserRoutes";

export default class Routes {

    private _fastify: FastifyInstance;
    private _models: Models;

    constructor(fastify: FastifyInstance, models: Models) {
        this._fastify = fastify;
        this._models = models;

        this.set_general_routes();
        set_user_routes(fastify, models);
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