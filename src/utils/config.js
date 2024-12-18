import path from 'path';
import fs from 'fs';
import simpleGit from 'simple-git';
import chalk from 'chalk';

function encode(identifier) {
  return Buffer.from(identifier).toString('base64');
}

function decode(encodedIdentifier) {
  return Buffer.from(encodedIdentifier, 'base64').toString('utf-8');
}

export function getNtwConfig(projectPath) {
  const error = new Error(`A ntw.config.json with a valid ID was not found.\nThe current directory is not an NTW project. Please execute this command at the root of an NTW project with a valid ntw.config.json file and ID.`);
  
  try {
    const configFilePath = path.join(projectPath, 'ntw.config.json');

    if (!fs.existsSync(configFilePath)) {
      throw error;
    }

    const data = fs.readFileSync(configFilePath, 'utf-8');
    const config = JSON.parse(data);
    const decodedIdentifier = decode(config.id);
    const valid = decodedIdentifier.includes('was made with NTW on');
    const res = { valid, config };

    if(!valid){
      throw error;
    }

    return res;
    
  } catch (err) {
    throw error;
  }

}

export async function createConfigFile(projectPath, projectName) {
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

