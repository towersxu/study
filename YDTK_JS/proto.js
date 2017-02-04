function Foo(name) {
  this.name = name;
}
Foo.prototype.myName = function(){
  return this.name
}
function Bar(name, label) {
  Foo.call(this, name);
  this.label = label;
}
Object.setPrototypeOf(Bar.prototype, Foo.prototype)  // ES6写法
// Bar.prototype = Object.create(Foo.prototype) // 创建了一个新对象然后把旧对象抛弃，有轻微的性能shun'si
// Bar.prototype = Foo.prototype //  如果是这种写法，那就污染了Foo.prototype
Bar.prototype.myLabel = function(){
  return this.label;
}
var a = new Bar("a", "obj a")
console.log(a.myName())  // a
console.log(a.myLabel()) // obj a

console.log(Foo.prototype.isPrototypeOf(a)) // true
