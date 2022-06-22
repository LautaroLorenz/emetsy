/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 * @Warning We need specific this id values (1 and 2).
 */
 exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('constant_unit').del()
  await knex('constant_unit').insert([
    { id: 1, name: 'Imp/KWhr' }, 
    { id: 2, name: 'Whr/Imp' },
  ]);
};