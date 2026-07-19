# Future Features

## Email notifications (recommended: Resend)

Notify invitees by email instead of relying on manually sharing links.

- **Provider:** Resend (free tier ~3,000 emails/month, single HTTPS POST from
  the server). Alternatives: Postmark, SendGrid, Mailgun, Amazon SES.
- **Features:**
  - Email each invitee their unique respond link when they're added
    (requires adding an optional `email` field to invitees)
  - "Notify everyone" button on the calendar page when a date is settled
- **Setup required:**
  - Resend API key stored as a Railway environment variable
  - To send from `@fulgent.org` addresses, verify the domain with the
    provider by adding SPF/DKIM DNS records at DreamHost
- **Avoid raw SMTP:** Railway restricts SMTP ports on lower-tier plans, and
  transactional APIs have better deliverability and tracking anyway.

## SMS notifications (lower priority)

Same idea via text message. More friction than email:

- **Provider:** Twilio (or Vonage, AWS SNS)
- **Costs:** rented phone number (~$1–2/month) plus per-message fees
  (~$0.008/msg US)
- **Compliance:** US traffic requires A2P 10DLC registration for reliable
  delivery
- For a friends-scheduling app, email is dramatically less hassle — only
  worth it if people miss the emails.
