/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('steps').insert([
    { id: 1, name: 'Prueba de vacío' },
    { id: 2, name: 'Prueba de integración' },
    { id: 3, name: 'Prueba de constraste' },
    { id: 4, name: 'Prueba de arranque' },
    { id: 5, name: 'Ajuste de fotocélulas' },
    { id: 6, name: 'Preparación' },
  ]);
};
