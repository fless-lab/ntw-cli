#!/usr/bin/env node

import { Command } from 'commander';
import { showHeader, showTips } from './utils/messages.js';
import { initializeProject } from './utils/setup.js';
import { generateApplication } from './utils/application.js';
import packageJson from '../package.json' assert { type: 'json' };

const { version } = packageJson;

const program = new Command();

program
  .version(version, '-v, --version', 'output the current version')
  .description('NTW CLI - Node TypeScript Wizard');

program
  .command('init [projectName]')
  .alias('i')
  .description('Initialize a new project with TypeScript support')
  .action((projectName = 'new-ntw-project') => {
    showHeader();
    initializeProject(projectName, showTips);
  });

program
  .command('generate')
  .aliases(['g', 'gen'])
  .description(`Generate a new resource (e.g., an application) with TypeScript scaffolding.

Example:
  $ ntw g application MyApp
Ensure that you call this from the root of an NTW project with a valid ntw.config.json file.`)
  .argument('<type>', `Specify the type of resource to generate. E.g. can be "application" or its aliases.
Type can be one of:
  - application: Generate a new application structure
  - a, app: Aliases for "application"`
  )
  .argument('[name]', 'Optional: The name of the resource to be generated. Defaults to "new-ntw-resource".')
  .action((type, name = 'new-ntw-resource') => {
    generateApplication(type, name);
  });

program.addHelpCommand('help [command]', 'Show help for a specific command');
program.option('-h, --help', 'output usage information');

program.on('--help', () => {
  console.log('');
  console.log('Example call:');
  console.log('  $ ntw init demo');
  console.log('');
  console.log('Additional Information:');
  console.log('  Ensure that ntw.config.json is present in order for commands like `ntw generate [appName]` to work.');
});

program.parse(process.argv);
