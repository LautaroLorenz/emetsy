/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
  return knex.schema
  .createTable('meters', (table) => {
    table.increments('id').primary();
    table.string('current').notNullable();
    table.string('voltage').notNullable();
    table.string('activeConstantValue').notNullable();
    table.string('reactiveConstantValue').notNullable();
    table.integer('brand_id').notNullable().references('id').inTable('brands').onDelete('RESTRICT');
    table.integer('activeConstantUnit_id').notNullable().references('id').inTable('constant_unit').onDelete('CASCADE');
    table.integer('reactiveConstantUnit_id').notNullable().references('id').inTable('constant_unit').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable("meters");
};
