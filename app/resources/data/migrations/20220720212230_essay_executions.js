/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('essay_executions', (table) => {
      table.increments('id').notNullable().primary();
      table.string('essay_name');
      table.timestamp('execution_timestamp');
      table.string('report_raw_data');
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
