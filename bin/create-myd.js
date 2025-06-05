#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Welcome to MyD.JS Project Creator!");

  // Ask user for project name
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: "myd-project"
    }
  ]);

  const templateDir = path.resolve(__dirname, "../template");
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  // Copy template to target directory
  console.log(`Creating project "${projectName}"...`);
  await fs.copy(templateDir, targetDir);

  // Update package.json
  const packageJsonPath = path.join(targetDir, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = projectName; // Update the name
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log(`Updated package.json with project name "${projectName}".`);
  } else {
    console.warn(`Warning: package.json not found in template directory.`);
  }

  // Initialize Git (optional)
  console.log("Initializing Git repository...");
  await fs.writeFile(path.join(targetDir, ".gitignore"), "node_modules\n");

  console.log("Project created successfully!");
  console.log(`\nNext steps:`);
  console.log(`cd ${projectName}`);
  console.log("npm install");
  console.log("npm run dev");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
