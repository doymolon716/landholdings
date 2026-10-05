const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Land Holdings Pi"
  });
});

app.get("/validation-key.txt", (req, res) => {
  res.sendFile(__dirname + "/validation-key.txt");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Land Holdings Pi server running on port ${PORT}`);
});