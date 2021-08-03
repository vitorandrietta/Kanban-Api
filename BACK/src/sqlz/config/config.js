require("dotenv").config();

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: "postgres",
  define: {
    underscored: true,
    underscoredAll: true,
  },
  host: "127.0.0.1",
};
