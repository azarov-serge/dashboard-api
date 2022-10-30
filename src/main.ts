import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILoggerSevice } from './logger/logger.interface';
import { LoggerSevice } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { TYPES } from './types';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILoggerSevice>(TYPES.ILoggerSevice).to(LoggerSevice);
	bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);

	bind<UsersController>(TYPES.UsersController).to(UsersController);
	bind<App>(TYPES.App).to(App);
});

const bootstrap = () => {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.App);
	app.init();

	return { appContainer, app };
};

export const { appContainer, app } = bootstrap();
