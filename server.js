import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct",
      {
        inputs: userMessage
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ reply: response.data[0].generated_text });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "HF API error" });
  }
});

app.get("/", (req, res) => {
  res.send("Qwen Proxy is working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
