import { inject, injectable } from 'inversify';
import { PrismaClient, UserModel } from '@prisma/client';
import { ILoggerSevice } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILoggerSevice) private logger: ILoggerSevice) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] connected');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(`[PrismaService] connected failed ${error.message}`);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
