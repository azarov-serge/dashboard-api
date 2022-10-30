import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILoggerSevice } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IUsersController } from './users.controller.interface';
import { IUsersService } from './users.service.interface';
import 'reflect-metadata';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ValidateMiddleware } from './validate.middleware';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILoggerSevice) private loggerService: ILoggerSevice,
		@inject(TYPES.UsersService) private usersService: IUsersService,
	) {
		super(loggerService, 'users');

		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.usersService.validateUser(req.body);

		if (!result) {
			return next(new HTTPError(401, 'Error auth', 'login'));
		}

		this.ok(res, {});
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.usersService.createUser(req.body);

		if (!result) {
			return next(new HTTPError(422, 'User exists', 'users'));
		}

		this.ok(res, { email: result.email, id: result.id });
	}
}
