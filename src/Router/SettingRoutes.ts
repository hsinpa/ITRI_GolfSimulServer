import { FastifyInstance, FastifyReply } from "fastify";
import Models from "../Model/Models";
import { ErrorMessge } from "../Utility/Flag/TypeFlag";
import { SafeJSONOps } from "../Utility/GeneralMethod";
import { RegularExpression } from "../Utility/Flag/EventFlag";
import {ReplyResult} from './Routes';

export default function set_setting_routes(fastify: FastifyInstance, models: Models) {

    fastify.get('/self_golf_field/:id', async function (request: any, reply) {
        const { id } = request.params;

        let r = await models.GolfFieldModel.get_golf_field(id);

        ReplyResult(reply, r, ErrorMessge.Error);
    });

    fastify.post('/self_golf_field', async function (request: any, reply) {
        let r = await models.GolfFieldModel.insert_golf_field(
            SafeJSONOps(request.body, "user_id", ""), 
            SafeJSONOps(request.body, "map_id", ""), 
            SafeJSONOps(request.body, "ok_radius", 1),
            SafeJSONOps(request.body, "wind_speed", 0),
            SafeJSONOps(request.body, "distance_unit", "meter"),
            SafeJSONOps(request.body, "hole_count", 9),

            SafeJSONOps(request.body, "mascot_sound", false), 
            SafeJSONOps(request.body, "auto_ball_supply", false),
            SafeJSONOps(request.body, "action_detect_platform", false),
            SafeJSONOps(request.body, "video_replay", false),
            SafeJSONOps(request.body, "flag_position", false),
        );

        ReplyResult(reply, r, ErrorMessge.UserID_NotExist);
    });

    fastify.put('/self_golf_field', async function (request: any, reply) {
        let r = await models.GolfFieldModel.update_golf_field(
            SafeJSONOps(request.body, "id", ""), 
            SafeJSONOps(request.body, "map_id", ""), 
            SafeJSONOps(request.body, "ok_radius", 1),
            SafeJSONOps(request.body, "wind_speed", 0),
            SafeJSONOps(request.body, "distance_unit", "meter"),
            SafeJSONOps(request.body, "hole_count", 9),

            SafeJSONOps(request.body, "mascot_sound", false), 
            SafeJSONOps(request.body, "auto_ball_supply", false),
            SafeJSONOps(request.body, "action_detect_platform", false),
            SafeJSONOps(request.body, "video_replay", false),
            SafeJSONOps(request.body, "flag_position", false),
        );

        reply.send({ status: true});
    });

    fastify.delete('/self_golf_field/:id', async function (request: any, reply) {
        const { id } = request.params;

        await models.GolfFieldModel.delete_golf_field(parseInt(id));

        reply.send({ status: true});
    });

}
