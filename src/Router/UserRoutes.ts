import { FastifyInstance, FastifyReply } from "fastify";
import Models from "../Model/Models";
import { ErrorMessge } from "../Utility/Flag/TypeFlag";
import { SafeJSONOps } from "../Utility/GeneralMethod";
import { RegularExpression } from "../Utility/Flag/EventFlag";
import {ReplyResult} from './Routes';
import SocketManager from "../Socket/SocketManager";

export default function set_user_routes(fastify: FastifyInstance, models: Models, sockets: SocketManager) {

    fastify.get('/get_account/:id', async function (request: any, reply) {
        const { id } = request.params;
        let r = await models.UserModel.get_account(id);
        
        ReplyResult(reply, r, ErrorMessge.Account_Not_Exist);
    });

    fastify.post('/update_account', async function (request: any, reply) {
        let r = await models.UserModel.update_account_info(
            SafeJSONOps(request.body, "id", ""), 
            SafeJSONOps(request.body, "name", ""),
            SafeJSONOps(request.body, "birthday", ""),
            SafeJSONOps(request.body, "height", 0),
            SafeJSONOps(request.body, "weight", 0),
            SafeJSONOps(request.body, "nation", "")
        );
        reply.send({ status: true});
    });


    fastify.post('/check_account', async function (request: any, reply) {
        let r = await models.UserModel.check_account(
            SafeJSONOps(request.body, "id", ""), 
            SafeJSONOps(request.body, "token", "")
        );
        reply.send({ status: r});
    });

    fastify.post('/account_register', async function (request: any, reply) {

        let  password = SafeJSONOps(request.body, "password", "");
        if (!password.match(RegularExpression.Password)) {
            ReplyResult(reply, false, ErrorMessge.Password_Wrong_Format);
            return;
        }

        let r = await models.UserModel.account_register(
            SafeJSONOps(request.body, "email", ""), 
            SafeJSONOps(request.body, "password", ""), 
            SafeJSONOps(request.body, "name", ""), 
            SafeJSONOps(request.body, "gender", 0)
        );

        reply.send({ status: r });
    });

    fastify.post('/account_login', async function (request: any, reply) {
        let device_id = SafeJSONOps(request.body, "device_id", "")

        let r = await models.UserModel.account_login(
            SafeJSONOps(request.body, "email", ""), 
            SafeJSONOps(request.body, "password", "")
        );

        if (device_id != "" && r != null)
            sockets.api.SendLoginSuccessEvent(device_id, JSON.stringify(r));


        ReplyResult(reply, r, ErrorMessge.Account_Not_Exist);
    });

    fastify.post('/social_media_login', async function (request: any, reply) {
        let device_id = SafeJSONOps(request.body, "device_id", "")

        let r = await models.UserModel.social_media_login(
            SafeJSONOps(request.body, "id", ""), 
            SafeJSONOps(request.body, "name", ""),
            SafeJSONOps(request.body, "social_media", "root")
        );

        if (device_id != "" && r != null)
            sockets.api.SendLoginSuccessEvent(device_id, JSON.stringify(r));
        
        ReplyResult(reply, r, ErrorMessge.Account_Not_Exist);
    });

    fastify.get('/forget_password/:email', async function (request: any, reply) {
        const { email } = request.params;
        
        if (email.match(RegularExpression.Email)) {
            let r = await models.UserModel.forget_password(email);
            
            ReplyResult(reply, (r) ? r : null, ErrorMessge.Forget_Password_Not_Allow);

            return;
        }
        
        ReplyResult(reply, null, ErrorMessge.Email_Not_Match);
    });

    fastify.post('/change_password', async function (request: any, reply) {

        let new_password = SafeJSONOps(request.body, "new_password", "root")

        if (!new_password.match(RegularExpression.Password)) {
            ReplyResult(reply, false, ErrorMessge.Password_Wrong_Format);
            return;
        }

        let r = await models.UserModel.change_password(
            SafeJSONOps(request.body, "id", ""), 
            SafeJSONOps(request.body, "past_password", ""),
            new_password
            );

        ReplyResult(reply, (r) ? r : null, ErrorMessge.Password_Not_Fit);
    });
}

