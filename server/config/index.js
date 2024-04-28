const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URI);

(
    async () => await sequelize.authenticate()
        .then(() => console.log("DEBUG: Connected to the database"))
        .catch((error) => console.error("Unable to connect to the database:", error))
)()

module.exports = { pg: sequelize };