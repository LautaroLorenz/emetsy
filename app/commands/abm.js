const { ipcMain } = require('electron');

let knex;

ipcMain.on('get-table', async ({ reply }, dbTableConnection) => {
  const { tableName, relations } = dbTableConnection;
  const queryBuilder = knex(tableName);
  const relationsMap = {};  
  const rows = await queryBuilder;
  for await (const relation of relations) {
    relationsMap[relation] = await knex(relation);
  }
  reply('get-table-reply', { tableNameReply: tableName, rows, relations: relationsMap });
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
