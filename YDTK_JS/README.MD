## 多态

- 显示多态
- 相对多态

## 继承

- 寄生继承

```javascript
function Vehicle() {
  this.engines = 1;
}
function Car() {
  var car = new Vehicle()
  car.name = 'myCar'
  return car
}
var myCar = new Car()
```
这样写的好处是？显示混入模式的一种变体。主要解决了混入导致生成的对象的子对象和源对象的干扰。
可以不使用new来调用Car()，这样做得到的结果一样，但是可以避免创建并丢弃多余的对象。


##属性设置和屏蔽


##函数不是构造函数，但是当且仅当使用new时，函数调用会变成“构造函数调用”

##内置类型
`Null`,`Undefined`,`Boolean`,`Number`,`String`,`Object`,`Symbol`(符号，ES6新增)
除对象外，其他的统称为基本类型;
- 基本类型总是通过值复制的方式来赋值、传递的。
- 对象和函数则总是通过引用复制的方式来赋值，传递的。

```
typeof Symbol() === 'symbol'  // true
```

注意，关于使用typeof计算类型的BUG,[issue 178]
```
typeof null // object
```
这个是一直以来存在的BUG，以后JavaScript也很可能不会修改了。

- JavaScript变量没有类型，只有值才有

```
var a;

typeof a // undefined
typeof b // undefined,b还没有声明，但是这里确没有报错,是因为typeof内部有特殊的处理机制，这个机制是有积极意义的。
```

- 根据typeof的安全防范机制（阻止报错）来检查undeclared变量，比如某个脚本在运行的时候，如果有jquery，执行一种代码，没有执行另一种。

```javascript
if (jQuery) { // 如果全局中并没有引入jQuery，这里会包reference错误
  ···
}

if (typeof jQuery !== "undefined") { // 这才是安全的判断方式
  ...
}

if (window.jQuery) {  // 这样也是可以的，但是如果代码不止在浏览器环境中运行，那么还是使用上面的方式

}

```

- 注意：使用new String("abc")创建的是字符串"abc"的封装对象，而非基本类型值"abc";同理还有Boolean()等
```javascript
var a = new String("abc")
typeof a // "object"
```

## 注意点

- 除非万不得已，尽量不要使用Object(),Function(),RegExp()，Array()等
- 构造函数Function只是在极少数情况下有用，比如动态定义函数参数和函数体

### 安全JSON
所有安全的JSON值都可以使用`JSON.stringfy`字符串化.
`undefined`,`function`,`symbol`和包含循环引用的对象都不符合JSON结构标准，JSON.stringfy在对象中遇到`undefined`,`function`,`symbol`会将其自动忽略，数组中则会返回null（以保证单元位置不变）。对包含循环引用的对象则会出错。

```javascript
var a = {
  name:"xt",
  age: null,
  sex: undefined,
  say: function (){
    console.log(this.name)
  }
}

var b = JSON.parse(JSON.stringify(a))
console.log(b) //{ name: 'xt', age: null }
a.say()  // xt
b.say()  // 报错
```
注：`object.assign`是浅拷贝

### 对象转数字
1. 首先检查对象是否有valueOf方法，有就调用返回
2. 然后检查对象是否有toString方法，有就调用返回

注意：使用Object.create(null)参数的对象不带有valueOf和toString方法，因此无法进行强制类型转换

```javascript
var obj1 = {
  name: 'ssr'
}
console.log(Number(obj1))  // NaN
var obj = {
  name:'ss',
  valueOf: function() {
    return this.name.length
  }
}
console.log(Number(obj)) // 2
var obj12 = {
  name: 'ssr',
  toString: function() {
    return '4'
  }
}
console.log(Number(obj12)) // 4

var obj4 = Object.create(null)
console.log(Number(obj4)) // 报错
```

1. ~ -1 === true // true

### || 和 &&
||和&&运算符的返回值并不一定是布尔类型，而是两个操作数其中一个的值。

```javascript
function foo () {
  console.log(a)
}
var a = 42;

a && foo()  // 守护运算符
```

- `==`允许在相等比较重进行强制类型转换，而`===`不允许
- 不论什么情况下都不要使用 == true来进行判断
```javascript
var x = "42";
console.log(x == true) // false
console.log(x == false) // false
```
因为这里进行类型转换的时候是转成数字42，然后比较，所有为false


### 特殊的==情况
```javascript
"0" == false // true
false == 0   // true
false == ""  // true
false == []  // true
"" == 0      // true
"" == []     // true

[] == ![]    // true
```

- 注意``NaN !== NaN; +0 === -0``

```javascript
var a = 42, b;
b = (a++, a);
console.log(a); // 43
console.log(b); // 43
```
如果是b = a++这种情况b的值为42，a的值为43.是因为运算符的优先级问题。但是如果在加一个逗号运算符，那么可以将多个独立的表达式串联成语句

- 为什么多个赋值语句串联也会有效果，是因为赋值表达式会产生一个结果。

- javascript标签语句

```javascript
[] + {};  // "[object object]"
{} + [];  // 0
```
- 在第一行代码中，{}出现在+表达式中，因此它会被当做一个值来处理。而[]会被强制类型转换为"",而{}会被强制类型转换为"[object object]"
- 在第二行代码中，{}会被当做一个独立的空代码块，不会执行任何操作；然后 +[]是将空的数组显示强制类型转换为0.

```javascript
+ [] // 0
+ [11]  // 11
+ [1, 1] // 报错
```
对数组进行强制类型转换

- else if 其实并不是JavaScript自带的条件语句，而是通过JavaScript的省略{}机制自己写出来的用法。

- 不要同时访问命名参数和其对应的arguments数组单元

- 创建带有id属性的DOM元素时会创建同名的全局变量

- 字符串常量中的</script>将会被当做结束标签来处理，因此会导致错误。变通方法是"</sc" + "ript>"

- 解决长期运行的一段js导致UI界面卡死的问题。
> 将一个长期运行的“进程”分割成多个步骤或多批任务，使得其他并发“进程”有机会将自己的运算插入到事件循环队列中交替运行。

```javascript
var res = [];

// `response(..)` receives array of results from the Ajax call
function response(data) {
    // let's just do 1000 at a time
    var chunk = data.splice( 0, 1000 );

    // add onto existing `res` array
    res = res.concat(
        // make a new transformed array with all `chunk` values doubled
        chunk.map( function(val){
            return val * 2;
        } )
    );

    // anything left to process?
    if (data.length > 0) {
        // async schedule next batch
        setTimeout( function(){
            response( data );
        }, 0 );
    }
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax( "http://some.url.1", response );
ajax( "http://some.url.2", response );
```
当数据特别大的时候，我们将数据分成小块处理。使用setTimeout(..0)将这个函数插入到当前事件循环队列的结尾.

- 控制反转，回调中的控制反转是将代码的所有权交给调用回调的第三方，在此期间开发者丢失了对当前程序运行情况的控制。一旦第三放出现错误，很可能导致自己出错。

- promise.all  promise.race

- 使用Promise.resolve将所有的函数返回值（不管是不是thenable）都封装一层。将函数调用规范为定义良好的异步任务，并且保证总是返回Promise结果就能避免Zalgo。

```javascript
function foo (x) {
  return x*2
}
Promise.resolve(foo(2)).then(function(res){
  console.log(res) // 4
})

function foo1 (x) {
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve(x*3)
    }, 2000)
  })
}
Promise.resolve(foo1(2)).then(function(res){
  console.log(res) // 6
})

```

- promise链中的错误很容易被无意中默默忽略掉。

### 生成器（generator）

```javascript
function *foo() {
  var y = x * (yield "hello");
  return y;
}

var it = foo(6);
var res = it.next(); // 启动生成器，第一个next不需要传任何东西
res.value;  // "hello"

res = it.next(7);
res.value; // 42
```

- `yield ..`和`next(..)`这一对组合起来，在生成器的执行过程中构成了一个双向消息传递系统。
- 在生成器的起始处调用第一个next()时，还没有暂停的yield来接收这样一个值。如果第一个next()传递了值会被丢弃，所以第一个next不要传参数。
- 没有return
- `yield`委托的主要目的是代码组织，以达到与普通函数调用的对称。

```javascript
function *foo() {
  console.log("insert *foo()1:"); // 5)
  var b = yield "B"
  console.log(b) // 7) 2
  console.log("insert *foo()2:"); //8)
  var c = yield "C"
  console.log(c) // 10)3
  return "D"
}

function *bar() {
  console.log("inside *bar()1"); // 1)
  var c = yield "A"
  console.log(c) // 3) 1
  console.log("inside *bar()2"); // 4)
  var d = yield *foo()
  console.log(d) // 11) d
  console.log("inside *bar()3"); // 12)
  var e = yield "E"
  console.log(e) // 14)4
  return "F"
}
var it = bar()
var res = it.next()
console.log(res) // 2)a
res = it.next(1)
console.log(res) // 6)b
res = it.next(2)
console.log(res) // 9)c
res = it.next(3)
console.log(res) // 13)3
res = it.next(4)
console.log(res) // 15)f

```
