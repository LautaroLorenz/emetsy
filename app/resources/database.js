const config = require('./data/knexfile');
const { setKnex: setAbmKnex } = require('../commands/abm')

let knex;

module.exports = {
  connect: ({ isProduction }) => {
    const environment = isProduction ? 'production' : 'development';
    knex = require('knex')(config[environment]);

    setAbmKnex(knex);
  }
}