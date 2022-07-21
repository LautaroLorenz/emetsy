/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('essay_executions', (table) => {
      table.increments('id').notNullable().primary();
      table.string('actions_raw_data');
      table.integer('essay_template_id').notNullable().references('id').inTable('essay_templates').onDelete('RESTRICT');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("essay_executions");
};
