const path = require('path')
const program = require('commander');
const { version } = require('./utils/constants');

// 命令配置
const actionsMap = {
  'create': { // 创建模板
    description: 'create project',
    alias: 'cr',
    examples: [
      'axe-cli create <template-name>',
      'axe-cli create <template-name> -f',
      'axe-cli create <template-name> --force',
    ],
  },
  'config': { // 配置配置文件
    description: 'config info',
    alias: 'c',
    examples: [
      'axe-cli config get <k>',
      'axe-cli config set <k> <v>',
    ],
  },
  '*': {
    description: 'command not found',
  },
};
// 循环创建命令
Object.keys(actionsMap).forEach((action) => {
  let actionObj = actionsMap[action]
  program.command(action) // 命令的名称
    .alias(actionObj.alias || '') // 命令的别名
    .description(actionObj.description) // 命令的描述
    .action(() => { // 动作
      if (action === '*') { // 如果动作没匹配到说明输入有误
        console.log(actionObj.description);
      } else { // 引用对应的动作文件 将参数传入
        require(path.join(__dirname, '/lib/', action))(...process.argv.slice(3));
      }
    });
});

// 监听help命令
program.on('--help', () => {
  // console.log(program)
  console.log('Examples：');
  Object.keys(actionsMap).forEach((action) => {
    (actionsMap[action].examples || []).forEach((example) => {
      console.log(`  ${example}`);
    });
  });
});

program.version(version)
  .parse(process.argv); // process.argv就是用户在命令行中传入的参数

