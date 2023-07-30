import Fastify from 'fastify'
import Models from './Model/Models';
import Routes from './Router/Routes';
import fastifyIO from "fastify-socket.io";
import SocketManager from './Socket/SocketManager';

const dotenv = require('dotenv');
dotenv.config();

const env = process.env;

const fastify = Fastify({
  logger: false
})

fastify.register(fastifyIO);

const models = new Models(env);
const routes = new Routes(fastify, models);
const socketManager = new SocketManager(fastify);
  
// Run the server!
fastify.listen({ port: 8025 }, function (err, address) {
if (err) {
    fastify.log.error(err)
    process.exit(1)
}
// Server is now listening on ${address}
})