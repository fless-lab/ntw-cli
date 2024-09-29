#!/usr/bin/env node

const { program } = require('commander');
const simpleGit = require('simple-git');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');

const packageJson = require('./package.json');

function showHeader() {
  console.log(
    chalk.blue(
      figlet.textSync('NTW CLI', { horizontalLayout: 'full' })
    )
  );
  console.log(chalk.green('Welcome to Node TypeScript Wizard! 🎩✨'));
  console.log(chalk.yellow('Let’s create something magical... 🪄'));
}

function showTips(projectName) {
  console.log(chalk.blue('\n✨✨ Project Setup Complete ✨✨\n'));
  console.log(chalk.green(`Your project ${projectName} is ready to go! 🎉`));
  console.log(chalk.magenta('Here are some tips from the author to get you started:'));
  console.log(chalk.cyan(`\n1. To launch the project (in Docker - development):\n   ${chalk.bold('npm run docker:launch')}`));
  console.log(chalk.cyan(`2. To launch the project (in Docker - production):\n   ${chalk.bold('npm run docker:launch:prod')}`));
  console.log(chalk.cyan('3. Explore the project structure.'));
  console.log(chalk.cyan('4. Don’t forget to set up your environment variables!'));
  console.log(chalk.yellow('\nHappy coding! 💻🚀'));
}

program
  .version(packageJson.version)
  .description('NTW CLI - Node TypeScript Wizard');

program
  .command('init [projectName]')
  .description('Initialize a new project with TypeScript support')
  .action((projectName = 'new-ntw-project') => {
    showHeader();

    const projectPath = path.join(process.cwd(), projectName);
    const git = simpleGit();
    const spinner = ora(`Setting up your project: ${projectName}...`).start();

    git.clone('https://github.com/fless-lab/ntw-init.git', projectPath)
      .then(() => {
        spinner.text = 'Configuring project...';

        fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });

        return simpleGit(projectPath).init();
      })
      .then(() => {
        spinner.succeed('Project configured successfully.');

        const installSpinner = ora('Step 1/2: Installing dependencies...').start();

        exec('npm install', { cwd: projectPath }, (err, stdout, stderr) => {
          if (err) {
            installSpinner.fail('Failed to install dependencies.');
            console.error(chalk.red(`Error: ${stderr}`));
            return;
          }

          installSpinner.succeed('Step 1/2: Dependencies installed successfully.');

          installSpinner.start('Step 2/2: Finalizing project setup...');
          setTimeout(() => {
            installSpinner.succeed('Step 2/2: Project setup completed.');

            const newGit = simpleGit(projectPath);

            // newGit.add('.')
            //   .commit('Initial setup completed with NTW CLI 🎩✨', () => {
            //     showTips(projectName);
            //   });

            newGit.add('.')
              .then(() => {
                return newGit.commit('Initial setup completed with NTW CLI 🎩✨');
              })
              .then(() => {
                showTips(projectName);
              })
              .catch((commitErr) => {
                console.error(chalk.red('Error during git commit:', commitErr));
              });
          }, 1000);
        });
      })
      .catch((err) => {
        spinner.fail('Error during project setup.');
        console.error(chalk.red('Error:', err));
      });
  });

program.parse(process.argv);
