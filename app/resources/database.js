const config = require('./data/knexfile');
const { ipcMain } = require('electron');

let knex;

const sendGetTableReply = async (reply, tableNameReply) => {
  const queryBuilder = knex(tableNameReply);
  const rows = await queryBuilder;
  reply('get-table-reply', { tableNameReply, rows });
};

ipcMain.on('get-table', ({ reply }, { tableName }) => {
  sendGetTableReply(reply, tableName);
});

ipcMain.handle('delete-from-table', async (_, { tableName, ids }) => {
  const numberOfElementsDeleted = await knex(tableName).delete().whereIn('id', ids);
  return numberOfElementsDeleted;
});

module.exports = {
  connect: ({ isProduction }) => {
    const environment = isProduction ? 'production' : 'development';
    knex = require('knex')(config[environment]);
  }
}