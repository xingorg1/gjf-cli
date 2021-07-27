const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const { exit } = require('../utils/exit')
const validateProjectName = require('validate-npm-package-name')
const { getPromptModules } = require('../utils/createTools')

const Creator = require('./Creator')
module.exports = async (projectName, options = {}) => {
  if (options.proxy) {
    process.env.HTTP_PROXY = options.proxy
  }

  const cwd = options.cwd || process.cwd() // 当前命令行所在的位置
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')

  // 校验名称是否合法
  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`))
    /* 
      Error: name can only contain URL-friendly characters
    */
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    /* 
      Warning: name can no longer contain more than 214 characters
      Warning: name can no longer contain capital letters
     */
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    exit(1)
  }

  // 判断目录是否存在
  if (fs.existsSync(targetDir) && !options.merge) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      // await clearConsole()
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `确定要在当前目录中生成项目吗？`
          }
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `要创建的目录已经存在： ${chalk.cyan(targetDir)}，请选择怎么处理：`,
            choices: [
              { name: '重写', value: 'overwrite' },
              { name: '合并', value: 'merge' },
              { name: '取消创建', value: false }
            ]
          }
        ])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          console.log(`\n删除文件 ${chalk.cyan(targetDir)}中...`)
          await fs.remove(targetDir)
        }
      }
    }
  }
  
  // 创建文件
  const creator = new Creator(name, targetDir, getPromptModules())
  await creator.create(options)
}