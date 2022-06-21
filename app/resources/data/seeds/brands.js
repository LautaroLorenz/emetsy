/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('brands').del()
  await knex('brands').insert([
    { name: 'Landis', model: 'Gyr E330', connection_id: 1 },
    { name: 'ABB', model: 'T8S1', connection_id: 1 },
    { name: 'Elster', model: 'A-1052', connection_id: 1 },
    { name: 'Elster', model: 'Alpha-2', connection_id: 1 },
    { name: 'Actaris', model: 'ACE-3000', connection_id: 1 },
    { name: 'Hexing', model: 'HXE-310', connection_id: 1 },
    { name: 'Landis', model: 'Gyr ZMG405', connection_id: 1 },
    { name: 'Elster', model: 'A-150', connection_id: 2 },
    { name: 'Actaris', model: 'ACE-1000', connection_id: 2 },
    { name: 'Landis', model: 'Gyr SP2301', connection_id: 2 },
    { name: 'ABB', model: 'M5A1', connection_id: 2 },
  ]);
};
