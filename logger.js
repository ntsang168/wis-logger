const bunyan = require('bunyan');
const bformat = require('bunyan-format');

const CloudantStream = require('./lib/cloudant-stream');
const WiSLogDocument = require('./lib/wis-log-document');

/**
 * Creates custom bunyan logger
 *
 * @function
 * @param options {Options}
 *  - appName: name of the app used by this logger
 *  - level (true): TRACE|DEBUG|INFO|WARN|ERROR|FATAL
 *  - outputMode: short|long|simple|json|bunyan
 *  - console (true): flag to turn console logging on/off
 *  - cloudant (false): flag to turn Cloudant database logging on/off
 *  - cloudantUrl: URL to a Cloudant database e.g. https://accountname.cloudant.com/logs
 *  - cloudantUsername: Cloudant username or app key
 *  - cloudantPassword: Cloudant password
 *  - cloudantLogDocument: custom log document constructor to control Cloudant document format
 *  - cloudantLogHistory (true): flag to turn Cloudant connection history logging on/off
 *  - cloudantLogFilePath: log file path for storing history of Cloudant connections
 * @return {Logger} bunyan logger
 */
function Logger(options) {
    // Set default bunyan options
    const bunyanOpts = {
        appName: 'wis-logger',
        level: 'DEBUG',
        // short|long|simple|json|bunyan
        outputMode: 'long',
        console: true,
        cloudant: false,
    };

    // Set default CloudantStream options
    const cloudantStreamOpts = {
        url: '',
        username: '',
        password: '',
        LogDocument: WiSLogDocument,
        logHistory: true,
        logFilePath: '',
    };

    // Update options based on parameters
    if (options.appName) {
        bunyanOpts.appName = options.appName;
    }
    if (options.level) {
        bunyanOpts.level = options.level;
    }
    if (options.outputMode) {
        bunyanOpts.outputMode = options.outputMode;
    }
    if (typeof options.console === 'boolean' && options.console === false) {
        bunyanOpts.console = false;
    }
    if (typeof options.cloudant === 'boolean' && options.cloudant === true) {
        bunyanOpts.cloudant = true;
    }
    if (options.cloudantUrl) {
        cloudantStreamOpts.url = options.cloudantUrl;
    }
    if (options.cloudantUsername) {
        cloudantStreamOpts.username = options.cloudantUsername;
    }
    if (options.cloudantPassword) {
        cloudantStreamOpts.password = options.cloudantPassword;
    }
    if (options.cloudantLogDocument) {
        cloudantStreamOpts.LogDocument = options.cloudantLogDocument;
    }
    if (typeof options.cloudantLogHistory === 'boolean' && options.cloudantLogHistory === false) {
        cloudantStreamOpts.logHistory = false;
    }
    if (options.cloudantLogFilePath) {
        cloudantStreamOpts.logFilePath = options.cloudantLogFilePath;
    }

    // Define bunyan-format stream
    const formatOut = bformat({
        outputMode: bunyanOpts.outputMode,
        levelInString: true,
    });

    // Set bunyan streams
    const streams = [];
    if (bunyanOpts.console) {
        streams.push({
            stream: formatOut,
        });
    }
    if (bunyanOpts.cloudant) {
        streams.push({
            type: 'raw',
            stream: new CloudantStream(cloudantStreamOpts),
        });
    }

    // Create and return bunyan logger
    const logger = bunyan.createLogger({
        name: bunyanOpts.appName,
        level: bunyanOpts.level,
        streams,
    });
    return logger;
}

module.exports = Logger;

module.exports.createLogger = function createLogger(options) {
    return new Logger(options);
};