import { GenerateRandomString, SHA256Hash } from '../Utility/GeneralMethod';
import Database from './Database';

const RANDOMKey = "4@ekd/dje7)9_kduz7";
const Table = "Account";

export default class UserModel {
    private _database : Database;

    constructor(database : Database) {
        this._database = database;
    }

    //#region Public API
    async get_account(id:string) {

    }

    async account_register(email: string, password: string, name: string, gender: number) {
        let isAccountValid = await this.ValidAccount(Table, "email", email);

        console.log("isAccountValid " + isAccountValid);

        let id = GenerateRandomString(12);
        let hashPassword = SHA256Hash(password+RANDOMKey);
        let token = SHA256Hash(Date.now().toString());

        if (!isAccountValid) {
                let query = `INSERT INTO ${Table}(id, email, name, password, gender, token)
                VALUES(?,?,?, ?,?,?)`;
                console.log(query);
                await(this._database.PrepareAndExecuteQuery(query, [id, email, name, hashPassword, gender, token]));
        }

        return !isAccountValid;
    }

    async account_login() {

    }

    async social_media_login() {

    }

    async change_password() {

    }
    //#endregion

    async ValidAccount(table : string, target_key: string, target_value: string) {
        let query = `SELECT COUNT(*) as count 
                    FROM ${table}
                    WHERE ${target_key} =?`;

        let r = await(this._database.PrepareAndExecuteQuery(query, [target_value]));
        return JSON.parse(r.result)[0]['count'] > 0;
    }
}