const logger = require('electron-log');
const path = require('path');

const { getNowDate } = require('../utils/date');

const { dirname } = require('path');
const logsdir = dirname(require.main.filename) + '/logs';

let logChunk = [];
const SIZE_POLICY = 10;
const TIME_MS_POLICY = 10000;
let intervalToLog = setInterval(writeChunk, TIME_MS_POLICY);


exports.log = (logLine) => {
    logChunk.push(logLine);
    if (logChunk.length > SIZE_POLICY) {
        writeChunk();
    }
}

function resetTimer() {
    clearInterval(intervalToLog);
    intervalToLog = setInterval(writeChunk, TIME_MS_POLICY);
}

function writeChunk() {
    resetTimer();
    if (logChunk.length > 0) {
        logger.transports.file.resolvePath = () => path.join(logsdir, `emetsy${getNowDate()}.log`);
        logChunk.forEach(logLine => {      
            logger.info(logLine);
        });
        logChunk = []   
    }
}