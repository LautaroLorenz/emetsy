const { ipcMain } = require('electron');
const fs = require("fs");

const logsdir = '/Users/gabi/dev/emetsy';

ipcMain.handle('get-log', (_, logdate) => {
    console.log(logdate);
    let output = '';
    try {
        output = fs.readFileSync(`${logsdir}/emetsy${logdate}.log`).toString();
    } catch (error) {
        output = `No hay log para la fecha ${logdate}`;
    } finally {
        return output;
    }
});
