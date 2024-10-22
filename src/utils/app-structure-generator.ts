import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';

const templates = {
  controller: (appName: string) => `
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import { Request, Response, NextFunction } from 'express';
  
  export class ${convertToPascalCase(appName)}Controller {}
  `,

  model: (appName: string) => `
import { BaseModel, createBaseSchema } from '@nodesandbox/repo-framework';
import { I${convertToPascalCase(appName)}Model } from '../types';

const ${convertToConstantCase(appName)}_MODEL_NAME = '${convertToPascalCase(appName)}';

const ${convertToCamelCase(appName)}Schema = createBaseSchema<I${convertToPascalCase(appName)}Model>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    modelName: ${convertToConstantCase(appName)}_MODEL_NAME,
  },
);

const ${convertToPascalCase(appName)}Model = new BaseModel<I${convertToPascalCase(appName)}Model>(
  ${convertToConstantCase(appName)}_MODEL_NAME,
  ${convertToCamelCase(appName)}Schema,
).getModel();

export { ${convertToPascalCase(appName)}Model };
`,

  repository: (appName: string) => `
import { Model } from 'mongoose';
import { I${convertToPascalCase(appName)}Model } from '../types';
import { BaseRepository } from '@nodesandbox/repo-framework';

export class ${convertToPascalCase(appName)}Repository extends BaseRepository<I${convertToPascalCase(appName)}Model> {
  constructor(model: Model<I${convertToPascalCase(appName)}Model>) {
    super(model);
  }
}
`,

  service: (appName: string) => `
import { I${convertToPascalCase(appName)}Model } from '../types';
import { ${convertToPascalCase(appName)}Repository } from '../repositories';
import { ${convertToPascalCase(appName)}Model } from '../models';
import { BaseService } from '@nodesandbox/repo-framework';

class ${convertToPascalCase(appName)}Service extends BaseService<I${convertToPascalCase(appName)}Model, ${convertToPascalCase(appName)}Repository> {
  constructor() {
    const ${convertToCamelCase(appName)}Repo = new ${convertToPascalCase(appName)}Repository(${convertToPascalCase(appName)}Model);
    super(${convertToCamelCase(appName)}Repo, true, [
      /*'attribute_to_populate'*/
    ]); // This will populate the entity field
    this.allowedFilterFields = []; // To filter on these fields, we need to set this
    this.searchFields = ['name']; // This will use the search keyword

    /**
     * The allowedFilterFields and searchFields are used to filter and search on the entity fields.
     * These declarations are there to ensure what fields are allowed to be used for filtering and searching.
     * If you want to filter on a field that is not declared here, you can add it to the allowedFilterFields array.
     * If you want to search on a field that is not declared here, you can add it to the searchFields array.
     */
  }
}

export default new ${convertToPascalCase(appName)}Service();
`,

  types: (appName: string) => `
import { IBaseModel } from '@nodesandbox/repo-framework';
import { Document } from 'mongoose';

export interface I${convertToPascalCase(appName)} {
  name: string;
}

export interface I${convertToPascalCase(appName)}Model extends I${convertToPascalCase(appName)}, IBaseModel, Document {}
`,

  routes: (appName: string) => `
import { Router } from 'express';
import { ${convertToPascalCase(appName)}Controller } from '../controllers';

const router = Router();

// e.g.
// router.post('/', ${convertToPascalCase(appName)}Controller.yourFunction);

export default router;
`,

  folderIndex: (appName: string, folder: string) => {
    const exports: Record<string, string> = {
      controllers: `export * from './${convertToKebabCase(appName)}.controller';`,
      model: `export * from './${convertToKebabCase(appName)}.model';`,
      repositories: `export * from './${convertToKebabCase(appName)}.repo';`,
      routes: `export { default as ${convertToPascalCase(appName)}Routes } from './${convertToKebabCase(appName)}.routes';`,
      services: `export { default as ${convertToPascalCase(appName)}Service } from './${convertToKebabCase(appName)}.service';`,
      types: `export * from './${convertToKebabCase(appName)}';`,
    };
    return exports[folder] || '';
  },

  rootIndex: () => `
/**
 * The only thing that needs to be exported here is the router
 */

export * from './routes';
`,
};

async function generateAppStructure(options: { appName: string; baseDir?: string; includeTests?: boolean }) {
  const { appName, baseDir = 'apps', includeTests = true } = options;
  const extension = 'ts';

  const appPath = path.join(process.cwd(), baseDir, appName);
  const folders = [
    'controllers',
    'middleware',
    'model',
    'repositories',
    'routes',
    'services',
    'types',
    'validators',
  ];

  try {
    await fs.mkdir(appPath, { recursive: true });
    console.log(chalk.green(`✓ Created app directory: ${appPath}`));

    for (const folder of folders) {
      const folderPath = path.join(appPath, folder);
      await fs.mkdir(folderPath, { recursive: true });
      console.log(chalk.green(`✓ Created directory: ${folder}`));

      switch (folder) {
        case 'controllers':
          await generateFile(folderPath, `${appName}.controller.${extension}`, templates.controller(appName));
          break;
        case 'model':
          await generateFile(folderPath, `${appName}.model.${extension}`, templates.model(appName));
          break;
        case 'repositories':
          await generateFile(folderPath, `${appName}.repo.${extension}`, templates.repository(appName));
          break;
        case 'services':
          await generateFile(folderPath, `${appName}.service.${extension}`, templates.service(appName));
          break;
        case 'routes':
          await generateFile(folderPath, `${appName}.routes.${extension}`, templates.routes(appName));
          break;
        case 'types':
          await generateFile(folderPath, `${appName}.${extension}`, templates.types(appName));
          break;
      }
      // Create index file for the folder
      await generateFile(folderPath, `index.${extension}`, templates.folderIndex(appName, folder));
    }

    // Create root index file for the application
    await generateFile(appPath, `index.${extension}`, templates.rootIndex());

    const readmePath = path.join(appPath, 'README.md');
    const readmeContent = `# ${capitalize(appName)} Application\n\nGenerated with NTW CLI app generation tool`;
    await fs.writeFile(readmePath, readmeContent);
    console.log(chalk.green('✓ Created README.md'));

    console.log(chalk.blue('\n🎉 Application structure generated successfully!'));
  } catch (error) {
    console.error(chalk.red('Error generating application structure:'), error);
    throw error;
  }
}

async function generateFile(folderPath: string, filename: string, content: string) {
  const filePath = path.join(folderPath, filename);
  await fs.writeFile(filePath, content.trim());
  console.log(chalk.green(`  ✓ Created file: ${filename}`));
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function convertToPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (char) => char.toUpperCase());
}

function convertToCamelCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (char) => char.toLowerCase());
}

function convertToConstantCase(str: string): string {
  return str.replace(/[-_]/g, '_').toUpperCase();
}

function convertToKebabCase(str: string): string {
  return str.replace(/[_\s]/g, '-').toLowerCase();
}

export { generateAppStructure };

generateAppStructure({
  appName: 'user-manager',
  baseDir: '.'
});
