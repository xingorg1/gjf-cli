# gjf-cli

> 根据[vue-cli](https://github.com/vuejs/vue-cli)的思路和源码搭建的一套简易脚手架，只实现模板迁移和版本管理。

## 概览
`bin/gjf`文件中使用`gjf.js`作为入口文件，并且以`node`环境执行此文件


## 开发
在gjf-cli根目录下执行命令，链接包到全局下使用
```bash
npm link
```
## 使用
### 全局安装
因为是命令工具，最好全局安装
```bash
npm i gjf-cli -g
```

### 创建项目
在准备创建项目的文件夹下执行下列命令，创建一个project
```bash
gjf-cli create <project-name> # 比如：gjf-cli create test

```

**若有同名目录，直接`覆盖现有项目`（适用于开发测试时，去掉繁琐的删除测试project功能）**
```bash
gjf-cli create <project-name> -f # 比如：gjf-cli create test -f
```

## 关于纯净框架的生成思路:
1. 第一版方案：有个git仓库放置框架源码，使用gitclone把最新代码down下来到当前目录里
  - git clone down到哪里？
  - clone下来的是整个包，怎么把里边的内容拷贝到当前创建的目录下？
1. 第一个方案升级版：有一个模板文件夹（generator）进行文件拷贝与迁移即可。脚手架和组件代码在一起【TODO: done】
1. 第二版，单独创建各个文件【TODO:】

--- 

- [x] 第一版计划：【已完成】
1、readme直接生成
2、其他文件，直接拷贝
3、拷贝文件的标题，要改成当前项目的标题

- [ ] 第二版升级计划
问答式，根据问答选择框架的配置，然后生成最终的配置文件

- [ ] 待做
TODO: 整理目录结构，去掉src，src下内容转移到根目录