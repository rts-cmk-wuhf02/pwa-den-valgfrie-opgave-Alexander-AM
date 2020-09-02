const { dbClient, q } = require("../database");

exports.handler = async (event, context) => {
    if (event.httpMethod == "GET") {
        return {
            statusCode: 200,
            body: await dbClient
                .query(
                    q.Map(
                        q.Paginate(q.Documents(q.Collection("challenges"))),
                        q.Lambda((x) => q.Get(x))
                    )
                )
                .then((response) => {
                    return {
                        data: response.data.map((dat) => {
                            return dat.data;
                        }),
                    };
                })
                .catch((err) => {
                    return {
                        error: err,
                    };
                }),
        };
    } else {
        return {
            statusCode: 405,
            body: { error: "Invalid method." },
        };
    }
};
