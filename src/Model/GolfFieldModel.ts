import Database from './Database';

const RANDOMKey = "4@ekd/dje7)9_kduz7";

const Table = "SelfGolfField";
const MappingTable = "SelfGolfFieldMap";

export default class GolfFieldModel {
    private _database : Database;

    constructor(database : Database) {
        this._database = database;
    }

//#region Golf Field
    async get_golf_field(id: string, mode:string)  {
        let q = `SELECT ${Table}.id as id, map_id, ok_radius, wind_speed, distance_unit, hole_count,
                mascot_sound, auto_ball_supply, action_detect_platform, video_replay, flag_position
        FROM ${Table}
        LEFT JOIN ${MappingTable} ON ${MappingTable}.golf_field_id=${Table}.id
        WHERE ${MappingTable}.user_id=? AND ${Table}.mode=? `;

        let r = await (this._database.PrepareAndExecuteQuery(q, [id, mode]));

        if (r.status)
            return JSON.parse(r.result);

        return [];
    }

    async insert_golf_field(user_id: string, map_id: string, ok_radius: number, wind_speed: number, distance_unit: string, hole_count: number,
        mascot_sound: boolean, auto_ball_supply: boolean, action_detect_platform: boolean, video_replay: boolean, flag_position: boolean,
        mode: string) : Promise<string> {

        let create_field_query = `INSERT INTO ${Table} (map_id, ok_radius, wind_speed, distance_unit, hole_count,
            mascot_sound, auto_ball_supply, action_detect_platform, video_replay, flag_position, mode) VALUES(?,?,?,?,?, ?,?,?,?,?, ?)`;

        let create_field_r = await (this._database.PrepareAndExecuteQuery(create_field_query,
            [map_id, ok_radius, wind_speed, distance_unit, hole_count, mascot_sound, auto_ball_supply, action_detect_platform, video_replay, flag_position,
            mode]));

        if (create_field_r.status == true) {            
            let insert_id: number = JSON.parse(create_field_r.result).insertId;

            let create_map_query = `INSERT INTO ${MappingTable} (user_id, golf_field_id) VALUES(?,?)`;

            let create_map_r = await (this._database.PrepareAndExecuteQuery(create_map_query,
                [user_id, insert_id]));

            if (!create_map_r.status) return null;

            return insert_id.toString();
        }

        return null;
    }

    async update_golf_field(id: string, map_id: string, ok_radius: number, wind_speed: number, distance_unit: string, hole_count: number,
        mascot_sound: boolean, auto_ball_supply: boolean, action_detect_platform: boolean, video_replay: boolean, flag_position: boolean,
        mode: string) {
        let update_query = `
            UPDATE ${Table}
            SET map_id=?,ok_radius=?, wind_speed=?, distance_unit=?, hole_count=?,
                mascot_sound=?,auto_ball_supply=?,action_detect_platform=?,video_replay=?,flag_position=?, mode=?
            WHERE id=?       
        `;

        let r = await (this._database.PrepareAndExecuteQuery(update_query, 
            [map_id, ok_radius, wind_speed, distance_unit, hole_count, mascot_sound, auto_ball_supply, action_detect_platform, video_replay, flag_position, mode, id]));
    }

    async delete_golf_field(id: number) {
        let delete_mapping_query = `DELETE FROM ${MappingTable} WHERE golf_field_id=?`;
        let delete_table_query = `DELETE FROM ${Table} WHERE id=?`;

        await (this._database.PrepareAndExecuteQuery(delete_mapping_query, [id]));
        await (this._database.PrepareAndExecuteQuery(delete_table_query, [id]));
    }
//#endregion

}