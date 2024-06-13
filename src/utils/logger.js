const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, errors } = format;

const env = process.env.NODE_ENV || 'development';

const customFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
};

const developmentLogger = createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: combine(
        timestamp(),
        errors({ stack: true }),
        customFormat
    ),
    transports: [
        new transports.Console()
    ]
});

const productionLogger = createLogger({
    levels: customLevels.levels,
    level: 'info',
    format: combine(
        timestamp(),
        errors({ stack: true }),
        customFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

const logger = env === 'development' ? developmentLogger : productionLogger;

winston.addColors(customLevels.colors);

module.exports = logger;
