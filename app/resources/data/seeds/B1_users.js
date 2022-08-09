const { faker } = require('@faker-js/faker');

const names = ['Juan', 'Analia', 'Marisa', 'Estefania', 'Ramón', 'Florencia', 'Agustina', 'Franco', 'Dario', 'Augusto', 'José', 'Pedro', 'Rosa', 'Pablo', 'Marcelo'];
const surnames = ['Perez', 'Silva', 'Jofré', 'Banda', 'Bargas', 'Nina', 'Ugarte', 'Muiño', 'Sanchez', 'Quintana', 'Davalos', 'Corelli', 'Pellegrini', 'Furriel'];
const identifications = ['INGENIERIA', 'OPERACIONES', 'LABORATORIO', 'CALIDAD', 'LOGÍSTICA'];


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = {
      id: i + 1,
      name: names[faker.datatype.number({ min: 0, max: names.length - 1 })],
      surname: surnames[faker.datatype.number({ min: 0, max: surnames.length - 1 })],
      identification: identifications[faker.datatype.number({ min: 0, max: identifications.length - 1 })],
    };
    if (!users.some(u => {
      return u.name === user.name &&
        u.surname === user.surname &&
        u.identification === user.identification;
    })) {
      users.push(user);
    }
  }
  await knex('users').insert(users);
};
