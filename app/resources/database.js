const config = require('./data/knexfile');
const { ipcMain } = require('electron');

let knex;

ipcMain.on('get-table', async (event, { tableName }) => {
  const queryBuilder = knex(tableName);
  const rows = await queryBuilder;
  event.reply('get-table-reply', { tableNameReply: tableName, rows });
});

module.exports = {
  connect: ({ isProduction }) => {
    const environment = isProduction ? 'production' : 'development';
    knex = require('knex')(config[environment]);
  }
}