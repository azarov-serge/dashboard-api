import { Server } from 'http';
import express, { Express } from 'express';
import { UsersController } from './users/users.controller';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILoggerSevice } from './logger/logger.interface';

export class App {
	app: Express;
	server?: Server;
	port: number;
	logger: ILoggerSevice;
	usersController: UsersController;
	exeptionFilter: ExeptionFilter;

	constructor(
		logger: ILoggerSevice,
		usersController: UsersController,
		exeptionFilter: ExeptionFilter
	) {
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

	public async init() {
		this.useRoutes();
		this.useExeptionFilters();

		this.server = this.app.listen(this.port);
		this.logger.log(`Start server http://localhost:${this.port}`);
	}
}
