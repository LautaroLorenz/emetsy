const { ipcMain } = require('electron');
const fs = require("fs");

const { dirname } = require('path');
const logsdir = dirname(require.main.filename) + '/logs';

ipcMain.handle('get-log', (_, logdate) => {
    let output = '';
    try {
        output = fs.readFileSync(`${logsdir}/emetsy${logdate}.log`).toString();
    } catch (error) {
        output = `No hay log para la fecha ${logdate}`;
    } finally {
        return output;
    }
});