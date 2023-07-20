import { FastifyInstance } from "fastify";
import Models from "../Model/Models";

export default class Routes {

    private _fastify: FastifyInstance;
    private _models: Models;

    constructor(fastify: FastifyInstance, models: Models) {
        this._fastify = fastify;
        this._models = models;

        this.set_general_routes();
        this.set_user_routes();
    }

    private set_general_routes() {
        this._fastify.get('/', function (request, reply) {
            reply.send({ hello: 'world' })
        });
    }

    private set_user_routes() {
        let self = this;
        this._fastify.post('/account_register', async function (request: any, reply) {

            let r = await self._models.UserModel.account_register(
               request.body["email"] as string, request.body["password"], request.body["name"], parseInt(request.body["gender"])
            );

            reply.send({ status: r });
        });
    }

} 