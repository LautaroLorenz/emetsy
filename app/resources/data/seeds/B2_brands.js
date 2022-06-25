/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('brands').insert([
    { id: 1, name: 'Landis', model: 'Gyr E330', connection_id: 1, pepe_column: "sarasa" },
    { id: 2, name: 'ABB', model: 'T8S1', connection_id: 1, pepe_column: "" },
    { id: 3, name: 'Elster', model: 'A-1052', connection_id: 1, pepe_column: "" },
    { id: 4, name: 'Elster', model: 'Alpha-2', connection_id: 1, pepe_column: "" },
    { id: 5, name: 'Actaris', model: 'ACE-3000', connection_id: 1, pepe_column: "" },
    { id: 6, name: 'Hexing', model: 'HXE-310', connection_id: 1, pepe_column: "" },
    { id: 7, name: 'Landis', model: 'Gyr ZMG405', connection_id: 1, pepe_column: "" },
    { id: 8, name: 'Elster', model: 'A-150', connection_id: 2, pepe_column: "" },
    { id: 9, name: 'Actaris', model: 'ACE-1000', connection_id: 2, pepe_column: "" },
    { id: 10, name: 'Landis', model: 'Gyr SP2301', connection_id: 2, pepe_column: "" },
    { id: 11, name: 'ABB', model: 'M5A1', connection_id: 2, pepe_column: "" },
  ]);
};
