function *bar() {
  console.log("inside *bar()", yield "A")
  console.log("inside *bar2()", yield *['b', 'c', 'd'])
  return 'F'
}
var it = bar()
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
