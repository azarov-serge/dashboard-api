import { Request, Response, NextFunction } from 'express';


import { IMiddleware } from './middleware.interface';

export class AuthGuardMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			return next();
		}

		res.status(401).send({ error: 'Not auth user' });
	}
}
