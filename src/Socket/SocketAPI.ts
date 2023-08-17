import * as socket from 'socket.io';
import SocketEnvironment from './SocketEnvironment';

export class SocketAPI {
    private _io: socket.Server;
    private _env: SocketEnvironment;

    constructor(io: socket.Server, environment: SocketEnvironment) {
        this._io = io;
        this._env = environment;
    }

    SendLoginSuccessEvent(target_id: string, stringify_json: string) {
        if (!this._env.devices.has(target_id)) return;

        let socket_id = this._env.devices.get(target_id);
        this._io.to(socket_id).emit(stringify_json);
    }
}