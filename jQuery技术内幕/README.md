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
    3.为什么要设置undefined参数 [1]
        * 防止undefined被重写.（IE6，7，8）
        * 压缩优化，缩短查找作用域链
##jQuery(selector[,context])
###代码
    quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
    match = quickExpr.exec(selector);
    //处理ID选择器和html
    if (match && (match[1] || !context)) {
        if(match[1]){
            ret = rsingleTag.exec(selector);
            if (ret) {
                if (jQuery.isPlainObject(context)) {  //如果有参数props，则将其设置给DOM
                    jQuery.fn.attr.call(selector, context, true);
                }else{
                }
            }else{
            }
        }else{
            elem = document.getElementById(match[2]);
        }
    }
    // Handle $(DOMElement)；
    if (selector.nodeType) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;
    }

    $('div.foo').click(function(){
        $('span',this).addClass('bar');
    });

###要点
    1.如果参数是选择器表达式，则遍历文档，查找与之匹配的DOM元素，创建对象。默认情况下，对匹配元素的查找将从根元素document对象
      开始，但是若果传入了第二个context，则可以从这个限定范围内查找。代码中，对选择器表达式“span”的查找被限制在了this的范围内。
    2.quickExpr正则是用来检测html和ID选择器的。注意，如果是ID选择器，那么match[1]是undefined，则(match[1] || !context) = true
      这说明，如果是id选择器指定context，则效率会降低。
      rsingleTag正则是用来判断jquery参数是单独的标签还是HTML片段。若是标签，则采用浏览器document.createElement()创建DOM元素，
      否则则采用jquery.buildFragment()和jQuery.clean()内的innerHTML创建DOM元素。
      jQuery.fn.attr.call(selector, context, true)用在下面这种情况：
        $('div',{"class":"first"},text:"Click",click:function(){...});
    3.selector.nodeType是用来判断如果已经是节点（DOM元素），返回包含了该DOM元素引用的jQuery对象。这就是DOM对象转换为jQuery对象。

    4.如果jquery参数本来就是个jquery对象，则将其复制并返回。
        if (selector.selector !== undefined) {
            this.selector = selector.selector;
                this.context = selector.context;
        }
##jQuery总体结构

    1.return new jQuery.fn.init(selector, context, rootjQuery)  第27行
      * 为什么要创建并返回init的实例，而不是直接返回jquery的实例？
        通常创建一个对象实例的方式是在运算符new后面紧跟一个构造函数，但是如果构造函数有返回值，运算符new所创建的对象会被丢弃，返回
        值将作为new表达式的值。利用这一个特性，使在创建jQuery对象时，可以省略运算符new直接写成jQuery(),并且在后面还第一了jQuery
        别名$，这样，创建jQuery对象就可以直接写成$()。

    2.jQuery.fn = jQuery.prototype    第97行
        jQuery.fn是jQuery.prototype的简写，减少字符，方便拼写。

    3.既然调用构造函数jQuery()返回的对象实际是构造函数jQuery.fn.init()的实例，为什么能在构造函数jQuery()的原型方法和属性？例如
      $("#id).length()等。
      在第322行执行jQuery.fn.init.prototype = jQuery.fn时，用构造函数jQuery()的原型对象覆盖了构造函数jQuery.fn.init()的原型
      对象，从而使构造函数jQuery.fn.init()的实例也可以访问构造函数jQuery()的原型方法和属性。
      结合1,3可以发现一种新的创建对象的方式。
    4.为什么要把22行定义的构造函数jQuery的代码包裹在一个自调用的匿名函数中？
        将jQuery构造函数包裹在一个自调用的匿名函数中，可以降低与其他模块的耦合。因为在里面的代码中定义了很多其他的局部变量，这些
        局部变量只在构造jQuery对象模块内部使用。通过把这些局部变量包裹在一个自调用的匿名函数中，实现了高内聚低耦合的思想。

    5.为什么要覆盖构造函数jQuery()的原型对象jQuery.prototype？
        在原型对象jQuery.prototype上定义的属性和方法会被所有jQuery对象继承，可以有效的减少每个jQuery对象所需的内存。事实上,jQuery
        对象只包含5种非继承属性，其余都继承自原型对象jQuery.prototype；在构造函数jQuery.fn.init()中设置了整形属性,length,selector
        context;原型方法设置.pushStack()中设置了prevObject。因此，也不必因为jQuery对象带有太多的属性和方法而担心会占用太多内存。
##jQuery.fn.init(selector,context,rootjQuery)
    1.参数rootjQuery包含了document对象的jQuery对象，用于document.getElementById()查找失败、selector是选择器表达式且未指定context、
    selector是函数的情况。
    2.if (elem.id !== match[2]) {}  171行   （2）
        这样判断是因为IE6，IE7以及opera的某些版本，会更具form的name来查询，而不是id。
    3.if (jQuery.isFunction(selector)){ return rootjQuery.ready(selector)}
        可以看出，$(function)是$(document).ready(function) 的简写。

##jQuery.buildFragment(args,nodes,scripts)

###原理
      先创建一个文档片段DocumentFragment,然后调用方法jQuery.clean(elems,context,fragment,script)将HTML代码转换为DOM元素，
    存储在创建的文档片段中。
      文档片段DocumentFragment表示文档的一部分，但不属于文档树。当把DocumentFragment插入文档数时，插入的不是DocumentFragment
    本身，而是他的所有子孙节点，即可以一次向文档树中插入多个节点。提升性能。
      如果HTML代码符合缓存条件，方法jQuery.buildFragment()还会把转换后的DOM元素缓存起来，下次（实际上是第三次）转换相同的HTML
    代码时直接从缓存中读取，不需要重复转换。
###代码
      参数args:数组，含有待转换为DOM元素的HTML代码。
      参数nodes:数组，含有文档对象，jQuery对象或DOM元素，用于修正创建文档片段DocumentFragment的文档对象。
      参数scripts:数组，用于存放HTML代码中的script元素。jQuery.clean()把HTML代码转换为DOM元素后，会提取其中的script元素并存入
    数组scripts。
###缓存条件
    1.args的长度为1且第一个元素是字符串，即数组args中只含有一段HTML代码。 typeof first === "string"
    2.HTML代码长度小于512，否则可能会导致缓存占用的内存过大。
    3.文档对象doc是当前文档对象，即至缓存为当前文档创建的DOM元素，不缓存其他框架（iframe）的。
    4.HTML代码以左尖括号开头，即只缓存DOM元素不缓存文本节点。、
    5.HTML代码中不能含有<script>,<object>,<embed>,<option>,<style> 因为如果缓存option会导致丢失option的选中状态。
    6.当前浏览器可以正确的复制单选按钮和复选框的选中状态checked,或者HTML代码中单选按钮和复选按钮没有被选中。
    7.当前浏览器可以正确地复制HTML5元素或者HTML代码中没有HTML5标签。

##jQuery.clean(elems,context,fragment,script)

###原理
      方法jQuery.clean()负责把HTML代码转换成DOM元素，并提取其中的script元素。该方法先创建一个临时的div元素，并将其插入一个
    安全的文档片段中，然后把HTML元素代码赋值给div元素的innerHTML属性，浏览器会自动生成DOM元素，最后解析div元素的子元素得到
    转换后的DOM元素。
