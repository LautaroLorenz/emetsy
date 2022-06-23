/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 * @Warning We need specific this id values (1 and 2).
 */
 exports.seed = async function (knex) {
  await knex('constant_unit').insert([
    { id: 1, name: 'imp/Kvarh' }, 
    { id: 2, name: 'varh/imp' },
  ]);
};