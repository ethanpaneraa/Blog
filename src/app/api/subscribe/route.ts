import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { ConfirmationEmail } from "@/emails/confirmation";
import { TABLES } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const { data: existingSubscriber } = await supabase
      .from(TABLES.SUBSCRIBERS)
      .select("*")
      .eq("email", email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.verified) {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 400 }
        );
      } else {
        const verificationToken = existingSubscriber.verification_token;
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify?token=${verificationToken}`;

        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: email,
          subject: "Confirm your subscription",
          react: ConfirmationEmail({ verificationUrl }) as React.ReactElement,
        });

        return NextResponse.json(
          { message: "Verification email sent" },
          { status: 200 }
        );
      }
    }

    const verificationToken = nanoid();
    const { error: insertError } = await supabase
      .from(TABLES.SUBSCRIBERS)
      .insert([
        {
          email,
          verification_token: verificationToken,
          verified: false,
        },
      ]);

    if (insertError) throw insertError;

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify?token=${verificationToken}`;
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Confirm your subscription",
      react: ConfirmationEmail({ verificationUrl }) as React.ReactElement,
    });

    return NextResponse.json(
      { message: "Please check your email to confirm your subscription" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
