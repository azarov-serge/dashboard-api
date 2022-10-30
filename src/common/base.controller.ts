import { Router, Response } from 'express';
import { injectable } from 'inversify';
import { ILoggerSevice } from '../logger/logger.interface';
import { ExpressReturnType, IRouteController } from './route.interface';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILoggerSevice, protected context: string) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send(res, 200, message);
	}

	public created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IRouteController[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] /${this.context}${route.path}`);
			const middlewares = route.middlewares?.map((item) => item.execute.bind(item));
			const handler = route.func.bind(this);
			const pipeline = middlewares ? [...middlewares, handler] : handler;

			this.router[route.method](route.path, pipeline);
		}
	}
}
