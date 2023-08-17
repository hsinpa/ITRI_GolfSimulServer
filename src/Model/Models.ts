import UserModel from './UserModel';
import GolfFieldModel from './GolfFieldModel';
import GameModel from './GameModel';
import Database from './Database';

export default class Models {
    Database : Database;
    UserModel : UserModel; 
    GolfFieldModel : GolfFieldModel;
    GameModel : GameModel;

    constructor(envFile : NodeJS.ProcessEnv) {
        this.Database = new Database(envFile);
        this.GolfFieldModel = new GolfFieldModel(this.Database);
        this.UserModel = new UserModel(this.Database);
        this.GameModel = new GameModel(this.Database);

        // this.ClassModel.AppendModels(this.UserModel, this.ScoreTableModel);
        // this.UserModel.AppendModels( this.ClassModel);
    }
}