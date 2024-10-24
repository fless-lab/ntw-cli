import ora from 'ora';
import chalk from 'chalk';
import { getNtwConfig } from './config.js';
import { generateAppStructure } from './app-structure-generator.js';

export function generateApplication(type, name) {
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
        generateAppStructure({
                appName: name,
                baseDir: config["apps-path"],
              });
      }

    } catch (error) {
      console.log('Failed to generate a new NTW application.');
      console.error(chalk.red(`Error: ${error.message}`));
    }
  }
}