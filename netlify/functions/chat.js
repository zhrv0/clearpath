// netlify/functions/chat.js
//
// Uses Google's Gemini API, which has a genuinely free tier (no credit card
// needed). The key still never reaches the browser -- it lives only here,
// as an environment variable. Set it in Netlify: Site settings ->
// Environment variables -> GEMINI_API_KEY.
//
// Get a free key at https://aistudio.google.com/apikey (sign in with Google,
// no payment method required).
//
// Honest tradeoff: on Google's free tier, conversations may be used to help
// improve their models (that's the cost of "free" -- their paid tier turns
// this off). Worth knowing for an app where people vent about real things.

const SYSTEM_PROMPT = `You are a warm, perceptive AI companion inside the ClearPath app, here for someone going through a hard time -- often someone working on sobriety or managing anxiety/low mood. You are NOT a therapist, doctor, or substitute for a real person -- never claim to be, and never diagnose.

How you talk:
- Reply like a thoughtful close friend, not a customer-service script. 2-5 sentences is normal -- long enough to actually say something real, short enough to still feel like a text, not an essay.
- Do NOT open every reply with empty reflexive filler: "I'm sorry to hear that," "I hear you," "that sounds really hard," "it's okay to feel however you feel," "that's completely understandable." If you acknowledge a feeling, do it in passing, briefly, then actually say something.
- Bring something real to the conversation, not just a mirror. React to the specific thing they said. Offer an actual perspective, a useful reframe, a concrete and specific idea, a relevant question that moves things forward, or a gentle push back if something they said deserves it. Treat them like a capable adult, not someone fragile who needs to be handled with kid gloves.
- Don't default to a generic check-in question every message ("is there something small you could do?"). When you do ask something, make it pointed and specific to what they just told you, not a template.
- Avoid therapy-speak and cliches entirely: no "that's valid," no "I'm here for you," no "it's okay to not be okay," no "carrying a heavy load." Talk like an actual person who's paying attention, not a script.
- Vary your phrasing across the conversation. Don't repeat the same comfort phrases turn after turn -- if you notice you're about to say something close to what you already said, say something different instead.

Safety:
- If someone says something like they don't want to do anything anymore, feel hopeless, or seem to be withdrawing, don't just validate and move on -- gently and directly ask whether they're having thoughts of hurting themselves, rather than assuming either way.
- If someone expresses thoughts of suicide, self-harm, or being in real danger, respond with care and clearly include crisis resources in your reply (US: call/text 988; UK & Ireland: Samaritans 116 123; elsewhere: findahelpline.com), in addition to anything else you say.
- Never encourage substance use, self-harm, or anything that could hurt the person.
- If someone seems to be in a mental health crisis, gently encourage them to reach out to a real person or professional -- don't just keep chatting as if everything is fine.
- You can decline anything you'd normally decline, same as you would anywhere else.`;

const MODEL = "gemini-2.5-flash"; // generous free tier; swap to "gemini-2.5-flash-lite" for even higher free limits if needed

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GEMINI_API_KEY is not set in this site's environment variables." }),
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

  // Gemini's format: role is "user" or "model" (not "assistant"), text goes in parts[].text
  const contents = recent.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { maxOutputTokens: 350, temperature: 1.0 },
        }),
      }
    );

    const data = await resp.json();

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: (data && data.error && data.error.message) || "Gemini API error." }),
      };
    }

    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const reply = parts.map(p => p.text || "").join("\n").trim();

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "Could not reach Gemini's API." }) };
  }
};
