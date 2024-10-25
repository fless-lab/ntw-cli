import chalk from 'chalk';
import { getNtwConfig } from './config.js';
import { generateAppStructure } from './app-structure-generator.js';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

export async function generateApplication(type, name) {
  const typeMapping = {
    application: 'application',
    a: 'application',
    app: 'application',
  };

  const normalizedType = typeMapping[type] || type;

  if (normalizedType === 'application') {
    try {
      const { valid, config } = getNtwConfig(process.cwd());

      if (valid) {
        const baseDir = config['apps-path'];

        // Check if the app exists and get user's decision
        const shouldProceed = await checkIfAppExists(name, baseDir);

        if (shouldProceed) {
          generateAppStructure({
            appName: name,
            baseDir,
          });
          console.log(`Application "${name}" generated successfully.`);
        } else {
          console.log('Operation aborted. No changes were made.');
        }
      }
    } catch (error) {
      console.log('Failed to generate a new NTW application.');
      console.error(chalk.red(`Error: ${error.message}`));
    }
  }
}


export async function checkIfAppExists(appName, baseDir){
  const appPath = path.join(baseDir, appName);
  
  if (fs.existsSync(appPath)) {
    const { shouldOverride } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldOverride',
        message: `An application named "${appName}" already exists at the specified path. Do you want to override its contents?\n`,
        default: false,
      },
    ]);

    return shouldOverride;
  }

  // If the path does not exist, return true to proceed with generation
  return true;
}
