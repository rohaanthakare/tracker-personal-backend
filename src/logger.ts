import log4js from "log4js";

export class Logger {
    static logLevel = "debug";
    static getLoggerInstance(loggerName: string, loggerMethod: string) {
        let loggerNameFinal = `[${loggerName} - ${loggerMethod}]`;
        const loggerObj = log4js.getLogger(loggerNameFinal);
        loggerObj.level = this.logLevel;
        return loggerObj;
    }

    static TRACE(loggerName: string, loggerMethod: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName, loggerMethod);
        loggerObj.trace(message);
    }

    static DEBUG(loggerName: string, loggerMethod: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName, loggerMethod);
        loggerObj.debug(message);
    }

    static INFO(loggerName: string, loggerMethod: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName, loggerMethod);
        loggerObj.info(message);
    }

    static WARN(loggerName: string, loggerMethod: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName, loggerMethod);
        loggerObj.warn(message);
    }

    static ERROR(loggerName: string, loggerMethod: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName, loggerMethod);
        loggerObj.error(message);
    }

    static FATAL(loggerName: string, loggerMethod: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName, loggerMethod);
        loggerObj.fatal(message);
    }
}
