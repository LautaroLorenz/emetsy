const config = require('./data/knexfile');
const { ipcMain } = require('electron');

let knex;

module.exports = {
  connect: ({ isProduction }) => {
    const environment = isProduction ? 'production' : 'development';
    knex = require('knex')(config[environment]);

    let result = knex('users');
    result.then((rows) => {
      console.log(rows);
    });
  }
}