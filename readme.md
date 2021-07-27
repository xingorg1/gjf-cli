# axe-cli

根据[vue-cli](https://github.com/vuejs/vue-cli)的思路和源码搭建的一套简易脚手架，只实现模板迁移和版本管理。

`bin/axe`文件中使用`axe.js`作为入口文件，并且以`node`环境执行此文件

```bash
npm link # 链接包到全局下使用
```

## 关于纯净框架的生成思路:
1. 第一版方案：有个git仓库放置框架源码，使用gitclone把最新代码down下来到当前目录里
1. 第一个方案升级版：有一个模板文件夹（generator）进行文件拷贝与迁移即可。脚手架和组件代码在一起
1. 第二版，单独创建各个文件
