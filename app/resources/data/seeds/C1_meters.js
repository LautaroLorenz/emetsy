const { faker } = require('@faker-js/faker');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const mockMeters = [];

  // generate in batches so as not to overload the query
  for (let index = 1; index <= 30; index++) {
    mockMeters.push({
      id: index,
      maximumCurrent: faker.datatype.number({ min: 1, max: 120 }),
      ratedCurrent: faker.datatype.number({ min: 1, max: 40 }),
      ratedVoltage: faker.datatype.number({ min: 1, max: 380 }),
      activeConstantValue: faker.datatype.number({ min: 1, max: 9999 }),
      reactiveConstantValue: faker.datatype.number({ min: 1, max: 9999 }),
      brand_id: faker.datatype.number({ min: 1, max: 11 }),
      activeConstantUnit_id: faker.datatype.number({ min: 1, max: 2 }),
      reactiveConstantUnit_id: faker.datatype.number({ min: 1, max: 2 }),
    });
  }

  await knex('meters').insert(mockMeters);
};
