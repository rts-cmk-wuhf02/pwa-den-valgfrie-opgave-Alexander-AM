const express = require("express");
const http = require("http");
const fs = require("fs");
const app = express();

app.use(express.static("./www"));

// Paths
/*app.get("/api/*", (req, res) => {
    res.json({ test: "test" });
});*/

app.get("/api/*", function(req, res) {
    let event, context;
    
    require(`.${req.originalUrl}`).handler(event, context, (un, data) => {
        res.status(data.statusCode).json(data.body);
    });
});

app.get("/*", (req, res) => {
    res.sendFile(req.url);
});

// Start server
http.createServer(app).listen(3000, () => {
    console.log("Listening on port 3000.");
});
