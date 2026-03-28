[UI加强工具-ui-ux-pro-max-skill](l https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).
使用此工具先要安装python:
```sh
# Windows 安装 Python（如未安装）
winget install Python.Python.3.12
```
通过 CLI 安装:
```sh
# 1. 全局安装 CLI 工具
npm install -g uipro-cli
# 2. 在项目目录下为 Cursor 初始化 Skill
uipro init --ai cursor
```

## tailwind备忘录

`grid grid-cols-3 gap-4`等同于flex下有三个元素同等分3份。如果4个元素，那么第四个元素就换行了。


## 模拟cussor的插件登录
因为cussor的浏览器没有插件功能,所以要在控制台输入token和地址,控制台输入一下内容即可:
```js
function setToken(token, address = '') {
  const current = JSON.parse(localStorage.getItem('rwa-auth') || '{"state":{}}')
  current.state.token = token
  current.state.isLoggedIn = true
  if (address) current.state.address = address
  localStorage.setItem('rwa-auth', JSON.stringify(current))
  console.log('✅ token 已写入，刷新页面生效')
}
setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIndhbGxldCI6IjB4NDI3ODc0NGJhNDM3ZDg3NjQxNjJiZmYyZDk4ZWQzNmI3ZTQxZDQ3NCIsInRva2VuVHlwZSI6ImFjY2VzcyIsImlzcyI6InJ3YXQtYXBwLXVzZXIiLCJzdWIiOiIxIiwiZXhwIjoxNzc0NTk3NTI5LCJpYXQiOjE3NzQ1OTM5Mjl9.oIa2sXCjIiZDHavpTykcqsTw3e4Bh0HpZeRchTh-Lvo', '0x4278744ba437d8764162bff2d98ed36b7e41d474')
```


