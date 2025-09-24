// api/feedback.js
export default async function handler(req, res) {
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
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Parse the request body
    const { name, email, message, type = 'feedback' } = req.body;
    
    // Validate required fields
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format the current date and time
    const date = new Date().toLocaleString('en-GB', { 
      timeZone: 'UTC',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create the Telegram message based on type
    const isContact = type === 'contact';
    const telegramMessage = 
      (isContact ? '📞 *New Contact Request*' : '💡 *New Feedback Submission*') + '\n\n' +
      `👤 *Name:* ${name || 'Not provided'}\n` +
      `📧 *Email:* ${email || 'Not provided'}\n` +
      `💬 *${isContact ? 'Project Details' : 'Feedback'}:* ${message}\n` +
      `\n⏱ _UTC_: ${date}`;

    // Send message to Telegram
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return res.status(500).json({ error: 'Failed to send notification' });
    }

    // Return success response
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
