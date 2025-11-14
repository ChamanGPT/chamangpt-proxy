import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Load HF_TOKEN from Render environment variables
const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
  console.error("❌ ERROR: Missing HF_TOKEN environment variable!");
}

app.post("/proxy", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: userPrompt })
      }
    );

    const data = await response.json();
    return res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Proxy server running on port " + PORT);
});
