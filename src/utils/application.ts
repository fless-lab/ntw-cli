import ora from 'ora';
import chalk from 'chalk';
import { isNtwProject, createConfigFile } from './config';
import { generateAppStructure } from './app-structure-generator';

export function generateApplication(type: string, name: string): void {
  const typeMapping: { [key: string]: string } = {
    application: 'application',
    a: 'application',
    app: 'application',
  };

  const normalizedType: string = typeMapping[type] || type;

  if (normalizedType === 'application') {
    const genAppSpinner = ora('Generating a new NTW application...\n').start();

    try {
      if (!isNtwProject(process.cwd())) {
        throw new Error('Current directory is not an NTW project. Please execute this command at the root of an NTW project with a valid ntw.config.json file.');
      }

      genAppSpinner.text = 'Creating folder structure...\n';
      generateAppStructure({
        appName: name,
        baseDir: './src/apps',
      });

      genAppSpinner.succeed(`New ${name} NTW Application successfully generated.`);
    } catch (error) {
      genAppSpinner.fail('Failed to generate a new NTW application.');
      console.error(chalk.red(`Error: ${(error as any).message}`));
    }
  }
}
