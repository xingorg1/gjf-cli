
const { isBinaryFileSync } = require('isbinaryfile')
const fs = require('fs')
const ejs = require('ejs')


module.exports = function renderFile (name, optionsConfig, ejsOptions) {
  // name文件的绝对路径，optionsConfig为当前cli的各种配置
  if (isBinaryFileSync(name)) { // 检测是否是二进制文件，比如logo、favicon.ico
    return fs.readFileSync(name) // 直接 return buffer
  }
  const template = fs.readFileSync(name, 'utf-8') // 读取模版文件，但因为内部用了ejs语法自定义内容，所以需要接下来的处理

  // 自定义模板yaml文件通过yaml-front-matter处理成普通的js或json文件
  const yaml = require('yaml-front-matter')
  const parsed = yaml.loadFront(template)
  const content = parsed.__content
  let finalTemplate = content.trim() + `\n`


  return ejs.render(finalTemplate, optionsConfig, ejsOptions) // 最终返回ejs处理后的内容，optionsConfig是options
}