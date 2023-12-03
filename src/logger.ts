import log4js from "log4js";

export class Logger {
    static logLevel = "debug";
    static getLoggerInstance(loggerName: string) {
        const loggerObj = log4js.getLogger(loggerName);
        loggerObj.level = this.logLevel;
        return loggerObj;
    }

    static TRACE(loggerName: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName);
        loggerObj.trace(message);
    }

    static DEBUG(loggerName: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName);
        loggerObj.debug(message);
    }

    static INFO(loggerName: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName);
        loggerObj.info(message);
    }

    static WARN(loggerName: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName);
        loggerObj.warn(message);
    }

    static ERROR(loggerName: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName);
        loggerObj.error(message);
    }

    static FATAL(loggerName: string, message: String) {
        let loggerObj = this.getLoggerInstance(loggerName);
        loggerObj.fatal(message);
    }
}
