var obj = {
  foo: function(){
    console.log('aaa')
  }
}

var obj1 = Object.create(obj)
obj1.foo() // aaa
obj.foo = function(){
  console.log('bbb')
}
obj1.foo() // bbb
obj1.foo = function(){
  console.log('ccc')
}
obj.foo() // bbb

console.log(obj1.__proto__ === obj) // true

if (!Object.create) {
  Object.create = function (o) {
    function F(){}
    F.prototype = o
    return new F()
  }
}
// var b = Object.create(objec)
