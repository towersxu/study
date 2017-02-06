
## 数组的值
- 使用delete可以删除数组的某个值 `delete a[1]`类似于`a[1] === undefined`。但是还有区别

```javascript
var a = [undefined, undefined, undefined]
var b = a.map(function(v, i){
  return i;
})
console.log(b) // [0, 1, 2]

var a1 = new Array(3)
var b1 = a1.map(function(v, i){
  return i;
})
console.log(b1) // [,,]
```

所有永远不要创建和使用空单元数组。

- arguments在ES6中被废弃了

- 使用数组工具函数将类数组转换为数组

```javascript
function a (){
  var arr = Array.prototype.slice.call(arguments)
  // array.slice();但是arguments是类数组，没有slice方法，所以用call，实现借用的目的
  var arr1 = Array.from(arguments) // ES6
}

```

- 许多数组函数用来处理字符串很方便，字符串可以通过call来借用数组的方法，但是注意，由于字符串不可变，所以无法借用数组的可变更成员函数。
可以借用的有`join`,`map`,`slice`,`concat`等

```javascript
var a = 'xutao';
var c = a.split("").reverse().join("")
// 这是对于简单字符串进行反转的方法，注意，如果包含Unicode的复杂字符串，不能这样用

var string = 'xutao'
var result = '';
var index = string.length;
while (index--) {
	result += string.charAt(index);
}
return result; // 第二种方式

```

## 数字精度

```javascript
if (!Number.EPSILON) {
  Number.EPSILON = Math.pow(2, -52)
}

```
`Number.MAX_VALUE`:最大浮点数
`Number.MIN_VALUE`:最小浮点数
`Number.MAX_SAFE_INTEGER`:最大安全整数 2^53 - 1 = 9007199254740991
`Number.MIN_SAFE_INTEGER`:最小安全整数-9007199254740991

- void运算符返回的结果是undefined,如果要将代码中的值（如表达式的返回值）设为undefined,就可以使用void.

`Number.isNaN`,`Infinity`,`Object.is()`
