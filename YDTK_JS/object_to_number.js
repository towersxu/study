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
