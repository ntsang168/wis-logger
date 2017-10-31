function WiSLogRecord(logRecord) {
    this.timestamp = logRecord.time;
    this.severity = logRecord.level;
    this.hostname = logRecord.hostname;
    this.appName = logRecord.name;
    this.pid = logRecord.pid;
    this.emittedBy = logRecord.emittedBy;
    this.messageId = logRecord.messageId;
    this.message = logRecord.message;
    this.additionalInformation = logRecord.additionalInformation;
}

module.exports = WiSLogRecord;
