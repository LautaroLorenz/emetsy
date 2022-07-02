const { ipcMain } = require('electron');
const log = require('electron-log');
const SIZE_POLICY = 10;
const TIME_MS_POLICY = 10000;

let logChunk = []
let interval = setInterval(writeChunk, TIME_MS_POLICY);

const logFunctions = {
    error: log.error,
    warn: log.warn,
    info: log.info,
    debug: log.debug
}

ipcMain.on("log", (_, {mode, message}) => {
    logChunk.push({mode, message});
    if (logChunk.length > SIZE_POLICY) {
        writeChunk();
    }
});

function resetTimer() {
    clearInterval(interval);
    interval = setInterval(writeChunk, TIME_MS_POLICY);
}

function writeChunk() {
    resetTimer();
    logChunk.forEach(e => {
        logFunctions[e.mode](e.message)
    });
    logChunk = []
}