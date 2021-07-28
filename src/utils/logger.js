const chalk = require('chalk')
const stripAnsi = require('strip-ansi')

const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `)

const format = (label, msg) => {
  return msg.split('\n').map((line, i) => {
    return i === 0
      ? `${label} ${line}`
      : line.padStart(stripAnsi(label).length + line.length + 1)
  }).join('\n')
}

exports.log = (msg = '', tag = null) => {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg)
}