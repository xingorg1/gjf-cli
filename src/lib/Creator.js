const path = require('path')
const EventEmitter = require('events')
const execa = require('execa')
const chalk = require('chalk')
const { log } = require('../utils/logger')
const { resolvePkg } = require('../utils/pkg')
const writeFileTree = require('../utils/writeFileTree')
const renderFile = require('../utils/renderFile')
const normalizeFilePaths = require('../utils/normalizeFilePaths')

module.exports = class Creator extends EventEmitter {
  constructor(projectName, targetDir, promptModulesArr) {
    super()
    this.name = projectName
    this.context = targetDir
    this.run = this.run.bind(this)
    this.files = {}
    this.options = {
      projectName,
      vueVersion: '3',
    }
  }
  async create(cliOptions = {}, preset = null) {
    // preset = cloneDeep(preset)
    this.cliOptions = cliOptions
    // 根据插件依赖生成package.json
    await this.writePkg()
    await this.writeTemplate()
    await this.writeReadme()

    // 提示创建成功，打印指导语
    log()
    log(`🎉  Successfully created project ${chalk.yellow(this.name)}.`)
    if (!cliOptions.skipGetStarted) {
      log(
        `👉  Get started with the following commands:\n\n` +
        (this.context === process.cwd() ? `` : chalk.cyan(` ${chalk.gray('$')} cd ${this.name}\n`)) +
        chalk.cyan(` ${chalk.gray('$')} npm run serve`)
      )
    }
    log()
  }
  run(command, args) {
    log(command, args)
    if (!args) {
      [command, ...args] = command.split(/\s+/)
    }
    return execa(command, args, { cwd: this.context })
  }
  async writePkg() {
    // 写入 package.json
    const { name, context } = this
    const pkg = {
      name,
      version: '0.1.0',
      private: true,
      devDependencies: {},
      ...resolvePkg(context)
    }
    log()
    log('📝  Generating package.json...')
    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2)
    })
  }
  async writeTemplate() {
    // 写入模版文件
    log()
    log(`🚀  Invoking generators...`)
    await this.initPlugins()
    // 从包中提取配置。Json转换为专用文件。函数调完没啥效果，因为内部逻辑if条件都不成立
    /* this.extractConfigFiles(false, false) */
    // 等待文件解析
    await this.resolveFiles()
    // console.log(this.context, this.files['src/main.js']);

    // 将文件树写入磁盘
    // await writeFileTree(this.context, this.files, initialFiles, this.filesModifyRecord)
    await writeFileTree(this.context, this.files, false, false)
  }
  initPlugins() {
    // TODO: 根据问答形成package、plugin、loader等的配置，应该不需要这些。
  }
  async resolveFiles() {
    const files = this.files
    const optionsData = Object.assign({
      options: this.options,
      cliOptions: this.cliOptions
    }, {})
    // 可以配置一些动态生成的参数放到模版里，比如name
    const baseDir = path.resolve(__dirname, '../', 'generator')// generator的目录地址 /Users/guojufeng/Documents/GithubCode/gjf-cli/src/lib/generator
    const source = path.resolve(baseDir, './template') // template模版的地址 /Users/guojufeng/Documents/GithubCode/vue-cli/packages/@vue/cli/node_modules/@vue/cli-service/generator/template
    await this.middleware(optionsData, source)
    // 文件路径转换 - 将路径的/转换成\
    normalizeFilePaths(files)
  }
  async middleware(optionsData, source) {
    // 【核心逻辑】根据配置项获取template内容并渲染出最终模版结果
    const ejsOptions = {}
    const globby = require('globby')
    const _files = await globby(['**/*'], { cwd: source, dot: true })
    for (const rawPath of _files) {
      const targetPath = rawPath.split('/').map(filename => { //
        // 切割路径 - 给下划线开头的文件名转成“.”开头
        if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
          return `.${filename.slice(1)}`
        }
        if (filename.charAt(0) === '_' && filename.charAt(1) === '_') {
          return `${filename.slice(1)}`
        }
        return filename
      }).join('/') // 最终public/index.html这样的路径，又用“/”拼接了起来
      const sourcePath = path.resolve(source, rawPath) // 找到模版文件的目标绝对路径 gjf-cli/src/generator/template/_gitignore
      const content = renderFile(sourcePath, optionsData, ejsOptions) // 根据目标路径加载文件内容
      if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
        // 内容为buffer的文件会被重新赋值
        this.files[targetPath] = content
      }
    }
  }
  async writeReadme() {
    // 生成 README.md 并写入
    const { name, context } = this
    // TODO: readme 自动生成
    const readme = `# ${name}
${name}项目说明文档`
    log()
    log('📄  Generating README.md...')
    await writeFileTree(context, {
      'README.md': readme
    })
  }
}