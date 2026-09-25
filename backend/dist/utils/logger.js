"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class Logger {
    format(level, message, meta) {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
    }
    info(message, meta) {
        console.log(this.format('info', message, meta));
    }
    warn(message, meta) {
        console.warn(this.format('warn', message, meta));
    }
    error(message, meta) {
        console.error(this.format('error', message, meta));
    }
    debug(message, meta) {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(this.format('debug', message, meta));
        }
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map