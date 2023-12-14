export interface DatabaseResultType {
    status : boolean,
    result? : any
}

export const GoogleStorageTag = Object.freeze({
    FBX : "FBX",
    SCREENSHOT : "SCREENSHOT",
    ASSET : "ASSET",
});

export const ErrorMessge = Object.freeze({
    Account_Not_Exist : "Account_Not_Exist",
    Parameter_Wrong_Format : "Parameter_Wrong_Format",
    Password_Not_Fit : "Password_Not_Fit",
    Password_Wrong_Format : "Password_Wrong_Format",
    Email_Not_Match : "Email_Not_Match",
    Forget_Password_Not_Allow : "Forget_Password_Not_Allow",

    UserID_NotExist : "UserID_NotExist",
    Error : "Unkonwn_Error",
});

export const ErrorSocketMessge = Object.freeze({
    Join_Room_Full : "Join_Room_Full",
    Room_Not_Exist : "Room_Not_Exist",
    Room_Wrong_Owner : "Room_Wrong_Owner",
});

export const UserStatus = Object.freeze({
    Guest : "guest",
    User : "user",
});

export interface EnvironmentType {
    users : Map<string, UserComponentType> //user_id
}

export interface SocketComponentType {
    socket_id : string,
    user_id : string[],
    room_id : string,
}

export interface UserComponentType {
    user_id : string,
    name : string,
    type : string,
    connection? : boolean,
    room_id? : string,
}

export interface RoomComponentType {
    room_id : string,
    host_id : string,
    map_type: GolfFieldType,

    in_game: boolean,

    //userID List
    users : string[]
}

export interface GolfFieldType {
    "map_id" : string,
    "ok_radius" : number,
    "wind_speed" : number,
    "distance_unit" : string,
    "hole_count" : number,
    "max_player" : number,

    "mascot_sound" : boolean,
    "auto_ball_supply" : boolean,
    "action_detect_platform" : boolean,
    "video_replay" : boolean,
    "flag_position" : boolean,
    "is_public" : boolean
}