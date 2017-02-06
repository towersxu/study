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
