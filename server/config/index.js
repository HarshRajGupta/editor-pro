const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URI);

(
    async () => await sequelize.authenticate()
        .then(() => console.log("DEBUG: Connected to the database"))
        .catch((error) => console.error("Unable to connect to the database:", error))
)()

const pick = (obj, keys) => keys.reduce((o, k) => ({ ...o, [k]: obj[k] }), {});

module.exports = { pg: sequelize, pick };