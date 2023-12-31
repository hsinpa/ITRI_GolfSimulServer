import { FastifyInstance, FastifyReply } from "fastify";
import Models from "../Model/Models";
import { ErrorMessge, GoogleStorageTag } from "../Utility/Flag/TypeFlag";
import { SafeJSONOps } from "../Utility/GeneralMethod";
import { promisify } from "node:util";
import {createWriteStream} from "fs";
import {ReplyResult} from './Routes';
import { Storage } from '@google-cloud/storage';
import { dirname, parse, join } from 'path';
import { v4 as uuidv4 } from 'uuid';


const fullPath = dirname(require.main.filename);
let configFilename = join(__dirname, "../", "files/introduction-lppbci-ae3a7bc1fbce.json");

const storage = new Storage({keyFile: configFilename});

export default function set_io_routes(fastify: FastifyInstance, models: Models) {

    fastify.get('/get_all_asset/:tag', async function (request: any, reply) {
        const { tag } = request.params;

        let cloud_storage_result = await models.CloudStorage.GetAssetsByTag(tag);
        ReplyResult(reply, cloud_storage_result, ErrorMessge.Error);
    });

    fastify.get('/get_golf_field_image/:id/:golf_field_id', async function (request: any, reply) {
        const { id, golf_field_id } = request.params;

        let screenshot_url = await models.CloudStorage.GetFieldScreenShot(id, golf_field_id);
        ReplyResult(reply, screenshot_url, ErrorMessge.Error);
    });

    fastify.post('/save_golf_field_image_to_cloud_storage', async function (request: any, reply) {
        const files = await request.saveRequestFiles();

        let filepath : string = files[0].filepath;
        let filename : string = files[0].filename;

        let golf_field : string = files[0].fields.golf_field_id.value;
        let user_id : string = files[0].fields.user_id.value;

        let new_file_name = await models.CloudStorage.upload_to_google_cloud_storage(filepath, filename);
        let file_uri = await models.CloudStorage.get_file_uri(new_file_name);
    
        await models.CloudStorage.SaveGoogleStorageTable(GoogleStorageTag.SCREENSHOT, file_uri);

        await models.CloudStorage.SaveFieldScreenShotToDatabase(user_id, golf_field, file_uri);

        ReplyResult(reply, file_uri, ErrorMessge.Error);
    });

    fastify.post('/save_avatar_to_cloud_storage', async function (request: any, reply) {
        const files = await request.saveRequestFiles();

        let filepath : string = files[0].filepath;
        let filename : string = files[0].filename;

        let user_id : string = files[0].fields.user_id.value;

        let new_file_name = await models.CloudStorage.upload_to_google_cloud_storage(filepath, filename);
        let file_uri = await models.CloudStorage.get_file_uri(new_file_name);
    
        await models.CloudStorage.SaveGoogleStorageTable(GoogleStorageTag.FBX, file_uri);

        await models.UserModel.update_account_fbx(user_id, file_uri);

        ReplyResult(reply, file_uri, ErrorMessge.Error);
    });

    fastify.post('/save_asset_to_cloud_storage', async function (request: any, reply) {
        const files = await request.saveRequestFiles();

        let filepath : string = files[0].filepath;
        let filename : string = files[0].filename;

        let new_file_name = await models.CloudStorage.upload_to_google_cloud_storage(filepath, filename);
        let file_uri = await models.CloudStorage.get_file_uri(new_file_name);

        await models.CloudStorage.SaveGoogleStorageTable(GoogleStorageTag.ASSET, file_uri);

        ReplyResult(reply, file_uri, ErrorMessge.Error);
    });

    fastify.post('/remove_avatar_to_cloud_storage', async function (request: any, reply) {
        let user_id : string = SafeJSONOps(request.body, "user_id", "");
        await models.UserModel.update_account_fbx(user_id, "")
        ReplyResult(reply, true, ErrorMessge.Error);
    });

    fastify.post('/remove_asset_to_cloud_storage', async function (request: any, reply) {
        let asset_id : number = SafeJSONOps(request.body, "asset_id", 0);
        await models.CloudStorage.DeleteGoogleStorageTable(asset_id);
        ReplyResult(reply, true, ErrorMessge.Error);
    });
}