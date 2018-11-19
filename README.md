# 项目说明
LogFilter是一款谷歌插件（Chrome Plugin），安装后可以美化web服务器输出的**文件列表**和**文件详情**页面。

# 效果演示
## 默认文件列表
![默认文件列表](https://github.com/oppoic/LogFilter/blob/master/pic/list-origin.png?raw=true)
这是日志列表页面，不同项目的日志参杂在一起，找起来比较费劲。这里可以通过`content_scripts`向这个页面注入`js`、`css`，实现对不同项目的日志进行分类、排序和美化展示。来看看处理后的效果
## 美化文件列表
![美化文件列表](https://github.com/oppoic/LogFilter/blob/master/pic/list-format.png?raw=true)
使用`content_scripts`向页面注入`js`、`css`而不使用`background`的方式，是因为`content_scripts`的方式只注入到已经配置的页面，其他任何页面都不注入也不运行，非常干净。缺点是如果页面地址变了，需要手动更新`content_scripts`的配置。

## 默认详情页面
![默认详情页面](https://github.com/oppoic/LogFilter/blob/master/pic/detail-origin.png?raw=true)
这是日志详情页面，都参杂在一起，而且每条都很长，基本没有可读性。这里同样可以通过`content_scripts`向这个页面注入`js`、`css`美化这个页面，看看效果
## 美化详情页面
![美化详情页面](https://github.com/oppoic/LogFilter/blob/master/pic/detail-format.png?raw=true)

# 使用本插件格式限定
## 文件列表页面
* 每行都必须包括文件名、文件日期、文件大小，这三个中间由1个或者n个空格连接
* 文件名固定格式：项目名-年月日-小时.txt（后缀名不限制），`js`根据“-”进行`split`然后分组。项目名去重后显示在顶部，日期在左侧，日志信息在右侧
* 文件日期必须包含年月日时分。格式无需固定，*05-Nov-2018 16:43*、*2018-11-05 16:43*都是可以的
* 每个文件名需在`a`标签里，所有`a`标签在`pre`标签里。`pre`下的第一个`a`标签是上一页链接，不会收录进来
## 文件详情页面
* 每行都必须是一个标准的json字符串
* 每个json对象必须包含：`Level`、`Time`、`LogStore`、`Source`，这四个属性作为重要信息左侧展示，其他属性点击了左侧的`nav`行在右侧展示
> 注：test目录有原始页面的源码文件，请参考。更多使用场景请自己发挥，代码稍做修改即可。

# 使用方法
下载本项目源码，打开Chrome浏览器 - 更多工具 - 扩展程序，打开“开发者模式” - 加载已解压的扩展程序 - 选择本项目源码的src目录 - 确定

# 其他
更多谷歌插件开发，请参考：[官方文档](https://developer.chrome.com/extensions/overview "点击在当前页打开")
