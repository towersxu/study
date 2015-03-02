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