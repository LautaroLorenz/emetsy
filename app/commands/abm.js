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

ipcMain.handle('add-to-table', async (_, { tableName, element }) => {
  const newElementsIds = await knex(tableName).insert(element);
  return newElementsIds;
});

ipcMain.handle('edit-from-table', async (_, { tableName, element }) => {
  const { id } = element;
  const numberOfElementsUpdated = await knex(tableName).update(element).where('id', id);
  return numberOfElementsUpdated;
});

module.exports = {
    setKnex: (args) => knex = args,
}
