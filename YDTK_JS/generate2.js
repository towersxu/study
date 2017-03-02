function *foo() {
  console.log("insert *foo()1:"); // 5
  var b = yield "B"
  console.log(b) // 7) 2
  console.log("insert *foo()2:"); //8
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
