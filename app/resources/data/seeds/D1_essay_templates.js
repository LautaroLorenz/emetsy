const essays = ["Ensayo de contraste 1%", "Preparación"];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const mockData = [];

  // generate in batches so as not to overload the query
  for (let index = 1; index <= essays.length; index++) {
    mockData.push({
      id: index,
      name: essays[index - 1],
    });
  }

  await knex('essay_templates').insert(mockData);
};
