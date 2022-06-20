/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, name: 'Hettie', surname: 'lantunde', identification: 'asdqwfqg'},
    {id: 2, name: 'Hester Owens', surname: 'zo', identification: 'erhreh3'},
    {id: 3, name: 'Henry', surname: 'bekamohi', identification: '34urtjrtee'}
  ]);
};
