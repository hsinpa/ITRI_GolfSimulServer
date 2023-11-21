import Database from './Database';

const Table = "Game";

export default class GameModel {

    private _database : Database;

    constructor(database : Database) {
        this._database = database;
    }

    SaveGame(session_id: string, map_id: string, user_id:string, par_score: number[],
             player_count: number, hole_count: number,  mode: string, timestamp: string) {
        let score_str = this.ArrayNumberToString(par_score);

        let query = `INSERT INTO ${Table}(session_id, map_id, user_id, par_score, 
                    player_count, hole_count, mode_type, timestamp)
                    VALUES(?,?,?,?, ?, ?, ?, ?)`;                

        this._database.PrepareAndExecuteQuery(query, [session_id, map_id, user_id, score_str,
            player_count, hole_count, mode, timestamp
        ]);
    }

    async GetGameBySession(session_id: string) : Promise<any[]> {    
        let q = `SELECT id, session_id, user_id, map_id, par_score, hole_count, player_count, mode_type, create_time, timestamp
                FROM ${Table}
                WHERE session_id=?`;

        let r = await this._database.PrepareAndExecuteQuery(q, [session_id]);

        let game_result_array = this.TransformGameResult(r.result);

        game_result_array = game_result_array.sort((a, b) => a["total_score"] - b["total_score"]);

        return game_result_array;
    }

    async GetGameByUserIDAndMode(user_id: string, mode: string) : Promise<any[]> {
        let q = `SELECT id, session_id, user_id, map_id, par_score, hole_count, player_count, mode_type, create_time, timestamp
                FROM ${Table}
                WHERE user_id=? AND mode_type = ?`;

        let r = await this._database.PrepareAndExecuteQuery(q, [user_id, mode]);
        return this.TransformGameResult(r.result);
    }

    private TransformGameResult(raw_array: string) : any[] {
        try {
            let r_json = JSON.parse(raw_array);

            for (let i = 0; i < r_json.length; i++) {
                r_json[i].par_score = this.StringToArrayNumber(r_json[i].par_score);

                let score_array : number[] = r_json[i].par_score;
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