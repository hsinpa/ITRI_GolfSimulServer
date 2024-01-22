import { timeStamp } from 'node:console';
import Database from './Database';

const Table = "Game";
const RecordTable = "GameRecord";

export default class GameModel {

    private _database : Database;

    constructor(database : Database) {
        this._database = database;
    }

    async SaveGame(session_id: string, map_id: string, user_id:string, par_score: number[],
             player_count: number, hole_count: number,  mode: string, timestamp: string) {
        let score_str = this.ArrayNumberToString(par_score);

        let select_query = `SELECT id
                FROM ${Table}
                WHERE user_id=? AND session_id = ?`;

        let select_result = await this._database.PrepareAndExecuteQuery(select_query, [user_id, session_id]);
        let select_json = JSON.parse(select_result.result);

        if (select_json.length > 0) {
            this.UpdateGame(session_id, map_id, user_id, score_str, player_count);
            return;
        }

        let query = `INSERT INTO ${Table}(session_id, map_id, user_id, par_score, 
                    player_count, hole_count, mode_type, timestamp)
                    VALUES(?,?,?,?, ?, ?, ?, ?)`;                

        this._database.PrepareAndExecuteQuery(query, [session_id, map_id, user_id, score_str,
            player_count, hole_count, mode, timestamp
        ]);
    }

    UpdateGame(session_id: string, map_id: string, user_id:string, par_score: string, player_count: number) {
        let update_q = `UPDATE ${Table} SET 
                        par_score = ?,
                        player_count = ?,
                        WHERE session_id = ? AND map_id = ? AND user_id = ?`;
                        
        this._database.PrepareAndExecuteQuery(update_q, [par_score,  player_count,  session_id, map_id, user_id]);
                   
    }

    async GetGameBySession(session_id: string) : Promise<any[]> {    
        let q = `SELECT id, session_id, user_id, map_id, par_score, hole_count, player_count, mode_type, create_time, timestamp
                FROM ${Table}
                WHERE session_id=?`;

        let r = await this._database.PrepareAndExecuteQuery(q, [session_id]);

        let game_result_array = this.TransformGameResult(r.result);

        game_result_array = game_result_array.sort((a, b) => a["total_par"] - b["total_par"]);

        game_result_array = game_result_array.map((x, index) => {
            x["rank"] = index + 1;
            return x;
        });

        return game_result_array;
    }

    async GetGameByUserIDAndMode(user_id: string, mode: string) : Promise<any[]> {
        let q = `SELECT id, session_id, user_id, map_id, par_score, hole_count, player_count, mode_type, create_time, timestamp
                FROM ${Table}
                WHERE user_id=? AND mode_type = ?`;

        let r = await this._database.PrepareAndExecuteQuery(q, [user_id, mode]);
        let par_record = this.TransformGameResult(r.result);
        let p_lens = par_record.length;

        for (let i = 0; i < p_lens; i++) {
            let session_record = await this.GetGameBySession(par_record[i]["session_id"]);
            let session_lens = session_record.length;

            for (let k = 0; k < session_lens; k++) {
                if (session_record[k]["user_id"] == user_id) {
                    par_record[i]["rank"] = session_record[k]["rank"];
                    break;
                }
            }
        }

        return par_record;
    }

    async SaveGameRecord(new_player_count: number, new_play_time: number) {
        let get_q = `SELECT user_count, totol_play_time as total_play_time FROM ${RecordTable}`;
        let get_r = await this._database.PrepareAndExecuteQuery(get_q);

        let user_count : number = get_r.result[0]["user_count"] + new_player_count;
        let total_play_time : number = get_r.result[0]["total_play_time"] + new_play_time;

        let save_q = `UPDATE ${RecordTable} SET user_count = ${user_count}, totol_play_time = ${total_play_time} FROM ${RecordTable}`;
        let save_r = await this._database.PrepareAndExecuteQuery(save_q);
    }

    private TransformGameResult(raw_array: string) : any[] {
        try {
            let r_json = JSON.parse(raw_array);

            for (let i = 0; i < r_json.length; i++) {
                r_json[i].par_score = this.StringToArrayNumber(r_json[i].par_score);

                let score_array : number[] = r_json[i].par_score;
                r_json[i]["total_par"] = score_array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            }
    
            return r_json;
        } catch(e) {
            console.log(e);
            return [];
        }
    }

    private StringToArrayNumber(score: string) {
        let array = [];
        const numbers = score.split(',');
        for (let i = 0; i < numbers.length; i++) {
            array.push( Number.parseInt(numbers[i]) );
        }
        return array;
    }

    private ArrayNumberToString(score: number[]) {
        let s = "";
        let lens = score.length;

        for (let i = 0; i < lens; i++) {
            s += score[i];

            if (i != lens - 1)
                s += ",";
        }
        
        return s;
    }
}