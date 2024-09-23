#!/usr/bin/env node

const { program } = require('commander');
const simpleGit = require('simple-git');
const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');

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
  console.log(chalk.cyan(`\n1. To launch the project in Docker:\n   ${chalk.bold('npm launch')}`));
  console.log(chalk.cyan('2. Explore the project structure.'));
  console.log(chalk.cyan('3. Don’t forget to set up your environment variables!'));
  console.log(chalk.yellow('\nHappy coding! 💻🚀'));
}

program
  .command('init [projectName]')
  .description('Initialize a new project with TypeScript support')
  .action((projectName = 'new-ntw-project') => {
    showHeader();

    const projectPath = path.join(process.cwd(), projectName);
    const git = simpleGit();
    const spinner = ora(`Setting up your project: ${projectName}...`).start();

    git.clone('https://github.com/fless-lab/node-ts-starter.git', projectPath)
      .then(() => {
        spinner.text = 'Installing dependencies...';
        
        exec('npm install', { cwd: projectPath }, (err, stdout, stderr) => {
          if (err) {
            spinner.fail('Failed to install dependencies.');
            console.error(chalk.red(`Error: ${stderr}`));
            return;
          }
          spinner.succeed('Dependencies installed successfully!');

          showTips(projectName);
        });
      })
      .catch((err) => {
        spinner.fail('Error during project setup.');
        console.error(chalk.red('Error:', err));
      });
  });

program.parse(process.argv);
