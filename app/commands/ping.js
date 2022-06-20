const { ipcMain } = require('electron');

ipcMain.on("message", (event) => event.reply("reply", "pong"));
