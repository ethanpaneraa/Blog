import { Resend } from "resend";
import { renderAsync } from "@react-email/render";
import BlogNotificationEmail from "@/emails/blog-notification";

export async function GET() {
  if (!process.env.RESEND_API_KEY) {
    return new Response("Resend API key not found", { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const testEmail = process.env.TEST_EMAIL || "";
  const baseUrl = process.env.SITE_URL || "";

  const post = {
    title: "Internship Guide",
    excerpt:
      "A guide to getting internships and navigating the tech industry as a student.",
    slug: "internship-guide",
  };

  try {
    const emailHtml = await renderAsync(
      BlogNotificationEmail({
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        baseUrl: baseUrl,
        unsubscribeUrl: `${baseUrl}/unsubscribe?email=${testEmail}`,
        customMessage:
          "hey there, with winter quarter wrapped up, i've finally taken the time to get back into writing. i hope you all have a great break. if you're looking for something to read up on, i wrote two new blog posts. one is a guide for succeeding in your internships, and the other is a reflection and advice for building personal projects. i hope you enjoy them",
      })
    );

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "",
      to: testEmail,
      subject: `New blog post: ${post.title}`,
      html: emailHtml,
    });

    return Response.json({ success: true, result });
  } catch (error) {
    console.error("Failed to send email:", error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}
