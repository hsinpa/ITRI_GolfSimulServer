export interface DatabaseResultType {
    status : boolean,
    result? : any
}

export const ErrorMessge = Object.freeze({
    Account_Not_Exist : "Account_Not_Exist",
    Parameter_Wrong_Format : "Parameter_Wrong_Format",
    Password_Not_Fit : "Password_Not_Fit",
    Email_Not_Match : "Email_Not_Match",
    Forget_Password_Not_Allow : "Forget_Password_Not_Allow",
});

export const ErrorSocketMessge = Object.freeze({
    Join_Room_Full : "Join_Room_Full",
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
    connection : boolean,

    room_id? : string,
}

export interface RoomComponentType {
    room_id : string,
    host_id : string,
    map_id: string,

    in_game: boolean,

    //userID List
    users : string[]
}
