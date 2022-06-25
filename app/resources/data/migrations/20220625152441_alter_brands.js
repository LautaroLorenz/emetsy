/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .alterTable('brands', (table) => {
      table.string('pepe_column').notNullable().defaultTo("");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .table('brands', (table) => {
      table.dropColumn('pepe_column');
    });
};
