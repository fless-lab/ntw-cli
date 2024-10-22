import chalk from 'chalk';
import figlet from 'figlet';

export function showHeader(): void {
  console.log(
    chalk.blue(
      figlet.textSync('NTW CLI', { horizontalLayout: 'full' })
    )
  );
  console.log(chalk.green('Welcome to Node TypeScript Wizard! 🎩✨'));
  console.log(chalk.yellow('Let’s create something magical... 🪄'));
}

export function showTips(projectName: string): void {
  console.log(chalk.blue('\n✨✨ Project Setup Complete ✨✨\n'));
  console.log(chalk.green(`Your project ${projectName} is ready to go! 🎉`));
  console.log(chalk.magenta('Here are some tips from the author to get you started:'));
  console.log(chalk.cyan(`\n1. To launch the project (in Docker - development):\n   ${chalk.bold('npm run docker:launch')}`));
  console.log(chalk.cyan(`2. To launch the project (in Docker - production):\n   ${chalk.bold('npm run docker:launch:prod')}`));
  console.log(chalk.cyan('3. Explore the project structure.'));
  console.log(chalk.cyan('4. Don’t forget to set up your environment variables!'));
  console.log(chalk.yellow('\nHappy coding! 💻🚀'));
}