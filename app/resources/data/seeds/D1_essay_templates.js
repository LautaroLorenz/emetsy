const { faker } = require('@faker-js/faker');


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const mockData = [];

  // generate in batches so as not to overload the query
  for (let index = 1; index <= 30; index++) {
    mockData.push({
      id: index,
      name: faker.random.words(1),
    });
  }

  await knex('essay_templates').insert(mockData);
};
