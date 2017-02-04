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
除对象外，其他的统称为基本类型

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

```
if (jQuery) { // 如果全局中并没有引入jQuery，这里会包reference错误
  ···
}

if (typeof jQuery !== "undefined") { // 这才是安全的判断方式
  ...
}

if (window.jQuery) {  // 这样也是可以的，但是如果代码不止在浏览器环境中运行，那么还是使用上面的方式

}

```
