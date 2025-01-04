const { createClient } = require("@supabase/supabase-js");
const { Resend } = require("resend");
const React = require("react");
const { renderAsync } = require("@react-email/render");

async function sendNotifications() {
  console.log("Starting notification process...");

  const newPosts = process.env.NEW_POSTS
    ? JSON.parse(process.env.NEW_POSTS)
    : [];
  console.log("Posts to notify about:", newPosts);

  if (newPosts.length === 0) {
    console.log("No posts to notify about. Exiting...");
    return;
  }

  console.log("Initializing Resend...");
  const resend = new Resend(process.env.RESEND_API_KEY);

  // In test mode, only use the test email
  let subscriberEmails;
  if (process.env.TEST_MODE === "true") {
    console.log("Running in test mode");
    console.log("Test email:", process.env.TEST_EMAIL);
    subscriberEmails = [process.env.TEST_EMAIL];
  } else {
    console.log("Running in production mode");
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      throw new Error("Supabase credentials required in production mode");
    }
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { data: subscribers, error } = await supabase
      .from("PERSONAL_BLOG_subscribers")
      .select("email")
      .eq("verified", true);

    if (error) {
      console.error("Failed to fetch subscribers:", error);
      process.exit(1);
    }

    subscriberEmails = subscribers.map((sub) => sub.email);
  }

  console.log(`Sending to ${subscriberEmails.length} subscribers`);

  // Send notifications for each new post
  for (const post of newPosts) {
    console.log(`Processing post: ${post.title}`);
    const postUrl = process.env.SITE_URL
      ? `${process.env.SITE_URL}/writing/${post.slug}`
      : `/writing/${post.slug}`;

    try {
      console.log(`Sending email to ${subscriberEmails.join(", ")}...`);

      // Use your blog-notification template
      const {
        default: BlogNotification,
      } = require("../../src/emails/blog-notification.tsx");
      const emailHtml = await renderAsync(
        <BlogNotification
          title={post.title}
          description={post.description}
          date={post.date}
          url={postUrl}
        />
      );

      const result = await resend.emails.send({
        from: "newsletter@joshuapineda.com",
        to: subscriberEmails,
        subject: `New blog post: ${post.title}`,
        html: emailHtml,
      });

      console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Failed to send email:", error);
      process.exit(1);
    }
  }

  console.log("Notification process completed");
}

// Export for testing
if (require.main === module) {
  sendNotifications().catch(console.error);
} else {
  module.exports = sendNotifications;
}
