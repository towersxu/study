#编写可维护的javascript
##代码规范
###换行：在单行达到最大字符数限制后，需手动将一行拆成两行。通常会在运算符后换行，下一行会增加两个层级的缩进。
    if(isLeap && isFail && isName && ... && isStu &&
            isHuman){
        alert(1);
    }
###空行：
    1）在方法之间
    2）在方法中的局部变量和第一条语句之间
    3）在注释之前
    4）在方法内的逻辑片段之间
###命名规范
    1）变量 var isHuman = false
    2) 常量 var URL = "http://4.tophp.sinaapp.com"
###null
    1)用来初始化一个变量，这个变量可能赋值为一个对象。
    2)用来和一个初始化的变量比较，这个变量可以是也可以不是一个对象
    3)用来做传入参数的替代
    4)返回值
    5)不要用null来检测是否传入了某个参数
    6)不要用null来检测一个未初始化的变量
###for-in
    优先使用for循环，因为for-in不仅遍历对象的实例属性，同样还遍历从原型继承来的属性。
    如果需要用到for-in，最好使用hasOwnProperty()来为for-in循环过滤出实例属性。
    当想查找原型链的时候，需在for-in上面注释其对原型链遍历。
    对于数组，不要使用for-in进行遍历。
###严格模式"use strict"
    1）不推荐在全局变量中使用严格模式，因为将多个文件连接合并成一个文件时，其中一个文件在全局作用域中
       启用了严格模式，那么其他文件都将使用严格模式。
    2）可以使用立即执行函数包裹严格模式
        (function(){
            "use strict"
            function(){}
        })();
###比较 ==
    1）在使用“==”进行比较的时候，如果其中一个值是对象而另一个不是，则会首先调用对象的valueOf方法，得到
    原始类型值再进行比较。如果没有定义valueOf()，则调用toString().
    2) null == undefined    ===>true
###事件
    1）隔离应用逻辑
    2）不要分发事件。即不要把event对象当做参数传递,只需传递事件中可用部分就好了。
    3) 处理事件时，最好让事件处理程序成为接触到event对象的唯一的函数。事件处理程序应当在进入应用逻辑之
       前针对event对象执行任何必要的操作，包括阻止默认事件或阻止事件冒泡，都应当直接包含在事件处理程序中。
       event.preventDefault()和event.stopPropagation()
###检测
    1) typeof null   ===>object
    2) 在javascript中检测自定义类型时，最好的做法就是使用instanceof运算符，这也是唯一的方法。同样，对于
       内置javascript类型也是如此，但是，需注意在浏览器不同的帧（frame）中（跨域），则会出现不一样的情况。
    3）检测函数时，最好使用typeof，因为它可以跨帧，但是在IE8和更早的版本中，使用typeof来检测DOM节点上面的
       函数都会返回“object”，而不是“function”，可以使用以下方法解决：
           if( "querySelectorAll" in document){}
    4）检测数组：在帧之间来回传递数组时，使用instanceof Array在此场景中不总数返回正确的结果。因为每一个
       帧（frame）都有各自的Array构造函数，因此一个帧（frame）中的实例在另外一个帧里面不会被识别。可以
       使用以下方法解决：
       function isArray(value){
          if(typeof Array.isArray === "function"){
              return Array.isArray(value);
          }else{
              return Object.prototype.toString.call(value) == "[object Array]";
          }
       }
    5) 检测属性：由于IE8及更早的版本中，DOM对象并非继承自object，所以使用hasOwnProperty()方法检测某个属性
       是否存在于对象中时可以使用in,兼容写法如下：
       if("hasOwnProperty" in object && object.hasOwnProperty("related") || "related" in object){
       }
###配置数据抽离
    1）配置数据抽离范围建议：
        URL；
        需要展现给用户的字符串；
        重复的值；
        设置（比如每页的配置项）；
        任何可能发生变更的值；
    2）配置属性名前缀建议：
        URL-网络地址
        MSG-展现给用户的消息
        CSS-className
###异常处理
    1）如果try块中包含了一个return语句，实际上它必须等到finally块中的代码执行后才能返回。
###继承
    1）在javascript中有两种基本的继承方式：基于对象的继承和基于类型的继承。
    2）基于对象的继承也叫做原型继承，一个对象继承另外一个对象是不需要调用构造函数的。ES5中有Object.create（）
        来实现这种方式。
    3) 基于类型的继承也是从一个已经存在的对象继承，这里的继承是依赖于原型的。因此，基于类型的继承是通过构造函数
       实现的，而非对象。
       function Person(name) {
            this.name = name;
       }
       function Author(name){
            Person.call(this,name);
       }
       Author.prototype = new Person();
###阻止修改
    ES5新增方法用于防止对对象的修改。在IE9，Firefox 4+,Chrome中已经实现这些功能。
    锁定分三种级别：
        1.防止扩展：禁止为对象“添加”属性和方法，但已存在的属性和方法是可以被修改或删除的。
        2.密封：类似于防止扩展，但禁止为对象“删除”已存在的属性和方法。
        3.冻结：类似密封，而且禁止为对象修改已存在的属性和方法（所有字段皆为只读）。
    每种锁定的类型都拥有两种方法：一个用来实施操作，另一个用来检测是否应用了相应的操作。
        1.防止扩展：Object.preventExtension();Object.isExtensible()
        2.密封：Object.seal();Object.isSealed()
        3.冻结：Object.freeze();Object.isFrozen()
    最好在对象锁定修改的时候使用严格模式，因为在非严格模式下，试图修改不可修改的对象总是悄无声息地失败，如果其他
    人在试图修改时，由于不知道原因，所以会导致无法调试。
###浏览器嗅探
    1.尽量不使用User-Agent检测，若必须检测，请使用向前检测，即检测已经发布了的版本。（例如检测IE8及以前的版本而不
    是检测IE9及以后的版本。）
    2.特性检测：为特定浏览器的特性进行测试，并仅当特性存在时即可应用特性检测。避免特性推断如：
        if(window.ActiveXObject){       //IE
            id = document.uniqueID;
        }
        通过window.ActiveXObject判断是否为Internet Explorer,一旦确定了浏览器是Internet Explorer,便假设可以安
        全的使用IE所特有的document.uniqueID，这是错误的隐式推断，可能会导致代码不能正常运行。
###最佳实践
    1.一个文件只包含一个对象。为了避免多人维护一个文件的可能。
    2.相关的文件用目录分组。
    3.保持第三方代码的独立。
    4.确定创建位置，即源码和编译后的源码分开。
    5.目录结构
        build：用来放置最终构建后的文件，理想情况下这个目录不应该提交。
        src:用来放置所有的源文件，包括用来进行文件分组的子目录。
        test:用来放置所有的测试文件。通常包含一些同源代码目录一一对应的子目录或文件。