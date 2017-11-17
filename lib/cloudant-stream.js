const bunyan = require('bunyan');
const bformat = require('bunyan-format');
const needle = require('needle');

function CloudantStream(options) {
    const self = this;
    self.config = options;
    if (!options) {
        throw new TypeError('options (object) is required');
    }

    const formatOut = bformat({
        outputMode: 'long',
        levelInString: true,
    });

    let streams = [];
    if (options.logFilePath) {
        streams.push({
            path: options.logFilePath,
        });
    } else {
        streams.push({
            stream: formatOut,
        });
    }

    self.logger = bunyan.createLogger({
        name: 'wis-logger',
        streams,
    });
}

CloudantStream.prototype.write = function (logRecord) {
    const self = this;
    if (typeof (logRecord) !== 'object') {
        if (self.config.logHistory) {
            self.logger.error('CloudantStream expecting an object logRecord but received', logRecord);
        }
    } else {
        logRecord.level = bunyan.nameFromLevel[logRecord.level].toUpperCase();
        const logDocument = new self.config.LogDocument(logRecord);
        const needleOpts = {
            json: true,
            auth: 'basic',
            username: self.config.username,
            password: self.config.password,
        };
        needle('post', self.config.url, logDocument, needleOpts)
            .then(function(response) {
                if (self.config.logHistory) {
                    if (response.statusCode === 200 || response.statusCode === 201) {
                        self.logger.info({
                            result: 'Successfully created Cloudant log document',
                            statusCode: response.statusCode,
                            statusMessage: response.statusMessage,
                            body: response.body,
                        });
                    } else {
                        self.logger.error({
                            result: 'Failed to create Cloudant log document',
                            statusCode: response.statusCode,
                            statusMessage: response.statusMessage,
                            body: response.body,
                        });
                    }
                }
            })
            .catch(function(error) {
                if (self.config.logHistory) {
                    self.logger.error('Request to Cloudant failed');
                    self.logger.error(error);
                }
            });
    }
};

module.exports = CloudantStream;