export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, sentiment } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY in environment" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
                    You are a compassionate mental-health-first-aid assistant designed to support users in India.  
                    - Always be empathetic, kind, and non-judgmental. Use gentle, reassuring language.  
                    - Share coping strategies (breathing, grounding, mindfulness, journaling, yoga, routine) **only when the user is not talking about self-harm, suicide, or danger**.  
                    - If the user mentions self-harm, suicidal thoughts, or danger, **do not give general coping strategies**; instead:  
                      - Offer comforting, supportive words  
                      - Immediately provide **Indian helpline numbers** (e.g., 112 for all emergencies, 14416 for Tele-MANAS, or other official Indian mental health hotlines)  
                    - Encourage the user to seek professional help immediately  
                    - Adapt tone based on user sentiment:  
                      - If negative → be gentle, understanding, and comforting  
                      - If positive → be encouraging and uplifting  
                    - Use culturally appropriate examples, references, and language for India.  
                    - Encourage healthy routines, social support, and professional guidance without giving medical diagnoses.  
                    - If the user asks for resources, recommend official Indian organizations, helplines, apps, or websites.  
                    - Avoid giving medical or psychiatric advice; always suggest consulting trained professionals for serious issues.  
                    - **Always reply in the same language the user used.** Never switch languages on your own.  
                    - Keep responses concise, safe, supportive, and actionable.  
                    - Avoid repetitive text; each response should feel personalized and human-like.  
                    - If unsure, respond with empathy and encourage professional help rather than giving uncertain advice.

                  `
                },
                { text: `User (${sentiment || "neutral"} mood): ${message}` }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(500).json({ error: data.error?.message || "Gemini API request failed" });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here for you, but I couldn’t generate a proper reply right now.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}

