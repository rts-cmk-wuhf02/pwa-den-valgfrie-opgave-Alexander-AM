exports.handler = async (event, context) => {
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