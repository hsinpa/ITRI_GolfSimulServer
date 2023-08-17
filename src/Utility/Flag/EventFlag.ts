
export const RegularExpression  = Object.freeze({
    Password: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){6,26}$/g,
    Email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
});

export const UniversalSocketEvent = {
    SelfRegister: "server_input@self_register",
    UserRegister: "server_input@user_register",
    CheckRegister: "server_input@check_register",

    RoomJoined : "server_input@room_join",
    RoomLeaved : "server_input@room_leave",
    RoomCreate : "server_input@room_create",
}

export const UniversalSocketReplyEvent = {
    //API
    LoginSuccess: "server_output@login_success",

    //Socket
    UserRegister: "server_output@user_register",
    CheckRegister: "server_output@check_register",

    NewUserJoined : "server_output@new_user_joined",

    RoomJoined : "server_output@room_join",
    RoomLeaved : "server_output@room_leave",
    RoomCreate : "server_output@room_create",
}