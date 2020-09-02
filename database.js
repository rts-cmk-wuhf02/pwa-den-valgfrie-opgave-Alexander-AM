const faunadb = require("faunadb");

const dbClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
});
const q = faunadb.query;

module.exports = { dbClient, q };
