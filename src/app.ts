import { Server } from 'http';
import express, { Express } from 'express';
import { LoggerSevice } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import {ExeptionFilter} from './errors/exeption.filter';


export class App {
    app: Express;
    server?: Server;
    port: number;
    logger: LoggerSevice;
    usersController: UsersController;
    exeptionFilter: ExeptionFilter

    constructor (logger: LoggerSevice, usersController: UsersController, exeptionFilter: ExeptionFilter) {
        this.app = express();
        this.port = 8000;
        this.logger = logger;
        this.usersController = usersController;
        this.exeptionFilter = exeptionFilter;
    }

    useRoutes() {
        this.app.use('/users', this.usersController.router);
    } 

    useExeptionFilters() {
        this.app.use(this.exeptionFilter.catch.bind(this));
    }

    public async init () {
        this.useRoutes();

        this.server = this.app.listen(this.port);
        this.logger.log(`Start server http://localhost:${this.port}`);
    }
}