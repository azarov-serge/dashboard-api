import { Server } from 'http';
import express, { Express } from 'express';
import { json } from 'body-parser';
import { inject, injectable } from 'inversify';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILoggerSevice } from './logger/logger.interface';
import { IConfigService } from './config/config.service.inerface';
import { UsersController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';
import { TYPES } from './types';
import 'reflect-metadata';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	server?: Server;
	port: number;

	constructor(
		@inject(TYPES.ILoggerSevice) private logger: ILoggerSevice,
		@inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersController) private userController: UsersController,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());

		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware))
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();

		await this.prismaService.connect();

		this.server = this.app.listen(this.port);
		this.logger.log(`Start server http://localhost:${this.port}`);
	}
}
