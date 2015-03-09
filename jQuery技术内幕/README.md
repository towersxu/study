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
###参数
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
      安全文档片段指能正确渲染HTML5元素的文档片段，通过在文档片段上创建HTML5元素，可以教会浏览器正确的渲染HTML5元素。
      如果HTML代码中含有需要包裹在父标签中的子标签，例如<option>需要包裹在<select>中，方法jQuery.clean()会先在HTML
    代码的前后加上父标签和关闭标签，在设置临时div元素的innerHTML属性生成DOM元素后，在层层剥去包裹的父元素，取出HTML
    代码对应的DOM元素。
      如果HTML代码中含有<script>标签，为了能执行其中的script代码或者其引用的文件，在设置临时div元素的innerHTML属性
    生成DOM元素后，jQuery.clean()会提取<script>中的元素放入scripts数组中.注意，含有<script>标签的HTML代码设置给某
    个元素innerHTML后，其中的script代码并不会自动执行，所引用的javascript文件也不会加载和执行。(3-script自动执行)

###参数
      参数elems:数组，包含了待转换的HTML代码。
      参数context：文档对象，该参数在方法jQuery.buildFragment()中被修改为正确的文档对象（变量doc），稍后会调用它
    的方法createTextNode()创建文本节点、调用方法createElement()创建临时div元素。
      参数fragment：文档片段，作为存放转换后的DOM元素的占位符，该参数在jQuery.buildFragment中被创建。
      参数scripts：数组，用于存放转换后的DOM元素中的scripts元素。
###要点
    * 由于在.before()和.after()中直接调用clean()方法，并且只传入elems参数，所以要对context进行修正。
    * context = context || document
    由于在IE中，context.createElement失败返回的是object，所以还需增加验证
    if( typeof context.createElement ==="undefined"){
        context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
    }

    * 创建option如果包含在单选的<select>中，创建的第一个option元素的属性会被浏览器默认设置为true，而如果
    包含在多选的<select multiple='multiple'>中，则不会被浏览器修改。
    * 在IE9以下的浏览器中，不能序列化标签<link>和<script>,即通过浏览器的innerHTML机制不能将其转换为对应的
    script元素和link元素。解决方案是在标签<link>和<script>外面再包裹一层元素再转换。包裹的元素定义在
    wrapMap._default中，_default默认为[0,"",""],如果jQuery.support.htmlSerialize为false，则会在第5675
    行被修正为[1,"div<div>","</div>"]。                          (4-innerHTML插入script元素兼容性问题)
    * 创建安全片段:IE9以下的浏览器不支持HTML5元素，如果遇到未知标签（如<article>）,浏览器会向DOM树插入一个
    没有子元素的空元素。解决方法是在使用未知标签之前，使用document.createElement('未知标签')创建一个对应的
    DOM元素，这样就“教会”浏览器正确的解析和渲染这个未知标签。    (jQuery1.7.1 5667行)
    * 利用浏览器的innerHTML机制将HTML代码转换为DOM元素
    先为HTML代码包裹必要的父标签，然后赋值给临时的div元素的innerHTML属性，从而将HTML代码转换为DOM元素，之后
    再层层剥去包裹的父元素，得到转换后的DOM元素。
    * 返回转换后的DOM元素，如果传入了文档片段fragment和数组scripts，那么调用jQuery.clean()的代码应从fragment
    中读取转换后的DOM元素，从scripts中读取合法的script元素。如果未传入，则只能使用返回值ret.

##jQuery.extend([deep],target,object1[,objectN])
    等同于jQuery.fn.extend([deep],target,object1[,objectN]),用于合并两个或多个对象的属性到第一个对象。
###参数
      参数deep：可选布尔值，表示是否进行深度合并（即递归合并）。合并行为默认是不递归的，如果第一个参数的属性
    本身是一个对象或者数组，那么他的属性会被后面的其它参数的同名属性完全覆盖。如果为true，表示进行深度合并，
    合并过程是递归的。
      参数target：目标对象
      参数object1[,objectN]:源对象，包含待合并属性。如果提供了2个或者更多的对象，所有源对象的属性都将会合并
    到目标对象；如果仅提供一个对象，意味着参数target被忽略，jQuery或者jQuery.fn被当做目标对象，通过这种方式
    可以再jQuery或者jQuery.fn上添加新的属性和方法，jQuery的其他模块大都是这么实现的。
###
    1.当参数个数不定时，函数参数不列出，采用argument获取。
    2.如果不是深度合并，核心代码为target[name] = object[name]
    3.深度合并递归停止点 if (target === copy) {continue;}
##jQuery其它方法技巧
    1.使用get()方法时，参数可以为负数，这是可以使用length+num计算来获取负索引所在的位置。
    2.each(callback,args),jQuery.each(object,callback,args)
        参数object:待遍历的对象或数组
        参数callbacks:回调函数，会在数组的每个元素或对象的每个属性上执行。
        参数args:传给回调函数callbacks的参数数组，可选。如果没有传入参数。
        if (callback.apply(object[ name ], args) === false) {break;}
    3.map(callback(value,indexOrKey))，jQuery.map(arrayOrObject,callback(value,indexOrKey))
      map()遍历当前jQuery对象，在每个元素上执行回调函数，并将回调函数的返回值放入一个新jQuery对象中。该方法常用于
    获取或设置DOM元素集合的值。
      执行回调函数时，关键字this指向当前元素。回调函数可以返回一个独立的数据项或者数据项数组，返回值将被插入
    结果集当中。    304行
      jQuery.map()对数组中的每个元素或对象的每个属性调用回调函数，并将函数的返回值放入一个新的数组中。执行
    回调函数时传入两个参数：数组元素或属性值，元素下标或属性名。
      return ret.concat.apply([], ret)    在空数组[]上调用方法concat()扁平化结果集ret中的元素，并返回。
    4.原型方法.pushStack(elements,name,argument)
      创建一个新的空jQuery对象，然后把DOM元素集合放入这个jQuery对象中，并保留对当前jQuery对象的引用。 239
        参数elems:将放入新jQuery对象的元素数组（或类数组对象）。
        参数name:产生元素数组elems的jQuery方法名。
        参数selector:传给jQuery方法的参数，用于修正原型属性.selector。因为jQuery对象都包含了selector属性。
    5.方法.end()结束当前链条中最近的筛选操作，并将匹配元素集合还原为之前的状态。
        return this.prevObject || jQuery.constructor(null)  返回前一个jQuery对象，如果不存在则返回空的对象。
      pushStack入栈，end出栈
    6.slice
        return this.pushStack( slice.apply(this,arguments),"slice",slice.call(arguments).join(",") );
      先借用数组方法slice()从当前jQuery对象中获取指定范围的子集(数组)，在调用方法.pushStack()把子集转换为jQuery
      对象，同时通过属性prevObject保留了对当前jQuery对象的引用。
        字符串转数组的快速方法 i = +i 这就直接将i变为了数字。
##静态属性和方法
###jQuery.noConflict([removeAll])
    if(window.$ === jQuery){window.$ = _$}只有在jQuery库持有全局变量$的情况下，才会释放$的控制权，用_$代替。
    if(deep && window.jQuery = _jQuery) 传入参数true，则表示用_jQuery代替jQuery
###jQuery.type(obj)
      判断参数内建javascript类型。如果参数是undefined或者null，则返回undefined或null；如果参数是javascript内部
    对象，则返回对应的字符串名称；其它情况一律返回“object”。
    return obj == null ? String( obj ) :class2type[toString.call(obj)] || "object";
      注意：如果obj是undefined，obj == null 为true。而String(obj)能将其转换为对应的原始字符串“undefined”或null
###class2type
    toString = Object.prototype.toString
    class2type = {}
    jquery.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(i,name){
        class2type["[object "+name+"]"] = name.toLowerCase();
    })
###jQuery.isWindow(obj)
    通过特征属性setInterval来实现判断是否是window对象。
    return obj && typeof obj === "object" && "setInterval" in obj;
###jQuery.isNumeric( value )
    用于判断参数是否是数字或者看起来像数字。
    !isNaN(parseFloat(obj)) && isFinite( obj );
    方法parseFloat(string)用于对字符串参数进行解析，并返回字符串中第一个数字。
    parseFloat('12.3a')  ===>12.3
    parseInt('12.3a')  ===>12
    isNaN和isFinite是js原生函数。
###isPlainObject(obj)
    判断obj是否是用对象直接量{}或new Object()创建的对象。 参照jsSkill判断对象的类型isPlainObject
###jQuery.parseJSON(data),jQuery.parseXML(data)
      jQuery.parseJSON(data)接受一个格式化良好的json字符串，返回解析后的javascript对象。如果参数是不正确的，那么
    抛出异常，如果参数为null或者undefined，空字符串，返回null.如果浏览器提供了原生的JSON.parse(),则使用该方法解析
    json字符串，否则使用(new Function("return "+data))()解析JSON字符串。
    data = jQuery.trim(data);//IE6/7不支持原生的JSON.parse,在使用(new Function("return "+data))()时，要移除空白符.
      jQuery.parseXML(data)接受一个格式良好的XML字符串，返回解析后的XML文档。该方法使用浏览器原生的XML解析函数实现。
    在IE9+和其它浏览器中，会使用DOMParser对象解析；在IE9以下的浏览器中，使用ActiveXObject对象解析。
###inArray(elem,array,i)
    if(indexOf){return indexOf.call(array,elem,i);} //如果浏览器支持数组方法indexOf(),调用并返回下标。ES5标准化。
