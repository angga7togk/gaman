import inquirer from "inquirer";
import { execSync } from "child_process";

type Answers = {
  packageManager: string;
};

const runInstaller = async () => {
  console.clear();
  try {
    const answers: Answers = await inquirer.prompt([
      {
        type: "list",
        name: "packageManager",
        message: "Choose your package manager to proceed:",
        choices: [
          "npm",
          "pnpm",
          "yarn",
          "bun",
        ],
      },
    ]);

    const { packageManager } = answers;

    let command = "";

    switch (packageManager) {
      case "npm":
        command = "npm uninstall @gaman/cli -g && npm install @gaman/cli -g";
        break;
      case "pnpm":
        command = "pnpm remove -g @gaman/cli && pnpm add -g @gaman/cli";
        break;
      case "yarn":
        command = "yarn global remove @gaman/cli && yarn global add @gaman/cli";
        break;
      case "bun":
        command = "bun remove -g @gaman/cli && bun add -g @gaman/cli";
        break;
      default:
        console.error("❌ Unknown package manager.");
        return;
    }

    console.log(`🔧 Running Command: ${command}`);
    execSync(command, { stdio: "inherit" });
    console.log("✅ Installation completed successfully!");
  } catch (error) {
    console.error("❌ An error occurred while executing the command:", error);
  }
};

runInstaller();
