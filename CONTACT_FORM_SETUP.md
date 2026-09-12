# Contact Form Setup Guide — Phase 4

**Goal:** Enable contact form submissions with Cloudflare Worker → Telegram integration

## Files Created

- `src/components/ContactForm.astro` — React form component with client-side validation
- `src/pages/api/contact.ts` — Cloudflare Worker endpoint
- `src/pages/contact.astro` — Updated contact page with form + map embed

## Prerequisites

1. **Telegram Bot** — Bot token from @BotFather on Telegram
2. **Telegram Chat ID** — Where to send notifications (private chat or group)
3. **Cloudflare Workers** — Already configured in astro.config.mjs

## Setup Steps

### Step 1: Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/start` then `/newbot`
3. Choose a name: "Alimran Contact Form Bot" (or similar)
4. Choose a username: "alimran_contact_bot" or similar
5. **Copy the bot token** — looks like: `123456789:ABCdEfGhIjKlMnOpQrStUvWxYz`

### Step 2: Get Your Chat ID

**Option A: Direct Message (Simple)**
1. Start a conversation with your new bot (search for the username)
2. Send any message
3. Go to: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Replace `<YOUR_BOT_TOKEN>` with your actual token
4. Look for `"chat":{"id":XXXXXXXXX}` — copy that number

**Option B: Group Chat**
1. Create a new Telegram group
2. Add your bot to the group
3. Run the getUpdates URL above
4. Copy the chat ID (will be negative, e.g., `-1001234567890`)

### Step 3: Configure Environment Variables

Edit `wrangler.toml` (Cloudflare Workers config):

```toml
[env.production]
vars = { TELEGRAM_BOT_TOKEN = "123456789:ABCdEfGhIjKlMnOpQrStUvWxYz", TELEGRAM_CHAT_ID = "1234567890" }
```

Or set via Cloudflare Workers Dashboard:
1. Go to your Worker in Cloudflare Dashboard
2. Settings → Environment Variables
3. Add:
   - `TELEGRAM_BOT_TOKEN` = your bot token
   - `TELEGRAM_CHAT_ID` = your chat ID

### Step 4: Test the Form

```bash
# Build the project
npm run build

# Preview locally (with Wrangler)
npm run preview

# Open http://localhost:3000/contact/ and test the form
```

**Expected behavior:**
- Form validates name + phone
- Click "Send Inquiry"
- After 1–2 seconds, success message appears
- Check your Telegram chat — message should arrive

## Form Fields

| Field | Required | Type | Purpose |
|-------|----------|------|---------|
| Name | ✓ | Text | Patient/inquirer name |
| Phone | ✓ | Tel | Contact number (stored as-is) |
| Email | ✗ | Email | Optional reply address |
| Service | ✗ | Select | Which service interested in |
| Message | ✗ | Textarea | Additional details |

## Rate Limiting

Form is rate-limited to **3 submissions per IP per hour** to prevent spam.

**Bypass (development only):**
Edit `src/pages/api/contact.ts` line ~35:
```typescript
if (recentSubmissions.length >= 3) {  // Change to >= 100 for testing
```

## Telegram Message Format

Submissions appear as:
```
🏥 **New Contact Form Submission**

👤 **Name:** Ahmed Al-Rashid
📱 **Phone:** +964-780-123-4567
📧 **Email:** ahmed@example.com
🔧 **Service:** Neurology & Neurosurgery
💬 **Message:** I have back pain for 3 months...

---
*Submitted from: 2026-09-12 14:30:00*
```

## Error Handling

**If submissions fail:**

1. **"Too many submissions"** (HTTP 429)
   - Wait 1 hour or clear IP cache

2. **"Invalid JSON"** (HTTP 400)
   - Check browser DevTools Console for errors
   - Ensure Content-Type is application/json

3. **"Contact form temporarily unavailable"** (HTTP 503)
   - Telegram config is missing
   - Check wrangler.toml for TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID

4. **"Network error"** (client-side)
   - Check Cloudflare Workers is deployed
   - Check internet connection
   - Try again in a few seconds

## Verification Checklist

- [ ] Telegram bot created (@BotFather)
- [ ] Bot token copied
- [ ] Chat ID obtained (via getUpdates)
- [ ] wrangler.toml updated with env vars
- [ ] Form loads at `/contact/`
- [ ] Form validates name + phone
- [ ] Form submission sends to Telegram
- [ ] Success message displays
- [ ] Phone numbers clickable on contact page
- [ ] Map loads (Google Maps embed)

## Alternative Integrations

**If Telegram doesn't work for your use case:**

### Option 1: Resend Email Service
```typescript
const resendResponse = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "noreply@alimran.clinic",
    to: "info@alimran.clinic",
    subject: `New Inquiry from ${name}`,
    html: `<p>Name: ${name}</p><p>Phone: ${phone}</p>...`,
  }),
});
```

### Option 2: Zapier Webhook
```typescript
await fetch("https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_ID/", {
  method: "POST",
  body: JSON.stringify({ name, phone, email, service, message }),
});
```

### Option 3: Email via SendGrid/Mailgun
Similar pattern to Resend — set API key in env, send to info@alimran.clinic

## Click-to-Call Verification

Phone numbers on contact page are already configured as `tel:` links:
```html
<a href="tel:+964-780-1926-801">+964-780-1926-801</a>
```

**Test:**
- On mobile: tap phone number → should open phone dialer
- On desktop: tap phone number → may open email client (normal)

## Map Embed

Google Maps iframe is embedded with:
- Center: 30.5156°N, 47.7804°E (Basra, Iraq)
- Zoom level: 15 (city block view)
- Responsive: stretches to container width

**Update the map link:**
Edit line in contact.astro:
```astro
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3373.72...
```

Get new embed code:
1. Go to Google Maps
2. Search "Breaha, Alnkba Medical Collection, Basra"
3. Click "Share" → "Embed a map"
4. Copy the iframe code

## Troubleshooting

### Form doesn't load
- Check browser console for JS errors
- Verify `/api/contact` endpoint is deployed
- Check that astro.config.mjs has cloudflare adapter

### Form submits but no Telegram message
- Verify bot token in wrangler.toml is correct
- Verify chat ID is correct (check via `getUpdates`)
- Check bot hasn't been banned/deleted
- Check bot has permission to send messages to chat

### Phone link doesn't work on mobile
- Ensure link is `<a href="tel:+964...">` format
- Test on actual phone (not emulator)
- Some phones may require specific link format

### "Contact form temporarily unavailable" error
- Open wrangler.toml
- Add missing env vars:
  ```toml
  vars = { TELEGRAM_BOT_TOKEN = "...", TELEGRAM_CHAT_ID = "..." }
  ```
- Redeploy: `npm run build && wrangler deploy`

## Production Deployment

```bash
# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy
# or
wrangler deploy

# Verify:
# - Visit https://alimran.clinic/contact/
# - Submit test form
# - Check Telegram for message
```

## Security Notes

1. **Bot token is sensitive** — don't commit to git
2. **Use environment variables** — wrangler.toml or Cloudflare Dashboard
3. **Rate limiting** — prevents abuse (3/hour per IP)
4. **CORS** — restricted to alimran.clinic origin
5. **Phone format validation** — basic regex, prevents obviously bad input

---

*Contact Form Setup Guide — Phase 4*  
*See IMPLEMENTATION_PLAN.md for timeline*
