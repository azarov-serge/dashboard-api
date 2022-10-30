import { injectable } from 'inversify/lib/annotation/injectable';
import { Logger } from 'tslog';
import { ILoggerSevice } from './logger.interface';
import 'reflect-metadata';

@injectable()
export class LoggerSevice implements ILoggerSevice {
	public logger: Logger;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
	}

	public log(...args: unknown[]) {
		this.logger.info(...args);
	}

	public error(...args: unknown[]) {
		this.logger.error(...args);
	}

	public warn(...args: unknown[]) {
		this.logger.warn(...args);
	}
}
