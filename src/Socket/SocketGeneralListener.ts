import * as socket from 'socket.io';
import SocketEnvironment from './SocketEnvironment';
import { UniversalSocketEvent, UniversalSocketReplyEvent } from '../Utility/Flag/EventFlag';
import { ErrorSocketMessge, UserComponentType, GolfFieldType } from '../Utility/Flag/TypeFlag';

export class SocketGeneralListener {
    _env: SocketEnvironment;

    constructor(env: SocketEnvironment) {
        this._env = env;
    }

    SetListener(socket :socket.Socket) {
        let self = this;

        socket.on(UniversalSocketEvent.SelfRegister, function (data: string) {
            let parseData = JSON.parse(data);

            let device_id : string = parseData["device_id"];

            if (device_id != null && device_id != "")
                self._env.devices.set(device_id, socket.id);
        });
        
        socket.on(UniversalSocketEvent.UserRegister, function (data: string) {
            let parseData = JSON.parse(data);

            let users : UserComponentType[]= parseData["user_array"];
            let user_id_array = users.map(x=>x.user_id);
            
            let duplicate_users = self._env.FindExitingUsers(user_id_array);
            let is_valid = duplicate_users.length <= 0;

            if (is_valid) self._env.RegisterUser(socket.id, users);


            socket.emit(UniversalSocketReplyEvent.UserRegister,JSON.stringify( {status: is_valid, result: duplicate_users}) );
        });

        socket.on(UniversalSocketEvent.RoomCreate, function (data: string) {
            let parseData : GolfFieldType = JSON.parse(data);
            let socketComp = self._env.GetSocketComp(socket.id);

            if (socketComp == null) return;
            //Leave previous room if exist
            self._env.LeaveRoom(socketComp.socket_id, socketComp.room_id);

            let room_id = self._env.CreateRoom(socket.id, parseData, socketComp.user_id);

            console.log(`${socketComp.socket_id} RoomCreate -> ${room_id}`);
            socket.join(room_id);

            socket.emit(UniversalSocketReplyEvent.RoomCreate, JSON.stringify({status: true, result: room_id}) );
        });

        socket.on(UniversalSocketEvent.RoomJoined, function (data: string) {
            let parseData = JSON.parse(data);
            let room_id : string = parseData["room_id"];
            let socketComp = self._env.GetSocketComp(socket.id);

            if (socketComp == null) return;

            //Leave previous room if exist
            self._env.LeaveRoom(socketComp.socket_id, socketComp.room_id);

            let has_join = self._env.JoinRoom(socket.id, room_id, socketComp.user_id);
            let roomComp = self._env.GetRoom(room_id);

            if (!has_join || roomComp == null) {
                socket.emit(UniversalSocketReplyEvent.RoomJoined, {status: false, result: ErrorSocketMessge.Join_Room_Full});
                return;
            }

            socket.to(room_id).emit(UniversalSocketReplyEvent.NewUserJoined, JSON.stringify({result: self._env.GetSocketUser(socket.id)}) );
            socket.emit(UniversalSocketReplyEvent.RoomJoined, JSON.stringify({status: true, result: self._env.GetUsers(roomComp.users)}) );

            socket.join(room_id);
        });

        socket.on(UniversalSocketEvent.RoomStart, function () {
            let socketComp = self._env.GetSocketComp(socket.id);
            let room_id : string = socketComp.room_id;

            if (room_id == null) return;

            let room = self._env.GetRoom(room_id);
            if (room == null) {
                socket.emit(UniversalSocketReplyEvent.RoomStart, JSON.stringify({status: false, result : ErrorSocketMessge.Room_Not_Exist} ));
                return;
            }

            //Check if user is host
            let hott_index = socketComp.user_id.findIndex(x=>x == room.host_id);
            if (hott_index < 0) {
                socket.emit(UniversalSocketReplyEvent.RoomStart, JSON.stringify({status: false, result : ErrorSocketMessge.Room_Wrong_Owner} ));
                return;
            }
    
            //Broadcast to everyone
            self._env.StartRoom(room_id);
            socket.to(room_id).emit(UniversalSocketReplyEvent.RoomStart);
            socket.emit(UniversalSocketReplyEvent.RoomStart);
        });

        socket.on(UniversalSocketEvent.RoomLeaved, function () {
            let socketComp = self._env.GetSocketComp(socket.id);
            if (socketComp == null || socketComp.room_id == null) return;

            self._env.LeaveRoom(socket.id, socketComp.room_id);
        });
    }

}