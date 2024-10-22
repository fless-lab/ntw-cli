import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';
import { exec } from 'child_process';
import fs from 'fs';
import chalk from 'chalk';
import ora from 'ora';

export function initializeProject(projectName: string, showTips: (projectName: string) => void): void {
  const projectPath = path.join(process.cwd(), projectName);
  const git: SimpleGit = simpleGit();
  const spinner = ora(`Setting up your project: ${projectName}...`).start();

  git.clone('https://github.com/fless-lab/ntw-init.git', projectPath)
    .then(() => {
      spinner.text = 'Configuring project...';

      fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });

      return simpleGit(projectPath).init();
    })
    .then(() => {
      spinner.succeed('Project configured successfully.');

      const installSpinner = ora('Step 1/2: Installing project dependencies. This may take a few moments...').start();

      exec('npm install', { cwd: projectPath }, (err, stdout, stderr) => {
        if (err) {
          installSpinner.fail('Failed to install dependencies.');
          console.error(chalk.red(`Error: ${stderr}`));
          return;
        }

        installSpinner.succeed('Step 1/2: All dependencies have been installed successfully.');

        installSpinner.start('Step 2/2: Finalizing project setup...');
        setTimeout(() => {
          installSpinner.succeed('Step 2/2: Project setup completed.');

          const newGit = simpleGit(projectPath);

          newGit.add('.', () => {
            showTips(projectName);
          });
        }, 1000);
      });
    })
    .catch((err) => {
      spinner.fail('Error during project setup.');
      console.error(chalk.red('Error:', err));
    });
}
