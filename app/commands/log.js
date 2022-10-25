const { ipcMain } = require('electron');
const fs = require("fs");

const logsdir = `${__dirname}/../../src/assets/logs`;

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