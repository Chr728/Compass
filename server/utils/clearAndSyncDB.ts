import db from '../models';

const dropAndSyncDB = async () => {
    await db.sequelize.drop();
    await db.sequelize.sync({ force: true });
}

export default dropAndSyncDB;
