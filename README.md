# master分支
通过把日志页面的`url`设置到`content_scripts`来实现，这样js只注入到设置的页面，其他任何页面都不注入也不运行，非常干净。缺点是如果日志页面地址变了，要手动设置到`content_scripts`的`matches`数组里才可以。

