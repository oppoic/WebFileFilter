## 分支说明
```
{
  "options_page": "settings.html",
  "permissions": [
    "tabs",
    "http://*/*",
    "https://*/*"
  ],
  "background": {
    "scripts": [
      "js/background.js"
    ],
    "persistent": false
  }
}
```
1. `settings.html`是一个配置页面，把需要注入`js`、`css`的网页URL地址写进来，实现动态注入
2. `permissions`下必须得有tabs权限，否则获取不到用户访问的网页URL地址、`http://*/*`,`https://*/*`有这俩权限，才可以通过`js`修改页面内容
3. `background.js`一直在后台运行，判断用户打开的网页是否已经配置到`settings.html`页面，从而决定注不注入`js`和`css`

## 效果演示
### 默认文件列表
![默认文件列表](https://github.com/oppoic/WebFileFilter/blob/background/pic/list-origin.png)
### 美化文件列表
![美化文件列表](https://github.com/oppoic/WebFileFilter/blob/background/pic/list-format.png)

## 格式限定
### 文件列表页面
* 每行都必须包括文件名、文件日期、文件大小，这三个中间由1个或者n个空格连接
* 文件名固定格式：分类A-分类B-分类C（必须大于等于3个分类），`js`根据“-”进行`split`然后分组。分类A去重后显示在顶部，分类B去重后显示在左侧，右侧则显示文件的详细信息
* 文件日期必须包含年月日时分。格式无需固定，*05-Nov-2018 16:43*、*2018-11-05 16:43*都是可以的
* 每个文件名需在`a`标签里，所有`a`标签在`pre`标签里。`pre`下的第一个`a`标签是上一页链接，不会收录进来
> 注：默认web服务器输出的文件列表页面，应该都满足这个格式。

## 安装
### 本地加载
下载源码，打开Chrome浏览器 - 更多工具 - 扩展程序，打开“开发者模式” - 加载已解压的扩展程序 - 选择源码的src目录 - 确定
> 优点：代码随时可改，刷新插件即生效；缺点：每次打开`chrome`都有安全提示，点忽略才可以启动插件
### 应用商店
地址：https://chrome.google.com/webstore/detail/webfilefilterpro/jaalaojoelhafjioieflinfgeklglegp

## 总结
`background`方式，可以动态修改需要注入`js`、`css`的URL地址，浏览器访问的每个页面都判断是否是用户设置的URL，故效率偏低；`content_scripts`方式比较干净，只往指定的URL地址注入代码，其他一律不注入，效率比较高。

## 其他
更多谷歌插件开发，请参考：[官方文档](https://developer.chrome.com/extensions/overview "点击在当前页打开")