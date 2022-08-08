/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('essay_templates_steps').insert([
    { id: 1, order: 1, essay_template_id: 1, step_id: 7, actions_raw_data: '{"actions":[{"actionName":"Identificación de usuario","userId":null},{"actionName":"Identificación de puestos","hasManufacturingInformation":false,"stands":[{"standIndex":1,"isActive":true,"meterId":12,"serialNumber":null,"yearOfProduction":null},{"standIndex":2,"isActive":false,"meterId":null,"serialNumber":null,"yearOfProduction":null},{"standIndex":3,"isActive":false,"meterId":null,"serialNumber":null,"yearOfProduction":null}]}]}' },
    { id: 2, order: 2, essay_template_id: 1, step_id: 6, actions_raw_data: '{"actions":[{"actionName":"Valores para ajuste de fotocélula","phaseL1":{"voltageU1":2200,"currentI1":40,"anglePhi1":0},"phaseL2":{"voltageU2":2200,"currentI2":40,"anglePhi2":0},"phaseL3":{"voltageU3":2200,"currentI3":40,"anglePhi3":0}},{"actionName":"Realizar ajuste de fotocélula","photocellAdjustmentExecutionComplete":null}]}' },
    { id: 3, order: 3, essay_template_id: 1, step_id: 4, actions_raw_data: '{"actions":[{"actionName":"Valores generales de la prueba","meterConstant":0,"phaseL1":{"voltageU1":2200,"currentI1":50,"anglePhi1":0},"phaseL2":{"voltageU2":2200,"currentI2":50,"anglePhi2":0},"phaseL3":{"voltageU3":2200,"currentI3":50,"anglePhi3":0}},{"actionName":"Parámetros para la prueba de contraste","maxAllowedError":1,"meterPulses":5,"numberOfDiscardedResults":0},{"actionName":"Realizar prueba de contraste","contrastTestExecutionComplete":null}]}' },
    { id: 4, order: 4, essay_template_id: 1, step_id: 1, actions_raw_data: '[]' },
    { id: 5, order: 1, essay_template_id: 2, step_id: 7, actions_raw_data: '{"actions":[{"actionName":"Identificación de usuario","userId":null},{"actionName":"Identificación de puestos","hasManufacturingInformation":false,"stands":[{"standIndex":1,"isActive":true,"meterId":12,"serialNumber":null,"yearOfProduction":null},{"standIndex":2,"isActive":true,"meterId":29,"serialNumber":null,"yearOfProduction":null},{"standIndex":3,"isActive":true,"meterId":24,"serialNumber":null,"yearOfProduction":null}]}]}' },
    { id: 6, order: 2, essay_template_id: 2, step_id: 1, actions_raw_data: '[]' },
  ]);
};
