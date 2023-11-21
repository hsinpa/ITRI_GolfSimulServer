import { FastifyInstance, FastifyReply } from "fastify";
import Models from "../Model/Models";
import { ErrorMessge } from "../Utility/Flag/TypeFlag";
import { SafeJSONOps } from "../Utility/GeneralMethod";
import { RegularExpression } from "../Utility/Flag/EventFlag";
import {ReplyResult} from './Routes';
import SocketManager from "../Socket/SocketManager";

export default function set_game_routes(fastify: FastifyInstance, models: Models, sockets: SocketManager) {

    fastify.get('/get_live_rooms', async function (request: any, reply) {
        ReplyResult(reply, sockets.api.GetLiveRooms(), ErrorMessge.Error);
    });

    fastify.get('/get_game_by_session/:id', async function (request: any, reply) {
        const { id } = request.params;

        let r = await models.GameModel.GetGameBySession(id);

        ReplyResult(reply, r, ErrorMessge.Error);
    });

    fastify.get('/get_game_by_user/:mode/:id', async function (request: any, reply) {
        const { mode , id } = request.params;

        let r = await models.GameModel.GetGameByUserIDAndMode(id, mode);

        ReplyResult(reply, r, ErrorMessge.Error);
    });

    fastify.post('/save_game', async function (request: any, reply) {
        let r = await models.GameModel.SaveGame(
            SafeJSONOps(request.body, "session_id", ""), 
            SafeJSONOps(request.body, "map_id", ""),
            SafeJSONOps(request.body, "user_id", ""),
            SafeJSONOps(request.body, "par_score", []),
            SafeJSONOps(request.body, "player_count", 0), 
            SafeJSONOps(request.body, "hole_count", 0),
            SafeJSONOps(request.body, "mode_type", "watch_mode"),
            SafeJSONOps(request.body, "timestamp", ""),
        );

        ReplyResult(reply, true, ErrorMessge.Error);
    });
}
