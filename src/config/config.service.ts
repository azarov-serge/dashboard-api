import { inject, injectable } from 'inversify';
import { DotenvParseOutput, config } from 'dotenv';
import { TYPES } from '../types';
import { IConfigService } from './config.service.inerface';
import { ILoggerSevice } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILoggerSevice) private logger: ILoggerSevice) {
		const result = config();
		this.config = {};

		if (result.error) {
			this.logger.error('[ConfigService] Can not read .env file or file is not exists');
		} else {
			this.logger.log('[ConfigService] Config .env vas loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
