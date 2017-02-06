var a = {
  name:"xt",
  age: null,
  sex: undefined,
  say: function (){
    console.log(this.name)
  }
}

var b = JSON.parse(JSON.stringify(a))
// console.log(b) //{ name: 'xt', age: null }
// a.say()
//b.say()  // 报错

var c = Object.assign({}, a) // 浅拷贝
// console.log(c)
// c.say()


var p1 = {
  name: 'xt'
}
var p2 = {
  name: 'xx'
}
var p3 = {
  name: 'tx'
}
p1.like = p2
p2.like = p3
p3.like = p1

console.log(p3.like.name)

var p4 = Object.assign({}, p3)

console.log(p4.like.name)

p1.name = 'xxxx'

console.log(p3.like.name)
console.log(p4.like.name)
