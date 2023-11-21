import UserModel from './UserModel';
import GolfFieldModel from './GolfFieldModel';
import GameModel from './GameModel';
import Database from './Database';
import CloudStorage from './CloudStorage';
import MiniGolfModel from './MiniGolf_Model';

export default class Models {
    Database : Database;
    UserModel : UserModel; 
    GolfFieldModel : GolfFieldModel;
    GameModel : GameModel;
    CloudStorage : CloudStorage;

    MiniGolfModel : MiniGolfModel;

    constructor(envFile : NodeJS.ProcessEnv) {
        this.Database = new Database(envFile);
        this.GolfFieldModel = new GolfFieldModel(this.Database);
        this.UserModel = new UserModel(this.Database);
        this.GameModel = new GameModel(this.Database);
        this.CloudStorage = new CloudStorage(this.Database, envFile.GOOGLE_APPLICATION_CREDENTIALS);
        this.MiniGolfModel = new MiniGolfModel(this.Database);

        // this.ClassModel.AppendModels(this.UserModel, this.ScoreTableModel);
        // this.UserModel.AppendModels( this.ClassModel);
    }
}