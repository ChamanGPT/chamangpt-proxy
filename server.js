import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/chat", async (req, res) => {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: req.body.message })
            }
        );

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Proxy running on port 3000");
});
