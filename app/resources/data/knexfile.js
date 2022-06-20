const path = require('path');
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
      connection: `${__dirname}/../../../src/assets/database.db`,
      useNullAsDefault: true,
      migrations: {
        // Will create your migrations in the data folder automatically
        directory: `./migrations`
      },
      seeds: {
        // Will create your seeds in the data folder automatically
        directory: `./seeds`
      }
  },

  production: { }

};
