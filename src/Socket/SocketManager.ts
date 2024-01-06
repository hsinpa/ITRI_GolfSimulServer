import * as socket from 'socket.io';
import SocketEnvironment from './SocketEnvironment';
import {FastifyInstance} from 'fastify'
import { SocketGeneralListener } from './SocketGeneralListener';
import { SocketAPI } from './SocketAPI';

export default class SocketManager {
    private io :socket.Server; 
    public env : SocketEnvironment;
    public api : SocketAPI;
    private general_listener: SocketGeneralListener;
    
    constructor(app : any) {

        app.ready((err: any) => {
            if (err) throw err;

            this.io = app.io;
            this.env = new SocketEnvironment(this.io);
            this.api = new SocketAPI(this.io, this.env);
            
            this.general_listener = new SocketGeneralListener(this.env);
            
            this.RegisterBasicListener();
        });
    }

    RegisterBasicListener() {
        console.log("Socket Register Basic Listener");

        let self = this;
        this.io.sockets.on('connection', function (socket) {
            console.log(socket.id + " is connect");
            
            self.general_listener.SetListener(socket);

            //Send back basic server info when user first connected
            socket.emit("OnConnect", JSON.stringify({
                    socket_id : socket.id,
                })
            );

            //When client discconected
            socket.on('disconnect', function () {
                console.log(socket.id + " is disconnect");
                self.env.Disconnect(socket.id);
            });
        });
    }

};

