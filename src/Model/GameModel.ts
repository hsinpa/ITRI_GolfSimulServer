import { send_forget_password_email } from '../Utility/EmailUtility';
import { AccountStruct } from '../Utility/Flag/APIStruct';
import { GenerateRandomString, SHA256Hash } from '../Utility/GeneralMethod';
import Database from './Database';

const Table = "Game";

export default class GameModel {

    private _database : Database;

    constructor(database : Database) {
        this._database = database;
    }

    SaveGame(session_id: string, map_id: string, user_id: string, score: number[]) {
        let score_str = this.ArrayNumberToString(score);

        console.log("SaveGame " + score_str);
        let query = `INSERT INTO ${Table}(session_id, map_id, user_id, score)
                    VALUES(?,?,?,?)`;

        this._database.PrepareAndExecuteQuery(query, [session_id, map_id, user_id, score_str]);
    }

    async GetGameBySession(session_id: string) : Promise<any[]> {    
        let q = `SELECT id, session_id, user_id, map_id, score
                FROM ${Table}
                WHERE session_id=?`;

        let r = await this._database.PrepareAndExecuteQuery(q, [session_id]);

        let game_result_array = this.TransformGameResult(r.result);

        game_result_array = game_result_array.sort((a, b) => a["total_score"] - b["total_score"]);

        return game_result_array;
    }

    async GetGameByUserID(user_id: string) : Promise<any[]> {
        let q = `SELECT id, session_id, user_id, map_id, score
                FROM ${Table}
                WHERE user_id=?`;

        let r = await this._database.PrepareAndExecuteQuery(q, [user_id]);
        return this.TransformGameResult(r.result);
    }

    async UpdateVideoID(session_id: string, user_id: string, video_id: string) {
        let q = `SELECT id FROM ${Table}
                WHERE session_id=? AND user_id=?`;

        let r = await this._database.PrepareAndExecuteQuery(q, [session_id, user_id]);

        let json = JSON.parse(r.result);
        if (json.length > 0) {
            let game_id = json[0]["id"];

            let update_query = `
            UPDATE ${Table}
            SET  retrospect_video_id = ?
            WHERE id=?`;

            this._database.PrepareAndExecuteQuery(update_query, [video_id, game_id]);
        }
    }

    private TransformGameResult(raw_array: string) : any[] {
        try {
            let r_json = JSON.parse(raw_array);

            for (let i = 0; i < r_json.length; i++) {
                r_json[i].score = this.StringToArrayNumber(r_json[i].score);

                let score_array : number[] = r_json[i].score;
                r_json[i]["total_score"] = score_array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
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