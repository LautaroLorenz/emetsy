/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('essay_templates_steps').insert([
    { id: 1, order: 1, essay_template_id: 30, step_id: 1, actions_raw_data: "" },
    { id: 2, order: 2, essay_template_id: 30, step_id: 2, actions_raw_data: "" },
    { id: 3, order: 3, essay_template_id: 30, step_id: 3, actions_raw_data: "" },
    { id: 4, order: 4, essay_template_id: 30, step_id: 4, actions_raw_data: "" },
    { id: 5, order: 5, essay_template_id: 30, step_id: 5, actions_raw_data: "" },
    { id: 6, order: 6, essay_template_id: 30, step_id: 2, actions_raw_data: "" },
    { id: 7, order: 1, essay_template_id: 29, step_id: 3, actions_raw_data: "" },
    { id: 8, order: 2, essay_template_id: 29, step_id: 4, actions_raw_data: "" },
    { id: 9, order: 3, essay_template_id: 29, step_id: 2, actions_raw_data: "" },
  ]);
};
