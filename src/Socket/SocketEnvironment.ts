import { Socket, Server } from "socket.io";
import { RoomComponentType, UserComponentType, SocketComponentType } from "../Utility/Flag/TypeFlag";
import { GenerateRandomString } from "../Utility/GeneralMethod";
import { UniversalSocketReplyEvent } from "../Utility/Flag/EventFlag";

const MAX_PLAYER = 8;

export default class SocketEnvironment {
    public devices : Map<string, string>; //Device ID => socket id

    private _users : Map<string, UserComponentType>;
    private _rooms : Map<string, RoomComponentType>;
    private _sockets : Map<string, SocketComponentType>;
    private _io: Server;

    constructor(io: Server) {
        this._io = io;
        this.devices = new Map<string, string>();
        this._sockets = new Map<string, SocketComponentType>();
        this._users = new Map<string, UserComponentType>();
        this._rooms = new Map<string, RoomComponentType>();
    }

    public FindExitingUsers(users_array: string[]) : string[] {
        let exist_users: string[] = [];

        users_array.forEach(x=>{
            if (this._users.has(x)) {
                exist_users.push(x);
            }
        });    
        
        return exist_users;
    }

    GetRoom(room_id: string) {
        return this._rooms.get(room_id);
    }

    GetSocketComp(socket_id: string) {
        return this._sockets.get(socket_id);
    }

    GetSocketUser(socket_id: string): UserComponentType[] {
        let socket_comp = this._sockets.get(socket_id);
        if (socket_comp == null) return [];

        return this.GetUsers(socket_comp.user_id);
    }

    GetUsers(user_id: string[]): UserComponentType[] {
        return user_id.map(x => {
            return this._users.get(x);
        });
    }


    GetRooms() {
        let available_rooms : RoomComponentType[] = [];

        this._rooms.forEach(x=> {
            if (x.users.length < MAX_PLAYER) available_rooms.push(x);
        });

        return available_rooms;
    }

    RegisterUser(socket_id : string, users: UserComponentType[]) {
        if (users == null) return;

        //Check duplicate User ID
        let user_id_array = users.map(x=>x.user_id);

        //Remove previous select users
        if (this._sockets.has(socket_id)) {
            let socketComp = this._sockets.get(socket_id);

            socketComp.user_id.forEach(x=>{
                this._users.delete(x);
            });
        }
        
        if (this.FindExitingUsers(user_id_array).length > 0) {
            return;
        }

        //Inject users
        let user_id_list : string[] = [];
        users.forEach(x=>{
            user_id_list.push(x.user_id);
            this._users.set(x.user_id, x);
        });

        //Set SocketComp
        this._sockets.set(socket_id, {socket_id: socket_id, user_id: user_id_list, room_id: ""});
    }

    CreateRoom(socket_id: string, map_id: string, users: string[] ) : string {
        if (users.length > 0) return "";
        
        let random_id = GenerateRandomString(8);
        let room : RoomComponentType = {
            map_id: map_id,
            users: users,
            host_id: users[0],
            room_id: random_id,
            in_game: false
        }

        this._rooms.set(random_id, room);
        this.BindToRoom(socket_id, random_id);

        return random_id;
    }

    JoinRoom(socket_id: string, room_id: string, users: string[] ) : boolean{
        if (!this._rooms.has(room_id)) return false;

        let room = this._rooms.get(room_id);

        if (room.users.length + users.length > MAX_PLAYER) {
            return false;
        }

        users.forEach(x=> {
            room.users.push(x);
        });

        this._rooms.set(room_id, room);
        this.BindToRoom(socket_id, room_id);
        return true;
    }

    LeaveRoom(socket_id: string, room_id: string) {
        this.BindToRoom(socket_id, "");

        if (this._rooms.has(room_id) && this._sockets.has(socket_id)) {
            let room = this._rooms.get(room_id);
            let socketUser = this._sockets.get(socket_id);

            //If game not start yet
            if (!room.in_game) {
                socketUser.user_id.forEach(x=> {
                    let r_index = room.users.findIndex(r_user => x == r_user);
                    room.users.splice(r_index, 1);
                });
            }

            //Empty room
            if (room.users.length <= 0) {
                this._rooms.delete(room_id);
            } else {
                //Transfer host to remaining user
                room.host_id = room.users[0];
                this._rooms.set(room_id, room);

                this._io.to(room_id).emit(UniversalSocketReplyEvent.RoomLeaved, JSON.stringify({ leave_users: socketUser.user_id, host:room.host_id }) );
            }
        };
    }

    Disconnect(socket_id: string) {
        if (!this._sockets.has(socket_id)) return;
        let socketUser = this._sockets.get(socket_id);

        this.LeaveRoom(socket_id, socketUser.room_id);
        
        socketUser.user_id.forEach(x=>{
            this._users.delete(x);
        });

        this._sockets.delete(socket_id);
    }

    private BindToRoom(socket_id: string, room_id: string) {
        if (this._sockets.has(socket_id)) {
            let s = this._sockets.get(socket_id);
            s.room_id = room_id;
            this._sockets.set(socket_id, s);
        }
    }
}