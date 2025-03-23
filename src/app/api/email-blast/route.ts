import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { renderAsync } from "@react-email/render";
import BlogNotificationEmail from "@/emails/blog-notification";
import { NextResponse } from "next/server";

interface EmailBlastRequest {
  title: string;
  excerpt: string;
  slug: string;
  customMessage?: string;
  testMode?: boolean;
}

type EmailError = Error | unknown;

export async function POST(request: Request) {
  try {
    if (
      !process.env.RESEND_API_KEY ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      console.log("Missing env vars:", {
        resend: !!process.env.RESEND_API_KEY,
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      });
      return NextResponse.json(
        { error: "Missing required environment variables" },
        { status: 500 }
      );
    }

    const body: EmailBlastRequest = await request.json();
    if (!body.title || !body.excerpt || !body.slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: subscribers, error } = await supabase
      .from("personal_blog_subscribers")
      .select("email")
      .eq("verified", true)
      .eq("is_test_subscriber", body.testMode || false);

    if (error) {
      console.error("Failed to fetch subscribers:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscribers" },
        { status: 500 }
      );
    }

    const subscriberEmails = subscribers.map((sub) => sub.email);
    if (subscriberEmails.length === 0) {
      return NextResponse.json(
        {
          message: body.testMode
            ? "No test subscribers found"
            : "No subscribers found",
        },
        { status: 400 }
      );
    }

    console.log(
      `Sending to ${subscriberEmails.length} ${body.testMode ? "test " : ""}subscribers:`,
      subscriberEmails
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const results = await Promise.allSettled(
      subscriberEmails.map(async (email) => {
        const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
        const emailHtml = await renderAsync(
          BlogNotificationEmail({
            title: body.title,
            excerpt: body.excerpt,
            slug: body.slug,
            baseUrl,
            unsubscribeUrl,
            customMessage: body.customMessage,
          })
        );

        return resend.emails.send({
          from: process.env.EMAIL_FROM || "newsletter@joshuapineda.com",
          to: email,
          subject: `new blog post: ${body.title}`,
          html: emailHtml,
        });
      })
    );

    const summary = results.reduce(
      (acc, result) => {
        if (result.status === "fulfilled") {
          acc.successful++;
        } else {
          acc.failed++;
          acc.errors.push(result.reason);
        }
        return acc;
      },
      { successful: 0, failed: 0, errors: [] as EmailError[] }
    );

    return NextResponse.json({
      message: body.testMode
        ? "Test email blast completed"
        : "Email blast completed",
      summary: {
        totalEmails: subscriberEmails.length,
        ...summary,
      },
    });
  } catch (error) {
    console.error("Email blast failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
