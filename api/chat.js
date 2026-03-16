module.exports.default = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages array in request body' });
  }

  const systemPrompt = {
    role: 'system',
    content: `You are Dr. M.B.Magilesh, a highly knowledgeable, empathetic, and professional AI medical consultant for the HealthGuard AI platform.

Your role:
- Answer health-related questions with clinical accuracy and compassion
- Provide personalized advice based on what the patient tells you (age, symptoms, risk scores, vitals, etc.)
- Use markdown formatting: **bold** for important terms, bullet points for lists
- Keep responses concise but complete — 3 to 6 paragraphs maximum
- If a patient mentions a specific value (like risk score 90, BP 130/80, BMI 28), acknowledge it specifically and give tailored advice
- Always end with a relevant follow-up question or next step to keep the consultation going
- Remind the patient that your advice is informational and they should see a real doctor for diagnosis

Restrictions:
- Stay strictly within medical and health topics
- Do not diagnose definitively — say "this may suggest" or "this could indicate"
- If someone mentions an emergency (chest pain, stroke, difficulty breathing), immediately tell them to call emergency services (112/911)
- Never provide specific drug dosages or prescriptions
- Be warm, professional, and use "sir" or appropriate address when the patient uses it`
  };

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.json().catch(() => ({}));
      return res.status(groqResponse.status).json({ error: err.error?.message || 'Groq API error' });
    }

    const data = await groqResponse.json();
    const content = data.choices[0]?.message?.content;
    return res.status(200).json({ content });

  } catch (error) {
    console.error('AI Doctor API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
