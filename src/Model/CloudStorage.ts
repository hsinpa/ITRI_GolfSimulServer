import { send_forget_password_email } from '../Utility/EmailUtility';
import { AccountStruct } from '../Utility/Flag/APIStruct';
import { GenerateRandomString, SHA256Hash } from '../Utility/GeneralMethod';
import Database from './Database';
import { Storage } from '@google-cloud/storage';
import { dirname, parse, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const Table = "GolfFieldScreenshotMap";

export default class CloudStorageModel {
    private _database : Database;
    private _storage: Storage;

    constructor(database : Database, config_file_path: string) {
        this._database = database;

        this._storage = new Storage({keyFile: config_file_path});
    }

//#region Golf Field
    async upload_to_google_cloud_storage(filepath: string, filename: string, ) {
        let new_file_name = GenerateRandomString(8) +"-"+ filename;
        const bucketName = 'golf-itri';

        const options = {
            destination: new_file_name,
            preconditionOpts: {ifGenerationMatch: 0},
          };

          await this._storage.bucket(bucketName).upload(filepath, options);
          await this._storage.bucket(bucketName).file(new_file_name).makePublic();

        return new_file_name;
    }

    async get_file_uri(filename: string) {
        const bucketName = 'golf-itri';
        return await this._storage.bucket(bucketName).file(filename).publicUrl();
    }
//#endregion

//#region Database
    async SaveFieldScreenShotToDatabase(user_id: string, field_id: string, screenshot_url: string) {
        let save_screenshot_query = `INSERT INTO ${Table} (image_url, golf_field_id, user_id) VALUES(?, ?, ?)`;

        await this._database.PrepareAndExecuteQuery(save_screenshot_query, [screenshot_url, field_id, user_id]);
    }

    async GetFieldScreenShot(user_id: string, field_id: string) {
        let get_screenshot_query = `SELECT image_url FROM ${Table} WHERE golf_field_id = ? AND user_id = ?`;

        let r = await this._database.PrepareAndExecuteQuery(get_screenshot_query, [field_id, user_id]);
        
        if (r.status) {
            return JSON.parse( r.result)[0];
        }
        
        return null;
    }
//#endregion

}