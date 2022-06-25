const { ipcMain } = require('electron');

ipcMain.on("message", (event) => event.reply("reply", "pong"));

ipcMain.on("poc-quiero-la-tabla", (event, { table }) => {
  event.reply("poc-get-table-reply", { table, rows: ["row1", "row2"] })
});

ipcMain.handle('poc-borro-el-dato', (event, { id }) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`eliminado el id ${id}`);
    }, 5000);
  })
})
