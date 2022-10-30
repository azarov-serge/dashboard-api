import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILoggerSevice } from './logger/logger.interface';
import { LoggerSevice } from './logger/logger.service';
import { IUsersController } from './users/users.controller.interface';
import { UsersController } from './users/users.controller';
import { IUsersService } from './users/users.service.interface';
import { UsersService } from './users/users.service';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.inerface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILoggerSevice>(TYPES.ILoggerSevice).to(LoggerSevice).inSingletonScope();
	bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter).inSingletonScope();

	bind<IUsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();

	bind<IUsersService>(TYPES.UsersService).to(UsersService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();

	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();

	bind<App>(TYPES.App).to(App).inSingletonScope();
});

const bootstrap = (): IBootstrapReturn => {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.App);
	app.init();

	return { appContainer, app };
};

export const { appContainer, app } = bootstrap();
