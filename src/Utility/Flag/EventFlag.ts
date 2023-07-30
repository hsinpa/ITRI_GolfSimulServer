
export const UniversalSocketEvent = {
    UserRegister: "server_input@user_register",
    CheckRegister: "server_input@check_register",

    RoomJoined : "server_input@room_join",
    RoomLeaved : "server_input@room_leave",
    RoomCreate : "server_input@room_create",
}

export const UniversalSocketReplyEvent = {
    UserRegister: "server_output@user_register",
    CheckRegister: "server_output@check_register",

    NewUserJoined : "server_output@new_user_joined",

    RoomJoined : "server_output@room_join",
    RoomLeaved : "server_output@room_leave",
    RoomCreate : "server_output@room_create",
}