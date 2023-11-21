import { send_forget_password_email } from '../Utility/EmailUtility';
import { AccountStruct } from '../Utility/Flag/APIStruct';
import { GenerateRandomString, SHA256Hash } from '../Utility/GeneralMethod';
import Database from './Database';

const ScoreTable = "MiniGolfScore";
const TerrainTable = "MiniGolfTerrain";

export default class MiniGolfModel {

    private _database : Database;

    constructor(database : Database) {
        this._database = database;
    }

     SaveGame(user_id: string, terrain_id: string, score: number) {
        let query = `INSERT INTO ${ScoreTable} (user_id, terrain_id, score)
                    VALUES(?,?,?)`;

        this._database.PrepareAndExecuteQuery(query, [user_id, terrain_id, score]);
    }

    async GetHighScore(terrain_id: string) {
        let query = `SELECT h.user_id as user_id, h.max_score as score
                    from (SELECT user_id, max(score) as max_score from ${ScoreTable} WHERE terrain_id = ? group by user_id) h
                    ORDER By score DESC LIMIT 10`;
        
        let r = await this._database.PrepareAndExecuteQuery(query, [terrain_id]);

        if (r.status) {
            return JSON.parse(r.result);
        }

        return [];
    }
}