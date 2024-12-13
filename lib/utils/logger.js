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

    const callerFile = stack[2] && stack[2].getFileName();
    return path.basename(callerFile || 'unknown');
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
