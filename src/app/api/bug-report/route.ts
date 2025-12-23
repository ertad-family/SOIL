import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface BugReportPayload {
  description: string;
  stepsToReproduce?: string;
  url: string;
  timestamp: string;
  browserInfo: string;
  consoleLogs: string[];
  screenshot?: string; // base64 data URL from user upload
}

export async function POST(request: NextRequest) {
  try {
    const payload: BugReportPayload = await request.json();

    // Validate required fields
    if (!payload.description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Description is required" },
        { status: 400 }
      );
    }

    // Get GitHub token from environment
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      console.error("GITHUB_TOKEN not configured");
      return NextResponse.json(
        { success: false, error: "Bug reporting is not configured" },
        { status: 500 }
      );
    }

    // Get user info if logged in
    let userInfo = "Anonymous";
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userInfo = `${user.email || "No email"} (ID: ${user.id})`;
      }
    } catch {
      // User not logged in, continue as anonymous
    }

    // Format console logs
    const formattedLogs =
      payload.consoleLogs?.length > 0
        ? payload.consoleLogs.slice(-50).join("\n")
        : "No console logs captured";

    // Build issue body
    const issueBody = `## Bug Report

**Description:**
${payload.description.trim()}

**Steps to Reproduce:**
${payload.stepsToReproduce?.trim() || "Not provided"}

---

## Auto-collected Data

| Field | Value |
|-------|-------|
| **URL** | \`${payload.url}\` |
| **Timestamp** | ${payload.timestamp} |
| **Browser** | ${payload.browserInfo} |
| **User** | ${userInfo} |

---

## Console Logs (last 50 entries)

\`\`\`
${formattedLogs}
\`\`\`

---

${payload.screenshot ? "## Screenshot\n\n*Screenshot attached as comment below*" : "## Screenshot\n\nNot provided"}

---

*This bug report was automatically generated via the SOIL bug report feature.*`;

    // Create GitHub issue
    const response = await fetch("https://api.github.com/repos/ertad-family/SOIL/issues", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `[Bug Report] ${payload.description.trim().slice(0, 80)}${payload.description.length > 80 ? "..." : ""}`,
        body: issueBody,
        labels: ["bug", "user-reported"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GitHub API error:", errorData);
      return NextResponse.json(
        { success: false, error: "Failed to create issue on GitHub" },
        { status: 500 }
      );
    }

    const issueData = await response.json();

    // If screenshot provided, add it as a comment with embedded base64 image
    if (payload.screenshot) {
      await fetch(
        `https://api.github.com/repos/ertad-family/SOIL/issues/${issueData.number}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: `## Screenshot\n\n![Bug Screenshot](${payload.screenshot})`,
          }),
        }
      );
    }

    return NextResponse.json({
      success: true,
      issueUrl: issueData.html_url,
      issueNumber: issueData.number,
    });
  } catch (error) {
    console.error("Bug report API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
