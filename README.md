# Watson in Support logger
Custom logger created by the IBM Watson in Support team that integrates 
multiple log mechanisms together in order to provide a unified logging
experience across different apps. Current logging mechanisms:
- Console
- Cloudant database

## Installation
```
npm install wis-logger
```

## Features
- Core logging functionality based on the 
  [bunyan logger](https://www.npmjs.com/package/bunyan).
- Integrates [bunyan-format](https://www.npmjs.com/package/bunyan-format)
  module to enhance bunyan log record formatting.
- Adds additional Cloudant logging capabilities to create log documents
  to any Cloudant database.
- Provides ability to customize Cloudant log document format.
  
## Introduction
Here's an example on how to create a basic Console logger.
```
const logger = require('wis-logger')({
    appName: 'logger-basic',
    level: 'DEBUG', 
});
logger.debug('A debug message');
logger.info('An info message');
logger.warn('A warning message');
logger.error('An error message');
```
The basic Console logger will produce this output:
```
[2017-10-29T21:58:58.919Z] DEBUG: logger-basic/17842 on ntsang-ibm.local: A debug message
[2017-10-29T21:58:58.922Z]  INFO: logger-basic/17842 on ntsang-ibm.local: An info message
[2017-10-29T21:58:58.922Z]  WARN: logger-basic/17842 on ntsang-ibm.local: A warning message
[2017-10-29T21:58:58.922Z] ERROR: logger-basic/17842 on ntsang-ibm.local: An error message
```
Here's an example of a logger with both Console logging and Cloudant logging.
```
const logger = require('wis-logger')({
    appName: 'logger-cloudant',
    level: 'DEBUG',
    console: true,
    cloudant: true,
    cloudantUrl: 'https://account.cloudant.com/logs',
    cloudantUsername: 'username',
    cloudantPassword: 'password',
    cloudantLogHistory: true,
});
logger.debug({message: 'A debug message'});
logger.info({message: 'An info message'});
logger.warn({messag`e: 'A warning message'});
logger.error({message: 'An error message'});
```
The Console/Cloudant logger will product this output:
```
[2017-10-29T21:58:58.929Z] DEBUG: logger-cloudant/17842 on ntsang-ibm.local:  (message="A debug message")
[2017-10-29T21:58:58.947Z]  INFO: logger-cloudant/17842 on ntsang-ibm.local:  (message="An info message")
[2017-10-29T21:58:58.950Z]  WARN: logger-cloudant/17842 on ntsang-ibm.local:  (message="A warning message")
[2017-10-29T21:58:58.951Z] ERROR: logger-cloudant/17842 on ntsang-ibm.local:  (message="An error message")
```
Each logger call will also create a Cloudant document with this default format:
```
{
  "_id": "607f6ddff4629c4516eac6169959bfed",
  "_rev": "1-e4dffd5dfff029d22f6924c49d0e85a7",
  "timestamp": "2017-10-31T00:17:52.326Z",
  "severity": "WARN",
  "hostname": "ntsang-ibm.local",
  "appName": "logger-examples",
  "pid": 25801,
  "message": "loggerCloudant debug test"
}
```
You may also find situations where you want to create a logger at a later stage
in your program or you want to dynamically create a logger on the fly. For 
these situations you can use the createLogger function.
```
const wisLogger = require('wis-logger');
const logger = wisLogger.createLogger({
    appName: 'logger-from-create',
    level: 'DEBUG', 
});
logger.debug({message: 'A debug message'});
``` 
When logging to Cloudant you may want to customize the format of the log 
record. You can do this by creating your own custom log record object
and passing it to the logger.
```
function CustomLogRecord(logRecord) {
    this.timestamp = logRecord.time;
    this.severity = logRecord.level;
    this.hostname = logRecord.hostname;
    this.appName = logRecord.name;
    this.pid = logRecord.pid;
    this.field1 = logRecord.field1;
    this.field2 = logRecord.field2;
}
const logger = require('wis-logger')({
    appName: 'logger-cloudant',
    level: 'DEBUG',
    console: true,
    cloudant: true,
    cloudantUrl: 'https://account.cloudant.com/logs',
    cloudantUsername: 'username',
    cloudantPassword: 'password',
    cloudantLogDocument: CustomLogRecord,
    cloudantLogHistory: true,
});
logger.debug({ field1: "field1 value", field2: "field2 value" });
```
