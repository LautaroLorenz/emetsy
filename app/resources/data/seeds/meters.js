/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('meters').del()
  await knex('meters').insert([
    { id: 1, current: 10, voltage: 50, activeConstantValue: 5, reactiveConstantValue: 53, brand_id: 4, activeConstantUnit_id: 1, reactiveConstantUnit_id: 1 },
    { id: 2, current: 11, voltage: 60, activeConstantValue: 1, reactiveConstantValue: 21, brand_id: 1, activeConstantUnit_id: 1, reactiveConstantUnit_id: 1 },
    { id: 3, current: 12, voltage: 5, activeConstantValue: 50, reactiveConstantValue: 51, brand_id: 5, activeConstantUnit_id: 1, reactiveConstantUnit_id: 2 },
    { id: 4, current: 22, voltage: 33, activeConstantValue: 100, reactiveConstantValue: 3, brand_id: 2, activeConstantUnit_id: 1, reactiveConstantUnit_id: 2 },
    { id: 5, current: 23, voltage: 100, activeConstantValue: 2000, reactiveConstantValue: 700, brand_id: 4, activeConstantUnit_id: 2, reactiveConstantUnit_id: 1 },
    { id: 6, current: 40, voltage: 200, activeConstantValue: 304, reactiveConstantValue: 1000, brand_id: 7, activeConstantUnit_id: 2, reactiveConstantUnit_id: 1 },
    { id: 7, current: 7, voltage: 220, activeConstantValue: 51, reactiveConstantValue: 1899, brand_id: 3, activeConstantUnit_id: 2, reactiveConstantUnit_id: 2 },
    { id: 8, current: 13, voltage: 4, activeConstantValue: 53, reactiveConstantValue: 12, brand_id: 8, activeConstantUnit_id: 2, reactiveConstantUnit_id: 2 },
  ]);
};
