/**
 * Contact Form API — Cloudflare Workers endpoint
 * POST /api/contact
 *
 * Accepts: { name, phone, email?, service?, message? }
 * Returns: { success: boolean, message: string, error?: string }
 *
 * Sends via: Telegram bot (simple, no auth needed)
 * Alternative: Resend, SendGrid, or email service
 */

import type { APIRoute } from "astro";

// Telegram bot configuration (set in env or wrangler.toml)
// Get token from @BotFather on Telegram
const TELEGRAM_BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID || "";

// Rate limiting: track submissions per IP (simple in-memory, use KV for production)
const submissionCache = new Map<string, number[]>();

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://alimran.clinic",
    "Access-Control-Allow-Methods": "POST",
  };

  // Rate limit: max 3 submissions per IP per hour
  const ip = clientAddress || request.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;

  const submissions = submissionCache.get(ip) || [];
  const recentSubmissions = submissions.filter((t) => t > hourAgo);

  if (recentSubmissions.length >= 3) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Too many submissions. Please try again in an hour.",
      }),
      { status: 429, headers }
    );
  }

  // Parse request body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid JSON" }),
      { status: 400, headers }
    );
  }

  const { name, phone, email, service, message } = body;

  // Validation
  if (!name || !phone) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Name and phone are required.",
      }),
      { status: 400, headers }
    );
  }

  // Basic phone format validation (simple)
  if (!/[\d\s\-\+]{7,}/.test(phone)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Please provide a valid phone number.",
      }),
      { status: 400, headers }
    );
  }

  // If Telegram not configured, return helpful error
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error(
      "Telegram config missing. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in wrangler.toml"
    );
    return new Response(
      JSON.stringify({
        success: false,
        error: "Contact form is temporarily unavailable. Please call us instead.",
      }),
      { status: 503, headers }
    );
  }

  // Format message for Telegram
  const telegramMessage = `
🏥 **New Contact Form Submission**

👤 **Name:** ${name}
📱 **Phone:** ${phone}
${email ? `📧 **Email:** ${email}` : ""}
${service ? `🔧 **Service:** ${service}` : ""}
${message ? `💬 **Message:** ${message}` : ""}

---
*Submitted from: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Baghdad" })}*
  `.trim();

  // Send to Telegram
  try {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: "Markdown",
      }),
    });

    if (!telegramResponse.ok) {
      const error = await telegramResponse.text();
      console.error("Telegram error:", error);
      throw new Error(`Telegram API error: ${telegramResponse.status}`);
    }

    // Track successful submission
    recentSubmissions.push(now);
    submissionCache.set(ip, recentSubmissions);

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Thank you for your inquiry! We'll be in touch soon at the number you provided.",
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error:
          "Failed to send message. Please call us at +964-780-1926-801 instead.",
      }),
      { status: 500, headers }
    );
  }
};

// Handle CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://alimran.clinic",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
