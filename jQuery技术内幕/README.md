#jQuery技术内幕

2015-3-2 09:36:48
个人阅读笔记

##自调用匿名函数
###代码
    (function(window,undefined){
        var jQuery = ...
        //...
        window.jQuery = window.$ = jQuery;
    })(window);

###要点
    1.使jquery代码不会和其它代码干扰，只有jQuery成为公开变量，其它部分则私有。
    2.将window设置为参数优点：
        * 在jQuery代码块中访问window对象不需要将作用域链回退到顶层作用域，可以更快地访问window对象。
        * 代码压缩时，会把参数window压缩为一个字母，减少文件大小。
    3.为什么要设置undefined参数 [1](./1-undefined/test.html)
        *