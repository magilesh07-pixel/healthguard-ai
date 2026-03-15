export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, image } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  try {
    const messages = [
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

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        messages: messages,
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.json().catch(() => ({}));
      return res.status(groqResponse.status).json({ error: err.error?.message || 'Groq API error' });
    }

    const data = await groqResponse.json();
    const content = data.choices[0]?.message?.content;
    return res.status(200).json(JSON.parse(content));

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
