// prebuild-checks.js
const { execSync } = require("child_process");

const checks = ["segment-access-check.ts"];

try {
  checks.forEach((check) => {
    console.log(`\n🔍 Running prebuild check: ${check}`);
    execSync(`tsx checks/${check}`, { stdio: "inherit" });
    console.log(`✅ ${check} passed.`);
  });
  console.log("\n✅ All prebuild checks passed. Proceeding with build...");
} catch (error) {
  console.error("\n🚫 Prebuild checks failed. Aborting build.");
  process.exit(1);
}
