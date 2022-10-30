import { Server } from 'http';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILoggerSevice } from './logger/logger.interface';
import { UsersController } from './users/users.controller';
import { TYPES } from './types';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	server?: Server;
	port: number;

	constructor(
		@inject(TYPES.ILoggerSevice) private logger: ILoggerSevice,
		@inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.UsersController) private usersController: UsersController,
	) {
		this.app = express();
		this.port = 8000;
	}

	useRoutes(): void {
		this.app.use('/users', this.usersController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this));
	}

	public async init(): Promise<void> {
		this.useRoutes();
		this.useExeptionFilters();

		this.server = this.app.listen(this.port);
		this.logger.log(`Start server http://localhost:${this.port}`);
	}
}
