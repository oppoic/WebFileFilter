# 项目说明
本项目是一个谷歌插件（Chrome Plugin），安装后可以美化一些阅读体验差的页面。本项目美化的是web服务器输出的默认日志页面。

# 当前分支
通过把日志页面的`url`地址设置到`content_scripts`里实现对日志页面的分类、排序等操作，这样`js`只注入到设置的页面，其他任何页面都不注入也不运行，非常干净。缺点是如果日志页面地址变了，要手动更新`content_scripts`才可以。

# 格式限定
## 日志列表页面
* 获取源码根据\n分割，每行需包括文件名、文件日期、文件大小，这三个中间由1个或者n个空格分割
* 文件名固定格式：项目名-年月日-小时.txt（后缀名不限制），js根据“-”进行split然后分组。项目名去重后显示在顶部，日期在左侧，日志信息在右侧
* 文件日期必须包含年月日时分。格式无需固定，05-Nov-2018 16:43、2018-11-05 16:43都是可以的
* 每个文件名需在a标签里，所有a标签在pre标签里。pre下的第一个a标签是上一页链接，不会收录进来
## 日志详情页面
* 获取源码根据\n分割，每行都必须是一个标准的json字符串
* 每个json对象必须包含：Level、Time、LogStore、Source，这四个属性作为重要信息左侧展示，其他属性点击了左侧的nav行在右侧展示
> 注：test目录有原始页面的源码文件，请参考。更多使用使用场景自己发挥，代码稍做修改即可。

# 使用方法
下载本项目源码，打开Chrome浏览器 - 更多工具 - 扩展程序，打开“开发者模式” - 加载已解压的扩展程序 - 选择本项目源码的src目录 - 确定

# 其他
更多谷歌插件开发，请参考 [官方文档](https://developer.chrome.com/extensions/overview "点击前往")

# 效果图
## 默认日志列表
![默认日志列表](https://github.com/oppoic/LogFilter/blob/master/pic/list-origin.png?raw=true)
## 格式化日志列表
![格式化日志列表](https://github.com/oppoic/LogFilter/blob/master/pic/list-format.png?raw=true)
## 默认日志详情
![默认日志详情](https://github.com/oppoic/LogFilter/blob/master/pic/detail-origin.png?raw=true)
## 格式化日志详情
![格式化日志详情](https://github.com/oppoic/LogFilter/blob/master/pic/detail-format.png?raw=true)