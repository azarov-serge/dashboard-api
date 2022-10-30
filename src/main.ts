import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILoggerSevice } from './logger/logger.interface';
import { LoggerSevice } from './logger/logger.service';
import { IUserController } from './users/user.controller.interface';
import { UserController } from './users/user.controller';
import { IUserService } from './users/user.service.interface';
import { UserService } from './users/user.service';
import { TYPES } from './types';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILoggerSevice>(TYPES.ILoggerSevice).to(LoggerSevice);
	bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);

	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<App>(TYPES.App).to(App);
});

const bootstrap = (): IBootstrapReturn => {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.App);
	app.init();

	return { appContainer, app };
};

export const { appContainer, app } = bootstrap();
