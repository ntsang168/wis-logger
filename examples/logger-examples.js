/**
 * Various wis-logger examples that you can run with the command
 *   node ./logger-examples.js
 *
 * To make the Cloudant logging work successfully you'll want to update the following parameters with real values
 *   cloudantUrl: 'https://youraccount.cloudant.com/logs',
 *   cloudantUsername: 'username',
 *   cloudantPassword: 'password',
 *
 * For your application you will replace
 *   require('../logger')
 *   with
 *   require('wis-logger')
 */

// Configure loggers using different log levels
const loggerDebug = require('../logger')({ appName: 'logger-examples', level: 'DEBUG' });
const loggerInfo = require('../logger')({ appName: 'logger-examples', level: 'INFO' });
const loggerWarn = require('../logger')({ appName: 'logger-examples', level: 'WARN' });

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
const loggerJson = require('../logger')({ appName: 'logger-examples', level: 'DEBUG', outputMode: 'json' });

console.log("*** loggerJson ***");
loggerJson.debug('loggerJson debug test');
loggerJson.info('loggerJson info test');
loggerJson.warn('loggerJson warn test');
loggerJson.error('loggerJson error test');

// Configure logger to have additional Cloudant logging
const loggerCloudant = require('../logger')({
    appName: 'logger-examples',
    level: 'DEBUG',
    outputMode: 'long',
    console: true,
    cloudant: true,
    cloudantUrl: 'https://youraccount.cloudant.com/logs',
    cloudantUsername: 'username',
    cloudantPassword: 'password',
    cloudantLogHistory: true,
    // cloudantLogFilePath: 'logger-cloudant.log',
});

console.log("*** loggerCloudant ***");
loggerCloudant.debug({ emittedBy: 'logger-examples', messageId: 'logger-examples-debug', message: 'loggerCloudant debug test', additionalInformation: {} });
loggerCloudant.info({ emittedBy: 'logger-examples', messageId: 'logger-examples-info', message: 'loggerCloudant info test', additionalInformation: {} });
loggerCloudant.warn({ emittedBy: 'logger-examples', messageId: 'logger-examples-warn', message: 'loggerCloudant warn test', additionalInformation: {} });
loggerCloudant.error({ emittedBy: 'logger-examples', messageId: 'logger-examples-error', message: 'loggerCloudant error test', additionalInformation: {} });
