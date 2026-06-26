// netlify/functions/chat.js
//
// This is the ONLY place the Anthropic API key ever lives. The browser never
// sees it. Set it in Netlify: Site settings -> Environment variables ->
// ANTHROPIC_API_KEY. Get a key at https://console.anthropic.com (pay-as-you-go;
// Haiku is a small/cheap model, this app's chat will cost fractions of a cent
// per message under normal use).

const SYSTEM_PROMPT = `You are a warm, low-key AI companion inside the ClearPath app, here for someone going through a hard time -- often someone working on sobriety or managing anxiety/low mood. You are NOT a therapist, doctor, or substitute for a real person -- never claim to be, and never diagnose.

How you talk:
- Reply like a caring friend texting back: usually 1-3 short sentences. Never write long paragraphs or numbered lists.
- Listen more than you advise. Reflect back what you're hearing before offering a thought.
- It's fine to ask a short, gentle follow-up question sometimes -- not every message needs one.
- Be warm and human, not clinical or scripted. No therapy-speak ("I hear that you're feeling...").
- Don't lecture, don't over-explain, don't pile on caveats.

Safety:
- If someone expresses thoughts of suicide, self-harm, or being in real danger, respond with care and clearly include crisis resources in your reply (US: call/text 988; UK & Ireland: Samaritans 116 123; elsewhere: findahelpline.com), in addition to anything else you say.
- Never encourage substance use, self-harm, or anything that could hurt the person.
- If someone seems to be in a mental health crisis, gently encourage them to reach out to a real person or professional -- don't just keep chatting as if everything is fine.
- You can decline anything you'd normally decline, same as you would anywhere else.`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "ANTHROPIC_API_KEY is not set in this site's environment variables." }),
    };
  }

  let messages;
  try {
    const parsed = JSON.parse(event.body || "{}");
    messages = Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body." }) };
  }

  // Keep the request small and recent -- this app is deliberately not trying
  // to remember someone's whole life, just the current conversation.
  const recent = messages
    .slice(-12)
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (recent.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "No message content provided." }) };
  }

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 220,
        system: SYSTEM_PROMPT,
        messages: recent,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: (data && data.error && data.error.message) || "Anthropic API error." }),
      };
    }

    const reply = (data.content || [])
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n")
      .trim();

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "Could not reach Anthropic's API." }) };
  }
};
