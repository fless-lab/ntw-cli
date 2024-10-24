import path from 'path';
import simpleGit from 'simple-git';
import { exec } from 'child_process';
import fs, { writeFile } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import { createConfigFile } from './config.js';

const noDemoRouterIndexFileContent = `import { Router } from 'express';
import { DevRoutes } from 'modules/features/dev';

export class RouterModule {
  private static router: Router;

  public static getRouter(): Router {
    if (!RouterModule.router) {
      RouterModule.router = Router();
      RouterModule.initializeRoutes();
    }
    return RouterModule.router;
  }

  private static initializeRoutes(): void {
    RouterModule.router.use('', DevRoutes);
  }
}
`

const noDemoAppsIndexContent = `/**
 * Export all the apps routes here
 */
`;

export function initializeProject(projectName, includeDemo, showTips) {
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

      const installSpinner = ora('Step 1/2: Installing project dependencies. This may take a few moments...').start();

      exec('npm install', { cwd: projectPath }, (err, stdout, stderr) => {
        if (err) {
          installSpinner.fail('Failed to install dependencies.');
          console.error(chalk.red(`Error: ${stderr}`));
          return;
        }

        installSpinner.succeed('Step 1/2: All dependencies have been installed successfully.');

        installSpinner.start('Step 2/2: Finalizing project setup...');

        createConfigFile(projectPath, projectName);

        setTimeout(() => {
          installSpinner.succeed('Step 2/2: Project setup completed.');

          const newGit = simpleGit(projectPath);

          newGit.add('.', () => {
            showTips(projectName);
          });
        }, 1000);
      });
    })
    .then (() => {
      if(!includeDemo){
        const appsIndexPath = projectPath + '/src/apps/index.ts';
        fs.writeFile(appsIndexPath, noDemoAppsIndexContent, 'utf-8', (error) => {
          if (error) {
            console.error('Error writing file:', error);
            return;
          }
        });
  
        const pathToDemo = projectPath + '/src/apps/demo';
        fs.rm(pathToDemo, { recursive: true, force: true }, (error) => {
          if (error) {
            console.error('Error removing file:', error);
            return;
          }
        });
  
        const routerIndexPath = projectPath + '/src/modules/router/index.ts';
        fs.writeFile(routerIndexPath, noDemoRouterIndexFileContent, 'utf-8', (error) => {
          if (error) {
            console.error('Error writing file:', error);
            return;
          }
        });
      }
    })
    .catch((err) => {
      spinner.fail('Error during project setup.');
      console.error(chalk.red('Error:', err));
    });
}