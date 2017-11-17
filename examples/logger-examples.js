/**
 * Before running these examples you will want to install the wis-logger to your project.
 *
 *   npm install wis-logger
 *
 * Then you can run the examples with the command
 *   node ./logger-examples.js
 *
 * To make the Cloudant logging work successfully you'll want to update the following parameters with real values
 *   cloudantUrl: 'https://youraccount.cloudant.com/logs',
 *   cloudantUsername: 'username',
 *   cloudantPassword: 'password',
 */

const wisLogger = require('wis-logger');

// Configure loggers using different log levels
const loggerDebug = require('wis-logger')({ appName: 'logger-examples-console', level: 'DEBUG' });
const loggerInfo = require('wis-logger')({ appName: 'logger-examples-console', level: 'INFO' });
const loggerWarn = require('wis-logger')({ appName: 'logger-examples-console', level: 'WARN' });

console.log("*** loggerDebug ***");
loggerDebug.debug('loggerDebug debug test');
loggerDebug.info('loggerDebug info test');
loggerDebug.warn('loggerDebug warn test');
loggerDebug.error('loggerDebug error test');

console.log("*** loggerInfo ***");
loggerInfo.debug('loggerInfo debug test');
loggerInfo.info('loggerInfo info test');
loggerInfo.warn('loggerInfo warn test');
loggerInfo.error('loggerInfo error test');

console.log("*** loggerWarn ***");
loggerWarn.debug('loggerWarn debug test');
loggerWarn.info('loggerWarn info test');
loggerWarn.warn('loggerWarn warn test');
loggerWarn.error('loggerWarn error test');

// Configure logger with JSON output
const loggerJson = require('wis-logger')({ appName: 'logger-examples-json', level: 'DEBUG', outputMode: 'json' });
console.log("*** loggerJson ***");
loggerJson.debug('loggerJson debug test');
loggerJson.info('loggerJson info test');
loggerJson.warn('loggerJson warn test');
loggerJson.error('loggerJson error test');

// Create a logger using the createLogger function
const loggerDebugFromCreate = wisLogger.createLogger({ appName: 'logger-examples-create', level: 'DEBUG' });
console.log("*** loggerDebugFromCreate ***");
loggerDebugFromCreate.debug('loggerDebugFromCreate debug test');
loggerDebugFromCreate.info('loggerDebugFromCreate info test');
loggerDebugFromCreate.warn('loggerDebugFromCreate warn test');
loggerDebugFromCreate.error('loggerDebugFromCreate error test');

// Configure logger to create log entries in Cloudant
const loggerCloudant = require('wis-logger')({
    appName: 'logger-examples-cloudant',
    level: 'DEBUG',
    outputMode: 'long',
    console: false,
    cloudant: true,
    cloudantUrl: 'https://youraccount.cloudant.com/logs',
    cloudantUsername: 'username',
    cloudantPassword: 'password',
    cloudantLogHistory: true,
});
console.log("*** loggerCloudant ***");
loggerCloudant.debug({ emittedBy: 'logger-examples', messageId: 'logger-examples-debug', message: 'loggerCloudant debug test', additionalInformation: {} });
loggerCloudant.info({ emittedBy: 'logger-examples', messageId: 'logger-examples-info', message: 'loggerCloudant info test', additionalInformation: {} });
loggerCloudant.warn({ emittedBy: 'logger-examples', messageId: 'logger-examples-warn', message: 'loggerCloudant warn test', additionalInformation: {} });
loggerCloudant.error({ emittedBy: 'logger-examples', messageId: 'logger-examples-error', message: 'loggerCloudant error test', additionalInformation: {} });

// Configure logger with custom log format for Cloudant
function CustomLogRecord(logRecord) {
    this.timestamp = logRecord.time;
    this.severity = logRecord.level;
    this.hostname = logRecord.hostname;
    this.appName = logRecord.name;
    this.pid = logRecord.pid;
    this.field1 = logRecord.field1;
    this.field2 = logRecord.field2;
}
const loggerCloudantCustomFormat = require('wis-logger')({
    appName: 'logger-examples-cloudant-custom',
    level: 'DEBUG',
    outputMode: 'long',
    console: false,
    cloudant: true,
    cloudantUrl: 'https://youraccount.cloudant.com/logs',
    cloudantUsername: 'username',
    cloudantPassword: 'password',
    cloudantLogDocument: CustomLogRecord,
    cloudantLogHistory: true,
});
console.log("*** loggerCloudantCustomFormat ***");
loggerCloudantCustomFormat.debug({ field1: "field1 value", field2: "field2 value" });
