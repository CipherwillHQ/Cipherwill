import type { NextApiRequest, NextApiResponse } from "next";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type ApiResponse =
  | { success: true; message: string; stdout: string; stderr: string }
  | { success: false; error: string };

const COMMAND = process.platform === "win32" ? "yarn.cmd" : "yarn";
const ARGS = ["generate:blog-sitemap"];

function getProvidedSecret(req: NextApiRequest): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "").trim();
  }

  const querySecret = req.query.secret;
  if (typeof querySecret === "string") {
    return querySecret;
  }

  return undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed. Use POST." });
  }

  const expectedSecret = process.env.SITEMAP_REGEN_SECRET;
  if (!expectedSecret) {
    return res.status(500).json({
      success: false,
      error:
        "SITEMAP_REGEN_SECRET is not configured. Set it before using this endpoint.",
    });
  }

  const providedSecret = getProvidedSecret(req);
  if (!providedSecret || providedSecret !== expectedSecret) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const { stdout, stderr } = await execFileAsync(COMMAND, ARGS, {
      cwd: process.cwd(),
      timeout: 120000,
      maxBuffer: 1024 * 1024 * 10,
    });

    return res.status(200).json({
      success: true,
      message:
        "Blog sitemap regeneration complete. Updated public/blogs-sitemap.xml.",
      stdout,
      stderr,
    });
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      stdout?: string;
      stderr?: string;
    };

    return res.status(500).json({
      success: false,
      error: [
        "Failed to regenerate sitemap.",
        err.message ? `Message: ${err.message}` : "",
        err.stderr ? `stderr: ${err.stderr}` : "",
      ]
        .filter(Boolean)
        .join(" "),
    });
  }
}
