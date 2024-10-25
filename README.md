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

npx your-cli-tool-name [command]
```

## Usage

### Initialize a New Project

To create a new Node.js project with TypeScript support:

```bash
ntw init my-new-project
```

Options:

    --`no-demo`: Add this flag to exclude the demo application (a to-do list app) from your project.

This will clone the base repository and install all the required dependencies.

### Commands

- `ntw init [projectName]`: Initializes a new Node.js project.
- `ntw --help`: Display help information about the CLI.
- `ntw --version`: Display the CLI version.
- `ntw generate <type> [resourceName]`: Generate a new resource (e.g., an application) with TypeScript scaffolding.

## Requirements

- Node.js >= v14
- npm
