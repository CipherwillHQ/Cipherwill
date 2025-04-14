import segments_list from "@/app/app/segments/raw_segments_list";
import { Raw_Segment } from "@/types/Segments";

const fs = require("fs");
const path = require("path");

const requiredFolders = [];
segments_list.forEach((segment) => {
  const metamodel_type = (segment as Raw_Segment).metamodel_type;
  if (metamodel_type) {
    requiredFolders.push(`/types/pods/${metamodel_type}.ts`);
  }
});

console.log("🔍 Checking for required typescript definations for models...");

let allExist = true;

for (const folder of requiredFolders) {
  const project_root = path.join(__dirname, '..');
  const fullPath = path.join(project_root, folder);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing folder: ${folder}`);
    allExist = false;
  } else {
    console.log(`✅ Found folder: ${folder}`);
  }
}

if (!allExist) {
  console.error("\n🚫 Build failed due to missing required folders.");
  process.exit(1); // Exit with error to stop the build
}
