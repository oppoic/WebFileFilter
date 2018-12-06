# 项目说明
LogFilter是一款谷歌插件（Chrome Extension），安装后可以美化web服务器输出的**文件列表**页面。

# 效果演示
## 默认文件列表
![默认文件列表](https://github.com/oppoic/LogFilter/blob/background/pic/list-origin.png?raw=true)
这是日志列表页面，不同项目的日志参杂在一起，找起来比较费劲。
## 美化文件列表
![美化文件列表](https://github.com/oppoic/LogFilter/blob/background/pic/list-format.png?raw=true)

# 使用本插件格式限定
* 每行都必须包括文件名、文件日期、文件大小，这三个中间由1个或者n个空格连接
* 文件名固定格式：项目名-年月日-小时.txt（后缀名不限制），`js`根据“-”进行`split`然后分组。项目名去重后显示在顶部，日期在左侧，日志信息在右侧
* 文件日期必须包含年月日时分。格式无需固定，*05-Nov-2018 16:43*、*2018-11-05 16:43*都是可以的
* 每个文件名需在`a`标签里，所有`a`标签在`pre`标签里。`pre`下的第一个`a`标签是上一页链接，不会收录进来

# 使用方法
## 本地加载
下载本项目源码，打开Chrome浏览器 - 更多工具 - 扩展程序，打开“开发者模式” - 加载已解压的扩展程序 - 选择本项目源码的src目录 - 确定
> 优点：代码随时可改，刷新即生效；缺点：每次打开`chrome`都有安全提示，点忽略才可以启动插件
## chrome 网上应用店
地址：https://chrome.google.com/webstore/detail/logfilter/cdeolmmphppafidkkkcbfejegimfngmc
> 优点：自动升级；缺点：需要科学上网

# 其他
更多谷歌插件开发，请参考：[官方文档](https://developer.chrome.com/extensions/overview "点击在当前页打开")
