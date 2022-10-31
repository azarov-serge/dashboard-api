import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { JwtPayload, verify } from 'jsonwebtoken';

import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (error, payload) => {
				if (error) {
					next();
				} else if (payload) {
					req.email = (payload as JwtPayload).email;

					next();
				}
			});
		} else {
			next();
		}
	}
}
