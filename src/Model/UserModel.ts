import { send_forget_password_email } from '../Utility/EmailUtility';
import { AccountStruct } from '../Utility/Flag/APIStruct';
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
    async get_account(id:string) : Promise<AccountStruct>{
        let q = `SELECT id, email, name,  height, weight, nation, birthday
        FROM ${Table}
        WHERE id=?`;

        let r = await(this._database.PrepareAndExecuteQuery(q, [id]));
        let json = JSON.parse(r.result);
        if (json.length > 0) {
            return {id: json[0]["id"], 
                    name: json[0]["name"],
                    height: json[0]["height"],
                    weight: json[0]["weight"],
                    birthday: json[0]["birthday"],
                    nation: json[0]["nation"]
                };    
        }
        return null;
    }

    update_account_info(id: string, name: string, birthday: string, height: number, weight: number, nation: string) {
        let update_query = `
            UPDATE ${Table}
            SET name=?, birthday=?, height=?, weight=?, nation=?
            WHERE id=?       
        `;

        let r = (this._database.PrepareAndExecuteQuery(update_query, [name, birthday, height, weight, nation, id]));
    }

    async check_account(id:string, token: string) : Promise<boolean> {
        if (id == "" || token == "") return false;
        
        let query = `SELECT COUNT(*) as count 
                    FROM ${Table}
                    WHERE id=? AND token=?`;

        let r = await(this._database.PrepareAndExecuteQuery(query, [id, token]));
        return JSON.parse(r.result)[0]['count'] > 0;
    }

    async account_register(email: string, password: string, name: string, gender: number) : Promise<boolean> {
        let isAccountValid = await this.ValidAccount(Table, "email", email);

        let id = GenerateRandomString(12);
        let hashPassword = SHA256Hash(password+RANDOMKey);
        let token = SHA256Hash(Date.now().toString());

        if (!isAccountValid) {
                let query = `INSERT INTO ${Table}(id, email, name, password, gender, token)
                VALUES(?,?,?, ?,?,?)`;
                await(this._database.PrepareAndExecuteQuery(query, [id, email, name, hashPassword, gender, token]));
        }

        return !isAccountValid;
    }

    async account_login(email: string, password : string): Promise<AccountStruct> {
        if (email == "") return null;

        let hashPassword = SHA256Hash(password + RANDOMKey);

        let q = `SELECT id, email, name
                FROM ${Table}
                WHERE email=? AND password=?`;

        let r = await this._database.PrepareAndExecuteQuery(q, [email, hashPassword]);

        let json = JSON.parse(r.result);
        if (json.length > 0) {
            let token = await this.RenewToken(json[0]["id"]);
            return {id: json[0]["id"], name: json[0]["name"], token: token };    
        }

        return null;
    }

    async social_media_login(id: string, name: string, social_media: string) : Promise<AccountStruct> {
        let isAccountValid = await this.ValidAccount(Table, "id", id);

        if (!isAccountValid) {
            let query = `INSERT INTO ${Table}(id, name, type)
            VALUES(?, ?, ?)`;

            await(this._database.PrepareAndExecuteQuery(query, [id, name, social_media]));
        }

        let token = await this.RenewToken(id);
        return {id: id, name: name, token: token };
    }

    async change_password(email: string, past_password: string, new_password: string) : Promise<boolean> {
        if (email == "" || past_password == "" || new_password == "") return false;

        let query = `SELECT id 
                    FROM ${Table}
                    WHERE email=? AND password=?`;
        let pass_hashPassword = SHA256Hash(past_password+RANDOMKey);

        let r = await(this._database.PrepareAndExecuteQuery(query, [email, pass_hashPassword]));

        let q_json = JSON.parse(r.result);
        if (q_json.length > 0) {
            let id = q_json[0]["id"];
            let token = await this.RenewToken(id);
            let hashPassword = SHA256Hash(new_password+RANDOMKey);

            let update_query = `
                UPDATE ${Table}
                SET password=?, is_forget_password_mail_send = False
                WHERE id=?       
            `;
            await this._database.PrepareAndExecuteQuery(update_query, [hashPassword, id]);
            return true;
        };

        return false;
    }

    async forget_password(email: string) : Promise<boolean> {
        if (email == "") return false;

        let first_pass_query = `SELECT is_forget_password_mail_send, name
                    FROM ${Table}
                    WHERE email=?`;
        let first_pass_query_r = await(this._database.PrepareAndExecuteQuery(first_pass_query, [email]));

        let json = JSON.parse(first_pass_query_r.result);
        if (json.length > 0 && !json[0]["is_forget_password_mail_send"]) { 
            let nick_name = json[0]["name"]
            let new_password = GenerateRandomString(12);
            let hashPassword = SHA256Hash(new_password+RANDOMKey);
    
            let password_query = `UPDATE ${Table} 
            SET 
                password = ?, is_forget_password_mail_send = True
            WHERE
                email = ?;`;

            await this._database.PrepareAndExecuteQuery(password_query, [hashPassword, email]);
            
            send_forget_password_email(email, nick_name, new_password);

            return true;
        }

        return false;
    }
    //#endregion


    async RenewToken(account_id: string): Promise<string> {
        let token = SHA256Hash(Date.now().toString());
        let q = `
            UPDATE ${Table}
            SET token=?
            WHERE id=?       
        `;

        let r = await this._database.PrepareAndExecuteQuery(q, [token, account_id]);
        return token;
    }

    async ValidAccount(table : string, target_key: string, target_value: string) {
        let query = `SELECT COUNT(*) as count 
                    FROM ${table}
                    WHERE ${target_key} =?`;

        let r = await(this._database.PrepareAndExecuteQuery(query, [target_value]));
        return JSON.parse(r.result)[0]['count'] > 0;
    }
}