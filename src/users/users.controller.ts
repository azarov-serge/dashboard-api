import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { sign } from 'jsonwebtoken';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { ILoggerSevice } from '../logger/logger.interface';
import { IConfigService } from '../config/config.service.inerface';
import { AuthGuardMiddleware } from '../common/auth.guard.middleware';
import { TYPES } from '../types';
import { IUsersController } from './users.controller.interface';
import { IUsersService } from './users.service.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ValidateMiddleware } from './validate.middleware';
import 'reflect-metadata';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILoggerSevice) private loggerService: ILoggerSevice,
		@inject(TYPES.UsersService) private usersService: IUsersService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
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
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuardMiddleware()],
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
		this.loggerService.log(`[UsersController] User with email ${req.body.email} was logged`);
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));

		this.ok(res, { jwt });
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

		this.loggerService.log(`[UsersController] User with email ${req.body.email} was registred`);
		this.ok(res, { email: result.email, id: result.id });
	}

	async info(req: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.usersService.getUserInfo(req.email);

		if (!userInfo) {
			res.status(404).send('User not found');
		}

		this.loggerService.log(`[UsersController] Get user info email ${req.body.email}`);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id, name: userInfo?.name });
	}

	private async signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(error, token) => {
					if (error) {
						reject(error);
					}

					resolve(token as string);
				},
			);
		});
	}
}
