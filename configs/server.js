"use strict";

import express from "express";
import http from 'http';
import { Server as SocketServer } from "socket.io";
import helmet from "helmet";
import morgan from "morgan";
import cors from 'cors';
import { dbConnection } from "./mongo.js";

import userRoutes from '../src/user/user.routes.js'
import postRoutes from '../src/post/post.routes.js'
let main = {};

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
   
    this.userPath = '/blog/v1/users'
    this.postPath = '/blog/v1/post'
    this.middlewares();
    this.conectarDB();
    this.routes();
    this.createServer();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(
      express.urlencoded({
        extended: false,
      })
    );
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  routes() {
    this.app.use(this.userPath, userRoutes);
    this.app.use(this.postPath, postRoutes);
  }

  createServer() {
    this.server = http.createServer(this.app);
    this.io = new SocketServer(this.server);
    
    main.io = this.io;

    this.io.on('connection', (socket) => {
      console.log('Un usuario se ha conectado');
    });
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Server running on port", this.port);
    });
  }
}

export { main, Server };
