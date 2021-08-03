import db from "../../sqlz/models";

const cleanDatabase = async (): Promise<void> => {
  const tablesDestructionPromises = Object.keys(db.Sequelize.models).reduce(
    (cleanups: Promise<void>[], k) => [
      ...cleanups,
      db.Sequelize.models[k].destroy({ truncate: true, force: true }),
    ],
    []
  );
  await Promise.all(tablesDestructionPromises);
};

export default {
  cleanDatabase,
};
