import { Resend } from "resend";
import { getResendApiKey, getAdminEmail, getCalcomLink } from "@/lib/env";
import type { AIEvaluation, PitchFormInput } from "@/types";

export async function sendPitchEmails(
  pitch: PitchFormInput,
  evaluation: AIEvaluation
): Promise<void> {
  const apiKey = getResendApiKey();
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = "BuildWithMe Studio <onboarding@resend.dev>";
  const calLink = getCalcomLink();
  const adminEmail = getAdminEmail();

  if (evaluation.overall_score >= 8) {
    await resend.emails.send({
      from,
      to: pitch.email,
      subject: `Shortlisted: ${pitch.project_title} — Book your call`,
      html: `
        <p>Hi ${pitch.founder_name},</p>
        <p>Your pitch scored <strong>${evaluation.overall_score}/10</strong>. You're shortlisted.</p>
        <p>${evaluation.executive_summary}</p>
        <p><a href="${calLink}">Book a 15-minute call</a></p>
      `,
    });

    if (adminEmail) {
      await resend.emails.send({
        from,
        to: adminEmail,
        subject: `[Shortlist] ${pitch.project_title} (${evaluation.overall_score}/10)`,
        html: `
          <p>New shortlisted pitch from ${pitch.founder_name} (${pitch.email})</p>
          <p>${evaluation.executive_summary}</p>
        `,
      });
    }
  } else {
    const feedback = evaluation.constructive_feedback
      .map((f) => `<li>${f}</li>`)
      .join("");
    await resend.emails.send({
      from,
      to: pitch.email,
      subject: `Feedback on ${pitch.project_title}`,
      html: `
        <p>Hi ${pitch.founder_name},</p>
        <p>Your overall score: <strong>${evaluation.overall_score}/10</strong>.</p>
        <ul>${feedback}</ul>
        <p>If you'd like to move forward anyway, I offer paid fast-track MVP sprints—reply to this email or book time: <a href="${calLink}">${calLink}</a></p>
      `,
    });
  }
}