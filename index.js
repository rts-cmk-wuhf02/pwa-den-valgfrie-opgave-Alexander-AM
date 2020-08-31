const express = require("express");
const http = require("http");
const app = express();

app.use(express.static("./www"));

// API paths
const apiBase = "/.netlify/functions/";

app.get(`${apiBase}*`, async (req, res) => {
    let event = {};
    let context = {};

    event.httpMethod = req.method;
    
    const data = await require(`./api/${req.originalUrl.substring(apiBase.length)}`).handler(event, context);
    res.status(data.statusCode).json(data.body);
});

// General paths
app.get("/*", (req, res) => {
    res.sendFile(req.url);
});

// Start server
http.createServer(app).listen(3000, () => {
    console.log("Listening on port 3000.");
});
