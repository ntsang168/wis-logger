const bunyan = require('bunyan');
const bformat = require('bunyan-format');
const needle = require('needle');

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
module.exports = function(options) {
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
        LogDocument: WiSLogDocument,
        logHistory: true,
        logFilePath: '',
        needleOpts: {
            json: true,
            auth: 'basic',
            username: '',
            password: '',
        },
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
        cloudantStreamOpts.needleOpts.username = options.cloudantUsername;
    }
    if (options.cloudantPassword) {
        cloudantStreamOpts.needleOpts.password = options.cloudantPassword;
    }
    if (options.cloudantLogDocument) {
        cloudantStreamOpts.LogDocument = options.cloudantLogDocument;
    }
    if (options.cloudantLogFilePath) {
        cloudantStreamOpts.logFilePath = options.cloudantLogFilePath;
    }

    // Define bunyan-format stream
    const formatOut = bformat({
        outputMode: bunyanOpts.outputMode,
        levelInString: true,
    });

    // Create CloudantStream history logger
    const streamsCloudant = [];
    if (cloudantStreamOpts.logFilePath) {
        streamsCloudant.push({
            path: cloudantStreamOpts.logFilePath,
        });
    } else {
        streamsCloudant.push({
            stream: formatOut,
        });
    }
    const loggerCloudant = bunyan.createLogger({
        name: 'wis-logger',
        streams: streamsCloudant,
    });

    // Define CloudantStream object
    function CloudantStream() {}
    CloudantStream.prototype.write = function (logRecord) {
        if (typeof (logRecord) !== 'object') {
            console.error(new Error('CloudantStream expecting an object logRecord but received: %j', logRecord));
        } else {
            logRecord.level = bunyan.nameFromLevel[logRecord.level].toUpperCase();
            const logDocument = new cloudantStreamOpts.LogDocument(logRecord);
            needle('post', cloudantStreamOpts.url, logDocument, cloudantStreamOpts.needleOpts)
                .then(function(response) {
                    if (cloudantStreamOpts.logHistory) {
                        if (response.statusCode === 200 || response.statusCode === 201) {
                            loggerCloudant.info({
                                result: 'Successfully created Cloudant log document',
                                statusCode: response.statusCode,
                                statusMessage: response.statusMessage,
                                body: response.body,
                            });
                        } else {
                            loggerCloudant.error({
                                result: 'Failed to create Cloudant log document',
                                statusCode: response.statusCode,
                                statusMessage: response.statusMessage,
                                body: response.body,
                            });
                        }
                    }
                })
                .catch(function(error) {
                    if (cloudantStreamOpts.logHistory) {
                        loggerCloudant.error('Request to Cloudant failed');
                        loggerCloudant.error(error);
                    }
                });
        }
    };

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
            stream: new CloudantStream(),
        });
    }

    // Create and return bunyan logger
    const logger = bunyan.createLogger({
        name: bunyanOpts.appName,
        level: bunyanOpts.level,
        streams,
    });
    return logger;
};
