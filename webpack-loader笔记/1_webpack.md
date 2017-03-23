#webpack
> webpack是一个模块打包器，它的主要目的是把开发者JavaScript文件打包成浏览器可用的JavaScript文件。它也支持把资源转译，打包。

- 支持ES模块，CMD，AMD等方式甚至混合使用的方式。
- 能打包成一个文件或者多个文件异步加载。
- 编译的过程中自动解决依赖问题，减少运行文件大小。
- 能够在编译的过程中预处理文件（例如将typescript转换为JavaScript）
- 高度模块化的插件系统

## CommonsChunkPlugin
将项目中引用的第三方库单独打包，使更新的时候缓存这些第三方包

## 代码分割-css

### css-loader

在JavaScript中使用模块导入的方式引入css
```JavaScript
import 'bootstrap/dist/css/bootstrap.css'
```

配置方法
```JavaScript
// webpack.config.js

module.exports = {
  module: {
    rules: [{
      test: /\.css$/,
      use: 'css-loader'
    }]
  }
}
```
上面这种写法有一个缺点，那就是不能再使用浏览器加载css的方式加载css了，css是跟随着整个JavaScript文件一起加载,然后再渲染。

### ExtractTextWebpackPlugin
在项目被打包成多个文件的时候，也同时将css资源打包到对应的文件，而不是全部一起打包。解决上面说到的问题。

## 代码分割-第三方库
由于第三方库代码几乎不会改变，而开发的业务代码常常改变，所以每次业务代码改变后打包同时也打包第三方库的代码效率太低。

### CommonsChunkPlugin
使用CommonsChunkPlugin将第三方库单独打包
```JavaScript
plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor' // Specify the common bundle's name.
    })
]
```

可以通过具体配置，只让某个目录下的第三方库单独打包。
```JavaScript
new webpack.optimize.CommonsChunkPlugin({
   name: 'vendor',
   minChunks: function (module) {
      // this assumes your vendor imports exist in the node_modules directory
      return module.context && module.context.indexOf('node_modules') !== -1;
   }
})
```

### mainfest缓存第三方库
由于每次打包，第三方库的会被打包成一个新的js文件，也就是[chunkhash]不同，为了解决这个问题，需要使用一个额外的mainfest文件，就算是新建了另外一个文件，仍然可以通过mainfest来实现缓存。

```JavaScript
new webpack.optimize.CommonsChunkPlugin({
  names: ['vendor', 'mainfest']
})
```

## import()和require.ensure
import() ES方式的文件拆分
require.ensure CMD方式的文件拆分


### 使用babel处理import()
```shell
npm install --save-dev babel-core babel-loader babel-plugin-syntax-dynamic-import babel-preset-es2015
```

注意babel-loader需要使用插件syntax-dynamic-import
```JavaScript
module.exports = {
  entry: './index-es2015.js',
  output: {
    filename: 'dist.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [['es2015', {modules: false}]],
          plugins: ['syntax-dynamic-import']
        }
      }]
    }]
  }
};
```

### 使用babel和async/await

```shell
npm install --save-dev babel-plugin-transform-async-to-generator babel-plugin-transform-regenerator babel-plugin-transform-runtime
```

```JavaScript
module.exports = {
  entry: './index-es2017.js',
  output: {
    filename: 'dist.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [['es2015', {modules: false}]],
          plugins: [
            'syntax-dynamic-import',
            'transform-async-to-generator',
            'transform-regenerator',
            'transform-runtime'
          ]
        }
      }]
    }]
  }
};
```

### 使用require.ensure()

```JavaScript
require('./a');
setTimeout(function(){
  require.ensure(['./b'], function(require){
      require('./c');
      console.log('done!');
  });  
}, 3000)
```
上面的demo中a和当前js打包成一个js.b和c打包成另一个js。3秒后加载另一个js,但是只执行c中的内容，b并不会执行。

## 编译成production的代码。

### UglifyJS
命令行的形式
```shell
webpack --optimize-minimize --define process.env.NODE_ENV="'production'"
```

config配置形式,同时设置sourceMap和运行环境
```JavaScript
// webpack.config.js

plugins: [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
  })
]
```
注意：通过DefinePlugin设置process.env.NODE_ENV,在运行的时候会把代码中的process.env.NODE_ENV替换为`production`,所以在代码中写`if(process.env.NODE_ENV !== 'production') console.log('...')`时，会被DefinePlugin变成`if(false) console.log('...')`,最后在UglifyJS压缩的时候被移除。

## chunkhash
在输出代码时，使用chunkhash可以将每次打包代码没有变化的打包成相同的文件。注意，不要在开发模式中使用[chunkhash],在开发模式中直接使用[name].js,在生产模式中使用[name].[chunkhash].js
```JavaScript
module.exports = {
  output: {
    filename: "[name][chunkhash].js"
  }
}
```

## 在文件打包后生成mainfest.JSON

```JavaScript
// webpack.config.js
const path = require("path");

module.exports = {
  /*...*/
  plugins: [
    function() {
      this.plugin("done", function(stats) {
        require("fs").writeFileSync(
          path.join(__dirname, "build", "stats.json"),
          JSON.stringify(stats.toJson()));
      });
    }
  ]
};
```
也可以使用[`webpack-manifest-plugin`](https://www.npmjs.com/package/webpack-manifest-plugin)插件

使用chunk-manifest-webpack-plugin生成manifest.json
```JavaScript
module.exports = {
  entry: './app/entry.js',
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"], // vendor libs + extracted manifest
      minChunks: Infinity,
    }),
    new ChunkManifestPlugin({
      filename: "manifest.json",
      manifestVariable: "webpackManifest"
    })
  ]
};

```

最终生成只有代码发生改变才重新生成文件名的manifest写法为：
```JavaScript
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
var WebpackChunkHash = require("webpack-chunk-hash");
var webpack = require('webpack');

module.exports = {
  entry: './app/entry.js',
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"], // vendor libs + extracted manifest
      minChunks: Infinity,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new ChunkManifestPlugin({
      filename: "manifest.json",
      manifestVariable: "webpackManifest"
    })
  ]
};

```

## imports-loader
在引起某些全局模块的时候，有的模块依赖this指向window对象，这会导致this在CommonJS环境中被运行成module.exports.这种情况可以使用`imports-loader`解决问题。

```JavaScript
module.exports = {
  module: {
    rules: [{
      test: require.resolve("some-module"),
      use: 'imports-loader?this=>window'
    }]
  }
};
```

## exports-loader
在CommonJS环境中运行的时候暴露某些全局变量给其访问。
```JavaScript
module.exports = {
  module: {
    rules: [{
      test: require.resolve("some-module"),
      use: 'exports-loader?file,parse=helpers.parse'
      // adds below code the file's source:
      //  exports["file"] = file;
      //  exports["parse"] = helpers.parse;
    }]
  }
};
```

## script-loader

## noParse
不解析某些模块以提高运行速度。
```JavaScript
module.exports = {
  module: {
    noParse: /jquery|backbone/
  }
};
```

## output

### output.library和output.libraryTarget
当写的库需要导出值给其他库使用的时候需要用到这个配置。

```JavaScript
library: "MyLibrary"
```

- libraryTarget: 'var' [默认]直接返回赋值给变量
```JavaScript
var MyLibrary = _entry_return_;

// your users will use your library like:
MyLibrary.doSomething();
```

- libraryTarget: "this" 当库被加载后，返回的值直接赋值给this
```JavaScript
this["MyLibrary"] = _entry_return_;

// your users will use your library like:
this.MyLibrary.doSomething();
MyLibrary.doSomething(); //if this is window
```

- libraryTarget: "window"

```JavaScript
window["MyLibrary"] = _entry_return_;

//your users will use your library like:
window.MyLibrary.doSomething();
```

- libraryTarget: "global"

- libraryTarget: "commonjs"
```JavaScript
exports["MyLibrary"] = _entry_return_;

//your users will use your library like:
require("MyLibrary").doSomething();
```

- libraryTarget: "commonjs2"
```JavaScript
module.exports = _entry_return_;

//your users will use your library like:
require("MyLibrary").doSomething();
```

- libraryTarget: "amd"

- libraryTarget: "umd" ** * **

```JavaScript
output: {
    library: "MyLibrary",
    libraryTarget: "umd"
}
```
输出的结果是：

```JavaScript
(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define("MyLibrary", [], factory);
    else if(typeof exports === 'object')
        exports["MyLibrary"] = factory();
    else
        root["MyLibrary"] = factory();
})(this, function() {
    //what this module returns is what your entry chunk returns
});
```


### output.path
文件输出目录，是绝对地址

### output.pathinfo ** * **
`boolean`
默认是`false`,告诉webpack在打包后的文件中包含注释信息。在生产环节应该设置为`true`

### output.publicPath ** * **
这是一个非常重要的配置,用于设置加载资源的文件路径。例如图片，js文件等。既可以是相对路径也可以是url地址。

```JavaScript
publicPath: "https://cdn.example.com/assets/", // CDN (always HTTPS)
publicPath: "//cdn.example.com/assets/", // CDN (same protocol)
publicPath: "/assets/", // server-relative
publicPath: "assets/", // relative to HTML page
publicPath: "../assets/", // relative to HTML page
publicPath: "", // relative to HTML page (same directory)
```

##module

### module.noParse
``noParse: /jquery|lodash/``


### module.rules

- 条件(conditions)
1) 资源的绝对路径
2）???

## resolve

### resolve.alias

| alias: | import "xyz" | import "xyz/files.js" |
|--------|--------------|-----------------------|
| {} | /abc/node_modules/xyz/index.js | /abc/node_modules/xyz/file.js |
|{ xyz: "/abs/path/to/file.js" }|/abs/path/to/file.js|error|
|{ xyz$: "/abs/path/to/file.js" }|/abs/path/to/file.js|/abc/node_modules/xyz/file.js|
|{ xyz: "./dir/file.js" }|/abc/dir/file.js|error|
|{ xyz$: "./dir/file.js" }|/abc/dir/file.js|/abc/node_modules/xyz/file.js|
|{ xyz: "/some/dir" }|/some/dir/index.js|/some/dir/file.js|
|{ xyz$: "/some/dir" }|/some/dir/index.js|/abc/node_modules/xyz/file.js|
|{ xyz: "./dir" }|/abc/dir/index.js|/abc/dir/file.js|
|{ xyz: "modu" }|/abc/node_modules/modu/index.js|/abc/node_modules/modu/file.js|
|{ xyz$: "modu" }|/abc/node_modules/modu/index.js|/abc/node_modules/xyz/file.js|
|{ xyz: "xyz/dir" }|/abc/node_modules/xyz/dir/index.js|/abc/node_modules/xyz/dir/file.js|
|{ xyz$: "xyz/dir" }|/abc/node_modules/xyz/dir/index.js|/abc/node_modules/xyz/file.js|

### resolve.extensions
自动寻找包含这些后缀的文件。默认`extensions: ['.js', 'json']`，那么在代码中可以写成`import File from '../path/to/file'`
