const express = require("express");
const router = express.Router();
const axios = require("axios");

const multer = require("multer");
const pdfParse = require("pdf-parse");
const upload = multer(); // memory storage

// AI ASSISTANT CHATBOT

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ message: "Question is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        answer: "AI service not configured properly.",
      });
    }

    // STEP 1: AI CLASSIFIER
    const classificationResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a strict classifier.

Reply ONLY with:
YES → if the question is related to Indian law, courts, legal procedure, or CourtLink platform.
NO → if unrelated (technology, sports, movies, general chat, etc).
`,
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const classification =
      classificationResponse.data.choices?.[0]?.message?.content?.trim().toUpperCase();

    if (classification !== "YES") {
      return res.json({
        answer:
          "• I can only assist with Indian legal queries.\n• Please ask a legal question.\nConsult an advocate for final legal advice.",
      });
    }

    // STEP 2: REAL LEGAL ASSISTANT RESPONSE
    const systemPrompt = `
You are CourtLink AI Legal Assistant.

STRICT RULES:
- Provide only GENERAL legal information and procedure.
- DO NOT give legal advice.
- Use words like: "Generally", "Typically", "You may".
- Respond in maximum 6 bullet points.
- Each bullet must start with "• ".
- Do NOT write paragraphs.
- Do NOT invent laws or sections.
- End with:
Consult an advocate for final legal advice.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let answer =
      response.data.choices?.[0]?.message?.content?.trim() ||
      "No response from AI.";

    if (!answer.toLowerCase().includes("consult an advocate")) {
      answer += "\nConsult an advocate for final legal advice.";
    }

    return res.json({ answer });

  } catch (error) {
    console.error("Groq Error:", error.response?.data || error.message);

    return res.status(500).json({
      answer:
        "• AI service failed right now.\n• Please try again later.\nConsult an advocate for final legal advice.",
    });
  }
});


// AI CASE DESCRIPTION GENERATOR

router.post("/generate-case-description", async (req, res) => {
  try {
    const { case_title, case_type, user_input } = req.body;

    if (!case_title || !user_input) {
      return res.status(400).json({
        message: "case_title and user_input are required",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        message: "Groq API key missing in backend .env",
      });
    }

    const systemPrompt = `
You are CourtLink AI Case Filing Assistant.

RULES:
- Generate a professional case description for a client filing a case request.
- Do NOT give legal advice.
- Do NOT mention fake IPC sections.
- Use simple formal language.
- Output must be in paragraph format only.
- Keep it between 6 to 10 lines.
`;

    const userPrompt = `
Case Title: ${case_title}
Case Type: ${case_type || "Not specified"}
Client Explanation: ${user_input}

Write a proper case description including:
1) Background
2) Incident summary
3) Opposite party mention
4) Relief requested
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const description =
      response.data.choices?.[0]?.message?.content?.trim() ||
      "No response from AI.";

    return res.json({ description });
  } catch (error) {
    console.error(
      "AI case description error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "AI generation failed",
    });
  }
});

// AI DOCUMENT SUMMARIZER (PDF / TXT)

router.post("/summarize-document", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({
        message: "Groq API key missing in backend .env",
      });
    }

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      extractedText = data.text;
    }

    else if (req.file.mimetype === "text/plain") {
      extractedText = req.file.buffer.toString("utf-8");
    }

    else {
      return res.status(400).json({
        message: "Only PDF and TXT files are supported",
      });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({
        message: "File contains no readable text",
      });
    }

    const systemPrompt = `
You are CourtLink AI Legal Summarizer.

RULES:
- Summarize the court order in simple language.
- Use bullet points only.
- Maximum 8 bullet points.
- Each point must start with "• ".
- Do NOT give legal advice.
- Do NOT invent laws or sections.
- End with: "Consult an advocate for final legal advice."
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: extractedText.slice(0, 12000) },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let summary =
      response.data.choices?.[0]?.message?.content?.trim() ||
      "No summary generated.";

    if (!summary.toLowerCase().includes("consult an advocate")) {
      summary += "\nConsult an advocate for final legal advice.";
    }

    return res.json({ summary });

  } catch (error) {
    console.error("AI Summarizer Error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "AI summarization failed",
    });
  }
});

module.exports = router;
