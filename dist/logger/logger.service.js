"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerSevice = void 0;
const tslog_1 = require("tslog");
class LoggerSevice {
    constructor() {
        this.logger = new tslog_1.Logger({
            displayInstanceName: false,
            displayLoggerName: false,
            displayFilePath: 'hidden',
            displayFunctionName: false,
        });
    }
    log(...args) {
        this.logger.info(...args);
    }
    error(...args) {
        this.logger.error(...args);
    }
    warn(...args) {
        this.logger.warn(...args);
    }
}
exports.LoggerSevice = LoggerSevice;
//# sourceMappingURL=logger.service.js.map