#!/usr/bin/env node

const requiredVersion = require('../package.json').engines.node
const path = require('path')
const program = require('commander')
const minimist = require('minimist')
const semver = require('semver')
const chalk = require('chalk')
// 校验node版本
checkNodeVersion(requiredVersion, 'gjf-cli')

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

// 交互式命令

program
  .version(`gjf-cli ${require('../package.json').version}`)
  .usage('<command> [options]')

// create命令
program
  .command('create <app-name>')
  .description('create a new project powered by gjf-cli')
  .option('-c, --clone', 'Use git clone when fetching remote preset')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .option('-g, --git [message]', 'Force git initialization with initial commit message')
  .option('--merge', 'Merge target directory if it exists')
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\nInfo: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    if (process.argv.includes('-g') || process.argv.includes('--git')) {
      // --git makes commander to default git to true
      options.forceGit = true
    }
    require('./lib/create')(name, options)
  })

// 不存在的命令
program.on('command:*', ([cmd]) => {
  program.outputHelp()
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  console.log()
  process.exitCode = 1
})

// 丰富help命令的提示信息
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`gjf-cli <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)