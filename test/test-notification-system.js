require("dotenv").config();
const { execSync } = require("child_process");

async function testNotificationSystem() {
  try {
    console.log("Testing check-new-posts.js...");
    const newPosts = require("../.github/scripts/check-new-posts.js");
    console.log("Found new posts:", newPosts);

    console.log("\nTesting send-notifications.js...");
    process.env.NEW_POSTS = JSON.stringify([
      {
        title: "Test Post",
        excerpt: "This is a test post for the notification system",
        slug: "test-post",
      },
    ]);

    process.env.TEST_MODE = "true";
    process.env.TEST_EMAIL = "joshuapineda66@gmail.com";

    await require("../.github/scripts/send-notifications.js");

    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

testNotificationSystem();
