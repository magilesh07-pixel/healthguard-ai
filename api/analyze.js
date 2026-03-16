module.exports.default = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, image, messages: historicalMessages } = req.body;

  try {
    let messages = [];

    // If historicalMessages exists, we are in "chat mode"
    if (historicalMessages && historicalMessages.length > 0) {
      messages = historicalMessages;
    } else {
      // Setup initial diagnostic prompt
      if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt in request body' });
      }

      messages = [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
          ],
        },
      ];

      // Add image if provided
      if (image) {
        messages[0].content.push({
          type: 'image_url',
          image_url: { url: image },
        });
      }
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: messages,
        // Only enforce JSON for the first diagnostic message
        response_format: (!historicalMessages || historicalMessages.length === 0) ? { type: 'json_object' } : undefined,
        temperature: 0.1,
      }),
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.json().catch(() => ({}));
      return res.status(groqResponse.status).json({ error: err.error?.message || 'Groq API error' });
    }

    const data = await groqResponse.json();
    const content = data.choices[0]?.message?.content;
    
    // Return parsed JSON for diagnostic, or raw text for chat
    if (!historicalMessages || historicalMessages.length === 0) {
      try {
        return res.status(200).json(JSON.parse(content));
      } catch (e) {
        // Fallback if JSON parsing fails
        return res.status(200).json({ findings: content, status: 'Requires Review', protocols: ["Manual verification required"] });
      }
    } else {
      return res.status(200).json({ content });
    }

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

