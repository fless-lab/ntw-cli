import path from 'path';
import fs from 'fs';
import simpleGit from 'simple-git';
import chalk from 'chalk';

export function encode(identifier: string): string {
  return Buffer.from(identifier).toString('base64');
}

export function decode(encodedIdentifier: string): string {
  return Buffer.from(encodedIdentifier, 'base64').toString('utf-8');
}

export function isNtwProject(projectPath: string): boolean {
  const configFilePath = path.join(projectPath, 'ntw.config.json');
  
  if (!fs.existsSync(configFilePath)) {
    throw new Error('ntw.config.json not found.');
  }

  const data = fs.readFileSync(configFilePath, 'utf-8');
  const config = JSON.parse(data);
  const decodedIdentifier = decode(config.id);

  return decodedIdentifier.includes('was made with NTW on');
}

export async function createConfigFile(projectPath: string, projectName: string): Promise<void> {
  const date = new Date().toUTCString();
  const identifier = `${projectName} was made with NTW on ${date}`;
  const encodedIdentifier = encode(identifier);

  const config = {
    name: projectName,
    id: encodedIdentifier,
    "apps-path": "./src/apps",
    dateCreated: date,
  };

  const configFilePath = path.join(projectPath, 'ntw.config.json');

  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    const git = simpleGit(projectPath);
    await git.add(configFilePath);
  } catch (err) {
    console.error(chalk.red('Error creating config file:', err));
  }
}
