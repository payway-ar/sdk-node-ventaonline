const path = require('path');

const logLevels = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
};

function getCallerFile() {
    const originalFunc = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    const stack = err.stack;
    Error.prepareStackTrace = originalFunc;

    const callerStack = stack.find((frame) => {
        const fileName = frame.getFileName();
        return fileName && fileName !== __filename;
    });

    return callerStack ? path.basename(callerStack.getFileName()) : 'unknown';
}

function log(level, message) {
    const timestamp = new Date().toISOString();
    const location = getCallerFile();
    console.log(`[${timestamp}] [${level}] [${location}] ${message}`);
}

module.exports = {
    log,
    info: (message) => log(logLevels.INFO, message),
    warn: (message) => log(logLevels.WARN, message),
    error: (message) => log(logLevels.ERROR, message),
    debug: (message) => log(logLevels.DEBUG, message),
};
