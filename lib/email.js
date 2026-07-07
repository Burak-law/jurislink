import { Resend } from "resend";

// Real email sending via Resend (https://resend.com).
//
// If RESEND_API_KEY isn't set, we fall back to logging the email to the
// console instead of sending it — this keeps local development working
// even before you've set up an account, and avoids crashing the signup /
// password-reset flows.
//
// Setup:
//   1. Create a free account at https://resend.com
//   2. Create an API key and put it in .env as RESEND_API_KEY
//   3. For quick testing, EMAIL_FROM can stay as "JurisLink <onboarding@resend.dev>" —
//      Resend's shared sandbox domain. Check your Resend dashboard for its current
//      sending limits (it's meant for testing, not production traffic).
//   4. For production, verify your own domain in the Resend dashboard and
//      change EMAIL_FROM to an address on that domain (e.g. "JurisLink <noreply@yourdomain.com>").

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({ to, subject, html }) {
  if (!resend) {
    console.log("\n---- EMAIL (dev mode — RESEND_API_KEY not set, not actually sent) ----");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log(html.replace(/<[^>]+>/g, " ").trim());
    console.log("------------------------------------------------------------------------\n");
    return { sent: false, reason: "no-api-key" };
  }

  const from = process.env.EMAIL_FROM || "JurisLink <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({ from, to, subject, html });

  if (error) {
    console.error("Resend email error:", error);
    return { sent: false, reason: "send-failed", error };
  }

  return { sent: true, id: data?.id };
}
