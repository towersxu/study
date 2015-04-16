##requireJS
1)requireJS的配置文件中，baseUrl的值是相对包含require.js的HTML文件的路径，而不是配置文件的相对路径的。
2)在使用了data-main指向设置模板加载选项后，最好不要在页面加载其它js，因为不能保证其它的js所依赖的js已
  经加载成功。
  <script data-main="scripts/main" src="scripts/require.js"></script>
  <script src="scripts/other.js"></script>
  <!--如果other.js依赖require.js加载的其它js,如jquery之类的，那么other会报错，因为很有可能在other.js
  加载完成后，jquery还没有加载成功。-->
  如果要想在HTML内使用require()，那就不要使用data-main.

3)配置项
    1.baseUrl:所有模块查找的根路径。如未显示设置baseUrl，则默认值是加载require.js的HTML所处的位置。如果
    用了data-main属性，则该路径就变成baseUrl.baseUrl可以和require.js处于不同的域下面，requireJS脚本的加
    载是可以跨域的。唯一的限制是使用text! Plugins加载文本内容时，这些路径应跟页面同域，至少开发的时候应该
    这样。优化工具会将text! plugin资源内联，因此在使用优化工具之后可以使用跨域引用text! plugin资源的那些
    资源。
    2.paths:path映射那些不直接放置于baseUrl下的模块名。设置path时起始位置是相对于baseUrl的，除非该path设
    置以"/"开头或含有URL协议(如http:)。用于模块名的path不应含有.js后缀，因为一个path有可能映射到一个目录。
    路径解析机制会自动在映射模块名到path时添加上.js后缀。在文本模版之类的场景中使用require.toUrl()时它也
    会添加合适的后缀。在浏览器中运行时，可指定路径的备选(fallbacks)，以实现诸如首先指定了从CDN中加载，一旦
    CDN加载失败则从本地位置中加载这类的机制。
    3.slim:为那些没有使用define()来声明依赖关系、设置模块的“浏览器全局变量注入”型脚本做依赖和导出配置。
    "shim"配置的重要注意事项:
      (1).shim配置仅设置了代码的依赖关系，想要实际加载shim指定的或涉及的模块，仍然需要一个常规的require/define
      调用。设置shim本身不会触发代码的加载。
      (2).请仅使用其他"shim"模块作为shim脚本的依赖，或那些没有依赖关系，并且在调用define()之前定义了全局变量
      (如jQuery或lodash)的AMD库。否则，如果你使用了一个AMD模块作为一个shim配置模块的依赖，在build之后，AMD模
      块可能在shim托管代码执行之前都不会被执行，这会导致错误。终极的解决方案是将所有shim托管代码都升级为含有可
      选的AMD define()调用。
    4.map:对于给定的模块前缀，使用一个不同的模块ID来加载该模块。
        另外在map中支持“*”，意思是“对于所有的模块加载，使用本map配置”。如果还有更细化的map配置，会优先于“*”配置。
        示例：
        requirejs.config({
            map: {
                '*': {
                    'foo': 'foo1.2'
                },
                'some/oldmodule': {
                    'foo': 'foo1.0'
                }
            }
        });
        意思是除了“some/oldmodule”外的所有模块，当要用“foo”时，使用“foo1.2”来替代。对于“some/oldmodule”自己，
        则使用“foo1.0”。
    5.config:常常需要将配置信息传给一个模块。这些配置往往是application级别的信息，需要一个手段将它们向下传递
    给模块。在RequireJS中，基于requirejs.config()的config配置项来实现。要获取这些信息的模块可以加载特殊的依
    赖“module”，并调用module.config()。
    若要将config传给包，将目标设置为包的主模块而不是包ID:
    requirejs.config({
        //Pass an API key for use in the pixie package's
        //main module.
        config: {
            'pixie/index': {
                apiKey: 'XJKDLNS'
            }
        },
        //Set up config for the "pixie" package, whose main
        //module is the index.js file in the pixie folder.
        packages: [
            {
                name: 'pixie',
                main: 'index'
            }
        ]
    });