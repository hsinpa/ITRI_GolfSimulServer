import { FastifyInstance, FastifyReply } from "fastify";
import Models from "../Model/Models";
import { ErrorMessge } from "../Utility/Flag/TypeFlag";

export default function set_user_routes(fastify: FastifyInstance, models: Models) {

    fastify.get('/get_account/:id', async function (request: any, reply) {
        const { id } = request.params;
        let r = await models.UserModel.get_account(id);
        
        reply_result(reply, r, ErrorMessge.Account_Not_Exist);
    });

    fastify.post('/check_account', async function (request: any, reply) {
        let r = await models.UserModel.check_account(request.body["id"], request.body["token"]);
        console.log(r);
        reply.send({ status: r});
    });

    fastify.post('/account_register', async function (request: any, reply) {

        let r = await models.UserModel.account_register(
           request.body["email"] as string, request.body["password"], request.body["name"], parseInt(request.body["gender"])
        );

        reply.send({ status: r });
    });

    fastify.post('/account_login', async function (request: any, reply) {
        let r = await models.UserModel.account_login(request.body["email"], request.body["password"]);

        reply_result(reply, r, ErrorMessge.Account_Not_Exist);
    });

    fastify.post('/social_media_login', async function (request: any, reply) {
        let r = await models.UserModel.social_media_login(request.body["id"], request.body["name"], request.body["social_media"]);
        
        reply_result(reply, r, ErrorMessge.Account_Not_Exist);
    });

    fastify.get('/forget_password/:email', async function (request: any, reply) {
        const { email } = request.params;
        const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        
        if (email.match(re)) {
            let r = await models.UserModel.forget_password(email);
            
            reply_result(reply, (r) ? r : null, ErrorMessge.Forget_Password_Not_Allow);

            return;
        }
        
        reply_result(reply, null, ErrorMessge.Email_Not_Match);
    });

    fastify.post('/change_password', async function (request: any, reply) {
        let r = await models.UserModel.change_password(request.body["email"], request.body["past_password"], request.body["new_password"]);

        reply_result(reply, (r) ? r : null, ErrorMessge.Password_Not_Fit);
    });
}

function reply_result(reply: FastifyReply, result: any, fallback: string) {
    if (result != null) 
        reply.send({ status: true, result: result});
    else 
        reply.send({ status: false, result: fallback});
}