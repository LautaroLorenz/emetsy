const { ipcMain } = require('electron');

let knex;

const essayTemplateCreateOrEdit = async (essayTemplate, transaction) => {
  const querybuilder = knex('essay_templates').transacting(transaction);
  const essayTemplateCopy = { ...essayTemplate };
  essayTemplateCopy.name = (essayTemplateCopy.name || '').toString().trim();
  if (essayTemplateCopy.id) {
    await querybuilder.update(essayTemplateCopy).where('id', essayTemplateCopy.id);
  } else {
    const [newEssayTemplateId] = await (querybuilder.insert(essayTemplateCopy));
    essayTemplateCopy.id = newEssayTemplateId;
  }
  return essayTemplateCopy;
}
const formatEssayTemplateSteps = (essayTemplateSteps, essayTemplateId) => essayTemplateSteps
  .map((essayTemplateStep, index) => ({
    ...essayTemplateStep,
    order: index + 1,
    essay_template_id: essayTemplateId,
  }));
const essayTemplateStepsUpdateExisting = async (essayTemplateSteps, transaction) => {
  const essayTemplateStepsToUpdate = essayTemplateSteps.filter(({ id }) => id);
  for await (const et of essayTemplateStepsToUpdate) {
    const { id, essay_template_id, step_id, order } = et;
    await knex('essay_templates_steps')
      .transacting(transaction)
      .update({ id, essay_template_id, step_id, order })
      .where('id', id);
  }
  return essayTemplateStepsToUpdate;
}
const essayTemplateStepsCreateNews = async (essayTemplateSteps, transaction) => {
  const essayTemplateStepsToCreate = essayTemplateSteps.filter(({ id }) => !id);
  for await (const et of essayTemplateStepsToCreate) {
    const { essay_template_id, step_id, order } = et;
    const [id] = await knex('essay_templates_steps')
      .transacting(transaction)
      .insert({ essay_template_id, step_id, order });
    et.id = id;
  }
  return essayTemplateStepsToCreate;
}
const essayTemplateStepsDeleteOlds = async (essayTemplateId, essayTemplateStepsUpdated, transaction) => {
  const querybuilder = knex('essay_templates_steps').transacting(transaction);
  const oldEssayTemplateSteps = await querybuilder.select('id').where('essay_template_id', essayTemplateId);
  const essayTemplateStepsToDelete = oldEssayTemplateSteps
    .filter(({ id }) => essayTemplateStepsUpdated.includes(id))
    .map(({ id }) => id);
  if (essayTemplateStepsToDelete.length > 0) {
    await querybuilder.delete().whereIn('id', essayTemplateStepsToDelete);
  }
}

ipcMain.handle('save-essay-template', async (_, { essayTemplate, essayTemplateSteps }) => {
  // open database transaction
  return await knex.transaction(async (transaction) => {
    essayTemplate = await essayTemplateCreateOrEdit(essayTemplate, transaction);
    essayTemplateSteps = formatEssayTemplateSteps(essayTemplateSteps, essayTemplate.id);
    const essayTemplateStepsUpdated = await essayTemplateStepsUpdateExisting(essayTemplateSteps, transaction);
    const essayTemplateStepsCreated = await essayTemplateStepsCreateNews(essayTemplateSteps, transaction);
    await essayTemplateStepsDeleteOlds(essayTemplate.id, essayTemplateStepsUpdated, transaction);
    essayTemplateSteps = [...essayTemplateStepsUpdated, ...essayTemplateStepsCreated];
    return { essayTemplate, essayTemplateSteps };
  });
});

module.exports = {
  setKnex: (args) => knex = args,
}
