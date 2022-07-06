const config = require('./data/knexfile');
const { setKnex: setAbmKnex } = require('../commands/abm');
const { setKnex: setEssayKnex } = require('../commands/essay');

let knex;

module.exports = {
  connect: ({ isProduction }) => {
    const environment = isProduction ? 'production' : 'development';
    knex = require('knex')(config[environment]);

    setAbmKnex(knex);
    setEssayKnex(knex);
  }
}