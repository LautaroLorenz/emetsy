/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries in foreign keys order
  await knex('meters').del();
  await knex('brands').del();
  await knex('constant_unit').del();
  await knex('connections').del();
  await knex('users').del();
};
