import { FastifyInstance, FastifyReply } from "fastify";
import Models from "../Model/Models";
import { ErrorMessge } from "../Utility/Flag/TypeFlag";
import { SafeJSONOps } from "../Utility/GeneralMethod";
import { RegularExpression } from "../Utility/Flag/EventFlag";
import {ReplyResult} from './Routes';

export default function set_mini_golf_routes(fastify: FastifyInstance, models: Models) {

    fastify.get('/mini_golf/high_score/:terrain_id/:mode', async function (request: any, reply) {
        const { terrain_id, mode } = request.params;

        let r = await models.MiniGolfModel.GetHighScore(terrain_id, mode);

        ReplyResult(reply, r, ErrorMessge.Error);
    });

    fastify.post('/mini_golf/save_score', async function (request: any, reply) {

        await models.MiniGolfModel.SaveGame(
            SafeJSONOps(request.body, "user_id", ""),
            SafeJSONOps(request.body, "terrain_id", ""), 
            SafeJSONOps(request.body, "score", 0),
            SafeJSONOps(request.body, "mode", "normal")
        );

        ReplyResult(reply, true, ErrorMessge.Error);
    });


}