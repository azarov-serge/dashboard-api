import { App } from './app';
import { ExeptionFilter } from './errors/exeption.filter';
import { LoggerSevice } from './logger/logger.service';
import { UsersController } from './users/users.controller';

const bootstrap = async () => {
	const logger = new LoggerSevice();
	const app = new App(
		logger,
		new UsersController(logger),
		new ExeptionFilter(logger)
	);

	app.init();
};

bootstrap();
