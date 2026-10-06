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

const PI_API_BASE = "https://api.minepi.com/v2";
const PI_API_KEY = process.env.PI_API_KEY;

app.post("/api/payments/approve", async (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "paymentId is required" });
  }

  if (!PI_API_KEY) {
    return res.status(500).json({ error: "PI_API_KEY is not configured" });
  }

  try {
    const approval = await fetch(
      `${PI_API_BASE}/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`
        }
      }
    );

    const data = await approval.json();
    res.status(approval.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/payments/complete", async (req, res) => {
  const { paymentId, txid } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({
      error: "paymentId and txid are required"
    });
  }

  if (!PI_API_KEY) {
    return res.status(500).json({ error: "PI_API_KEY is not configured" });
  }

  try {
    const completion = await fetch(
      `${PI_API_BASE}/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ txid })
      }
    );

    const data = await completion.json();
    res.status(completion.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Land Holdings Pi server running on port ${PORT}`);
});