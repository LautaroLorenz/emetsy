/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('essay_templates_steps').insert([
    { id: 1, order: 1, essay_template_id: 30, step_id: 6, actions_raw_data: '{"actions":[{"userId":null},{"stands":[{"isActive":true,"meterId":23},{"isActive":true,"meterId":23},{"isActive":true,"meterId":23}]}]}' },
    { id: 2, order: 2, essay_template_id: 30, step_id: 5, actions_raw_data: '{"actions":[{"phaseL1":{"voltageU1":1,"currentI1":2,"anglePhi1":0},"phaseL2":{"voltageU2":3,"currentI2":4,"anglePhi2":0},"phaseL3":{"voltageU3":5,"currentI3":6,"anglePhi3":0}}]}' },
    { id: 3, order: 3, essay_template_id: 30, step_id: 3, actions_raw_data: '{"actions":[{"testName":"Prueba de constraste 5%","meterConstant":1,"phaseL1":{"voltageU1":1,"currentI1":2,"anglePhi1":3},"phaseL2":{"voltageU2":4,"currentI2":5,"anglePhi2":6},"phaseL3":{"voltageU3":7,"currentI3":8,"anglePhi3":9}},{"maxAllowedError":10,"meterPulses":11},{"completionMode":0,"numberOfDiscardedResults":3}]}' },
  ]);
};
