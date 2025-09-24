// api/register.js
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get environment variables
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
  
  // Check if environment variables are set
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.error('Missing environment variables: BOT_TOKEN or ADMIN_CHAT_ID');
    return res.status(500).json({ 
      error: 'Server configuration error',
      ok: false 
    });
  }

  try {
    // Parse the request body
    let { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, and message are required',
        ok: false 
      });
    }

    // Trim and sanitize inputs
    name = name.trim();
    email = email.trim();
    message = message.trim();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        ok: false 
      });
    }

    // Format the current date and time
    const date = new Date().toLocaleString('en-GB', { 
      timeZone: 'UTC',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Create the Telegram message with proper Markdown escaping
    const escapeMarkdown = (text) => {
      return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
    };

    const telegramMessage = `📝 *New Contact Form Submission*\n\n` +
      `👤 *Name:* ${escapeMarkdown(name)}\n` +
      `📧 *Email:* ${escapeMarkdown(email)}\n` +
      `💬 *Message:* ${escapeMarkdown(message)}\n` +
      `\n⏱ _UTC_: ${date}`;

    // Send message to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'MarkdownV2',
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      console.error('Telegram API error:', telegramData);
      
      // Fallback: try without Markdown formatting
      const fallbackMessage = `📝 New Contact Form Submission\n\n` +
        `👤 Name: ${name}\n` +
        `📧 Email: ${email}\n` +
        `💬 Message: ${message}\n` +
        `\n⏱ UTC: ${date}`;

      const fallbackResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text: fallbackMessage,
        }),
      });

      const fallbackData = await fallbackResponse.json();

      if (!fallbackData.ok) {
        console.error('Telegram fallback also failed:', fallbackData);
        return res.status(500).json({ 
          error: 'Failed to send notification to Telegram',
          ok: false 
        });
      }
    }

    // Log successful submission (for debugging)
    console.log('Contact form submitted successfully:', {
      name,
      email: email.substring(0, 3) + '...', // Partial email for privacy
      messageLength: message.length,
      timestamp: new Date().toISOString()
    });

    // Return success response
    return res.status(200).json({ 
      ok: true,
      message: 'Contact form submitted successfully'
    });
    
  } catch (error) {
    console.error('Server error in register API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      ok: false,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
