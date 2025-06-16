#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Answers = {
  projectName: string;
  language: "Typescript" | "Javascript";
  installPack: boolean;
  gitInit: boolean;
};

async function main(): Promise<void> {
  console.clear();
  console.log(`
  ░██████╗░░█████╗░███╗░░░███╗░█████╗░███╗░░██╗
  ██╔════╝░██╔══██╗████╗░████║██╔══██╗████╗░██║
  ██║░░██╗░███████║██╔████╔██║███████║██╔██╗██║
  ██║░░╚██╗██╔══██║██║╚██╔╝██║██╔══██║██║╚████║
  ╚██████╔╝██║░░██║██║░╚═╝░██║██║░░██║██║░╚███║
  ░╚═════╝░╚═╝░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝
`);

  // Prompt user for input
  const answers: Answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: "./gaman-project",
    },
    {
      type: "list",
      name: "language",
      message: "What language do you use?",
      choices: ["Typescript", "Javascript"],
      default: "Typescript",
    },
    {
      type: "confirm",
      name: "installPack",
      message: "Install dependencies?",
      default: true,
    },
    {
      type: "confirm",
      name: "gitInit",
      message: "Initialize a new git repository?",
      default: true,
    },
  ]);

  const targetDir = path.resolve(process.cwd(), answers.projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`\n❌ Error: Directory "${answers.projectName}" already exists.`);
    process.exit(1);
  }

  // Clone the repository
  const repoUrl = "https://github.com/7TogkID/gaman-template.git";
  const tempDir = path.join(__dirname, ".temp-gaman-template");

  console.log(`\n📁 Cloning template repository...`);
  try {
    execSync(`git clone ${repoUrl} ${tempDir}`, { stdio: "inherit" });
    console.log("✅ Template repository cloned successfully.");
  } catch (err) {
    console.error("❌ Error cloning the repository. Please check the repository URL.");
    process.exit(1);
  }

  // Select the appropriate subfolder
  const subfolder = answers.language === "Typescript" ? "ts" : "js";
  const templateDir = path.join(tempDir, subfolder);

  if (!fs.existsSync(templateDir)) {
    console.error(`❌ Error: Subfolder "${subfolder}" not found in the repository.`);
    process.exit(1);
  }

  console.log(`\n📁 Copying ${answers.language} template...`);
  await fs.copy(templateDir, targetDir);

  // Cleanup temporary directory
  await fs.remove(tempDir);

  // Update package.json
  const packageJsonPath = path.join(targetDir, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = answers.projectName; // Update the name
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log(`✅ Updated package.json with project name "${answers.projectName}".`);
  } else {
    console.warn(`⚠️  Warning: package.json not found in template directory.`);
  }

  // Initialize Git
  if (answers.gitInit) {
    console.log("\n🔧 Initializing Git repository...");
    execSync("git init", { cwd: targetDir });
    await fs.writeFile(path.join(targetDir, ".gitignore"), "node_modules\n");
    console.log("✅ Git repository initialized.");
  }

  // Install dependencies
  if (answers.installPack) {
    process.chdir(targetDir);
    console.log("\n📦 Installing dependencies...");
    try {
      execSync("npm install", { stdio: "inherit" });
      console.log("✅ Dependencies installed.");
    } catch (err) {
      console.error("❌ Error during npm install. Please try running it manually.");
    }
  }

  // Final messages
  console.log("\n🎉 Project created successfully!");
  console.log(`\n🚀 Next steps:`);
  console.log(`  cd ${answers.projectName}`);
  console.log("  npm run dev");
}

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Stopping the process...");
  process.exit(0);
});

main().catch((err) => {
  console.error("\n🛑 An error occurred:", err.message);
  process.exit(1);
});
