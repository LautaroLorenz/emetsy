/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('essay_templates_steps').insert([
    { id: 1, essay_template_id: 1, step_id: 1 },
    { id: 2, essay_template_id: 1, step_id: 2 },
    { id: 3, essay_template_id: 1, step_id: 3 },
    { id: 4, essay_template_id: 1, step_id: 4 },
    { id: 5, essay_template_id: 1, step_id: 5 },
    { id: 6, essay_template_id: 1, step_id: 2 },
  ]);
};
