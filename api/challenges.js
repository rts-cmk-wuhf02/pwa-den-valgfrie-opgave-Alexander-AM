const faunadb = require("faunadb");

console.log(process.env);

const dbClient = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
});

exports.handler = async (event, context) => {
    await dbClient.query(faunadb.query.Get(faunadb.query.Ref(`challenges`)))
    .then((response) => {
        console.log('success', response);
    });


    if (event.httpMethod == "POST") {
        return {
            statusCode: 200,
            body: { data: "POST successful." },
        };
    } else if(event.httpMethod == "GET") {
        return {
            statusCode: 200,
            body: { data: "GET successful." },
        };
    } else {
        return {
            statusCode: 405,
            body: { error: "Invalid method." }
        }
    }
}