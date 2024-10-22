import { program } from 'commander';
import { showHeader, showTips } from './utils';
import { initializeProject } from './utils';
import packageJson from '../package.json';

program
  .version(packageJson.version)
  .description('NTW CLI - Node TypeScript Wizard');

program
  .command('init [projectName]')
  .description('Initialize a new project with TypeScript support')
  .action((projectName = 'new-ntw-project') => {
    showHeader();
    initializeProject(projectName, showTips);
  });

program.parse(process.argv);
