## 分支说明
```
{
    "content_scripts":[
        {
            "matches":[
                "http://115.28.115.220:5000/log/"
            ],
            "css":[
                "css/bootstrap.min.css"
            ],
            "js":[
                "js/jquery.min.js",
                "js/bootstrap.min.js",
                "js/jslinq.js",
                "js/content_scripts_list.js"
            ],
            "run_at":"document_start"
        }
    ]
}
```
如代码所示，通过在`manifest.json`里配置`content_scripts`节点，可以实现向`matches`里指定的页面里注入`js`、`css`。有了`js`、`css`的注入，页面可以美化成自己想好要的任何样子。
> 注：`run_at`设置为`document_start`表示在页面渲染之前就注入，同时自己渲染页面的`content_scripts_list.js`所有代码都需要写在页面`DOMContentLoaded`监听事件里面，例：
```
document.addEventListener('DOMContentLoaded', function () {
    //your format page javascript...
});
```
这样的好处是：每次打开不会看到原始页面刷一下过去才显示美化后的页面，直接就显示美化后的页面，用户基本没有感知。
> 注：`content_scripts`可以配置多个规则，实现向不同页面注入不同的`js`。

## 效果演示
### 默认文件列表
![默认文件列表](https://github.com/oppoic/LogFilter/blob/content-scripts/pic/list-origin.png)
### 美化文件列表
![美化文件列表](https://github.com/oppoic/LogFilter/blob/content-scripts/pic/list-format.png)

### 默认详情页面
![默认详情页面](https://github.com/oppoic/LogFilter/blob/content-scripts/pic/detail-origin.png)
### 美化详情页面
![美化详情页面](https://github.com/oppoic/LogFilter/blob/content-scripts/pic/detail-format.png)

## 使用本插件格式限定
### 文件列表页面
* 每行都必须包括文件名、文件日期、文件大小，这三个中间由1个或者n个空格连接
* 文件名固定格式：项目名-年月日-小时.txt（后缀名不限制），`js`根据“-”进行`split`然后分组。项目名去重后显示在顶部，日期在左侧，日志信息在右侧
* 文件日期必须包含年月日时分。格式无需固定，*05-Nov-2018 16:43*、*2018-11-05 16:43*都是可以的
* 每个文件名需在`a`标签里，所有`a`标签在`pre`标签里。`pre`下的第一个`a`标签是上一页链接，不会收录进来
> 注：默认web服务器输出的文件列表页面，应该都满足这个格式。
### 文件详情页面
* 每行都必须是一个标准的json字符串
* 每个json对象必须包含：`Level`、`Time`、`LogStore`、`Source`，这四个属性作为重要信息左侧展示，其他属性点击了左侧的`nav`行在右侧展示
> 注：test目录有原始页面的源码文件，请参考。更多使用场景请自己发挥，代码稍做修改即可。

## 使用方法
### 本地加载
下载源码，打开Chrome浏览器 - 更多工具 - 扩展程序，打开“开发者模式” - 加载已解压的扩展程序 - 选择源码的src目录 - 确定
> 优点：代码随时可改，刷新即生效；缺点：每次打开`chrome`都有安全提示，点忽略才可以启动插件
### chrome 网上应用店
地址：https://chrome.google.com/webstore/detail/logfilter/cdeolmmphppafidkkkcbfejegimfngmc
> 不建议大家在谷歌商店下载，因为地址写死了没法配置。建议下载源码，然后选择本地加载。

## 其他
更多谷歌插件开发，请参考：[官方文档](https://developer.chrome.com/extensions/overview "点击在当前页打开")

## 总结
相比于`background`的方式，`content_scripts`实现的更干净，只往指定的页面注入代码。缺点也同样明显，就是没法动态配置需要注入代码的页面地址。如果你需要美化的页面地址不常变化，可以下载本分支代码，然后修改`matches`里的地址自己打包成`crx`文件使用。
