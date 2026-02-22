const express = require("express");
const router = express.Router();
const axios = require("axios");

// ===============================
// AI ASSISTANT CHATBOT
// ===============================
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ message: "Question is required" });
    }

    const allowedKeywords = [
      "case",
      "court",
      "advocate",
      "law",
      "legal",
      "petition",
      "bail",
      "fir",
      "divorce",
      "property",
      "consumer",
      "complaint",
      "contract",
      "crime",
      "civil",
      "criminal",
      "document",
      "hearing",
      "evidence",
      "courtlink",
      "payment",
      "fees",
      "notice",
      "section",
      "ipc",
      "crpc",
      "maintenance",
      "alimony",
      "cheque",
      "fraud",
      "agreement",
      "lease",
      "rent",
    ];

    const lowerQ = question.toLowerCase();
    const isLegal = allowedKeywords.some((word) => lowerQ.includes(word));

    if (!isLegal) {
      return res.json({
        answer:
          "Sorry, I can only answer questions related to CourtLink and Indian legal procedures.\n• Please ask a legal question.\nConsult an advocate for final legal advice.",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.json({
        answer:
          "Groq API key is missing. Please add GROQ_API_KEY in backend .env file.\nConsult an advocate for final legal advice.",
      });
    }

    const systemPrompt = `
You are CourtLink AI Legal Assistant.

STRICT RULES:
- Provide only GENERAL legal information and procedure.
- DO NOT give legal advice or final recommendations.
- DO NOT say "you should file a case" or "you must do this".
- Use words like: "You may", "Usually", "Generally", "Typically".
- Do not mention fake laws or fake case references.
- Respond in maximum 6 bullet points only.
- Each bullet must start with "• ".
- Do not write paragraphs.
- If question is not about Indian law or CourtLink, refuse politely.

End with exactly:
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
      response.data.choices?.[0]?.message?.content || "No response from AI.";

    answer = answer.trim();

    if (!answer.includes("•")) {
      const lines = answer
        .split(".")
        .map((line) => line.trim())
        .filter((line) => line.length > 10);

      answer = lines
        .slice(0, 6)
        .map((l) => `• ${l}.`)
        .join("\n");
    }

    const bannedAdviceWords = [
      "you should",
      "you must",
      "definitely",
      "guaranteed",
      "sue",
      "file a case",
      "take legal action",
      "go to court immediately",
    ];

    const lowerAns = answer.toLowerCase();

    if (bannedAdviceWords.some((w) => lowerAns.includes(w))) {
      answer =
        "• I can provide only general legal information and procedure.\n" +
        "• Please consult an advocate for personalized legal advice.\n" +
        "Consult an advocate for final legal advice.";
    }

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

// ===============================
// AI CASE DESCRIPTION GENERATOR
// ===============================
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

module.exports = router;
