const { generator: fakerBySchema } = require('../faker-generator');

const schema = {
  // id: '{{datatype.number}}', // autogenerated number by database
  name: '{{name.findName}}',
  surname: '{{name.lastName}}',
  identification: '{{random.alphaNumeric(10)}}'
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // generate in batches so as not to overload the query
  for (let i = 0; i < 100; i++) {
    // generate faker rows data based on {{schema}}
    const fakeData = fakerBySchema(schema, 99, 100);
    // insert fake data into table
    await knex('users').insert(fakeData);
  }
};
