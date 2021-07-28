const fs = require('fs')
const path = require('path')
// const readPkg = require('read-pkg') // TODO: Cannot find module 'read-pkg'
// FIXME: Must use import to load ES Module: read-pkg/index.js
// import readPkg from 'read-pkg' // FIXME: SyntaxError: Cannot use import statement outside a module

exports.resolvePkg = function (context) {
  if (fs.existsSync(path.join(context, 'package.json'))) { // 当前路径下的package.json是否存在
    // return readPkg.sync({ cwd: context })
    return {}
  }
  return {}
}
