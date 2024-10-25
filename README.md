# NTW-CLI (Node TypeScript Wizard)

Welcome to NTW-CLI (Node TypeScript Wizard)! 🎩✨ This CLI tool helps you scaffold Node.js API applications with TypeScript and includes features like authentication, authorization, logging, and more!

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
   
   2.1. [Initialize a New Project](###initialize-a-new-project)
   
   2.2. [Commands](###commands)
3. [Requirements](##requirements)
4. [Contributing](#contributing)

## Installation

You can install NTW-CLI globally from npm:

```bash
npm install -g @fless-lab/ntw-cli
```

Or use npx to run the CLI without installing globally:

```bash
npx @fless-lab/ntw-cli [command]
```
- *npx is a command that comes with npm (version 5.2.0 and above) and allows you to execute packages that are not installed globally. This is especially useful for running one-off commands without the need to globally install a package.*

## Usage

### Initialize a New Project

To create a new Node.js project with TypeScript support:

```bash
ntw init my-new-project
```
This will clone the base repository and install all the required dependencies.

**Options**:

- `no-demo`: Add this flag to exclude the demo application (a to-do list app) from your project.



### Commands

- `ntw init [projectName]`: Initializes a new Node.js project.
- `ntw --help`: Display help information about the CLI.
- `ntw --version`: Display the CLI version.
- `ntw generate <type> [resourceName]`: Generate a new resource (e.g., an application) with TypeScript scaffolding.

## Requirements

- Node.js >= v14
- npm
