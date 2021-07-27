// 创建项目
const axios = require('axios');
const ora = require('ora');
const Inquirer = require('inquirer')
const { promisify } = require('util');
let downLoadGit = require('download-git-repo');
downLoadGit = promisify(downLoadGit);
// 根据对应的环境变量获取到用户目录（process.platform 在windows下获取的是 win32，mac 下是 darwin）
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;
// 1).获取仓库列表
const fetchRepoList = async () => {
  // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
  // TODO: 研究这个api地址的数据是怎么根据github仓库生成的（https://docs.github.com/cn/rest/guides/getting-started-with-the-rest-api）
  const { data } = await axios.get('https://api.github.com/orgs/axe-cli/repos');
  return data;
};
const fetchTagList = async (repo) => {
  // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
  const { data } = await axios.get(`https://api.github.com/repos/axe-cli/${repo}/tags`);
  return data;
};

module.exports = async (projectName) => {
  // console.log('create.js文件：', projectName);

  // 获取版本信息
  const wrapFetchAddLoding = (fn, message) => async (...args) => {
    const spinner = ora(message);
    spinner.start(); // 开始loading
    const r = await fn(...args);
    spinner.succeed(); // 结束loading
    return r;
  };

  // 选择模板
  let repos = await wrapFetchAddLoding(fetchRepoList, 'fetching repo list')();
  repos = repos.map((item) => item.name);
  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: repos, // 选择模式
  });
  console.log(repo);

  // 选择版本
  let tags = await wrapFetchAddLoding(fetchTagList, 'fetching tag list')(repo);
  tags = tags.map((item) => item.name);
  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: tags,
  });
  console.log(tags)

  // 下载项目
  const download = async (repo, tag) => {
    console.log(repo, tag)
    let api = `axe-cli/${repo}`; // 下载项目
    if (tag) {
      api += `#${tag}`;
    }
    const dest = `${downloadDirectory}/${repo}`; // 将模板下载到对应的目录中
    await downLoadGit(api, dest);
    return dest; // 返回下载目录
  };
  const target = await wrapFetchAddLoding(download, 'download template')(repo, tag);

  // 拷贝项目
  let ncp = require('ncp');
  ncp = promisify(ncp);
  // 将下载的文件拷贝到当前执行命令的目录下
  await ncp(target, path.join(path.resolve(), projectName));
};