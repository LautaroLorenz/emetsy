/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 * @Warning We need specific this id values (1 and 2).
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('connections').del()
  await knex('connections').insert([
    { id: 1, name: 'Trifásico' }, 
    { id: 2, name: 'Monofásico' },
  ]);
};
