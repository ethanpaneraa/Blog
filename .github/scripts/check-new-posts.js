const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function getNewPosts() {
  console.log("Checking for new posts...");

  // Get absolute path to posts directory
  const postsDir = path.join(process.cwd(), "posts");
  console.log("Posts directory:", postsDir);

  try {
    // Get list of changed files in last commit
    const diff = execSync("git diff --name-only HEAD HEAD~1").toString();
    console.log("Changed files:", diff);

    const changedFiles = diff
      .split("\n")
      .filter((file) => file.startsWith("posts/") && file.endsWith(".mdx"));
    console.log("Changed MDX files:", changedFiles);

    const newPosts = [];

    for (const file of changedFiles) {
      try {
        // Check if file exists in previous commit
        execSync(`git log --max-count=1 HEAD~1 -- "${file}"`, {
          stdio: "ignore",
        });
        console.log(`${file} exists in previous commit, skipping...`);
      } catch (e) {
        console.log(`${file} is new, processing...`);

        // Get absolute path to file
        const filePath = path.join(process.cwd(), file);
        console.log("Reading file:", filePath);

        const content = fs.readFileSync(filePath, "utf8");
        const { data } = matter(content);

        if (!data.title) {
          console.warn(`Warning: No title found in ${file}`);
          continue;
        }

        newPosts.push({
          title: data.title,
          description: data.description || "", // Using description instead of excerpt
          date: data.date || "",
          slug: path.basename(file, ".mdx"),
        });
        console.log(`Added new post: ${data.title} (${data.date})`);
      }
    }

    const result = JSON.stringify(newPosts, null, 2);
    console.log("Final result:", result);
    console.log(result); // This is the one that gets captured by the GitHub Action
    return newPosts;
  } catch (error) {
    console.error("Error in getNewPosts:", error);
    throw error;
  }
}

getNewPosts();
