const EventEmitter = require('events')
// console.log(EventEmitter)
const execa = require('execa')
// const cloneDeep = require('lodash.clonedeep')
const { resolvePkg } = require('../utils/pkg')
const writeFileTree = require('../utils/writeFileTree')

module.exports = class Creator extends EventEmitter {
  constructor(projectName, targetDir, promptModulesArr) {
    super()
    this.name = projectName
    this.context = targetDir
    this.run = this.run.bind(this)
  }
  async create(cliOptions = {}, preset = null) {
    console.log('CREATE FUNCTION')
    console.log(cliOptions)
    const { run, name, context } = this
    // preset = cloneDeep(preset)

    // 根据插件依赖生成package.json
    const pkg = {
      name,
      version: '0.1.0',
      private: true,
      devDependencies: {},
      ...resolvePkg(context)
    }
    console.log(pkg)
    // write package.json
    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2)
    })

  }
  run(command, args) {
    console.log(command, args)
    if (!args) {
      [command, ...args] = command.split(/\s+/)
    }
    return execa(command, args, { cwd: this.context })
  }
}