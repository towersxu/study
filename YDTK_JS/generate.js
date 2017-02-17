var it = main()
function foo(x,y) {
  setTimeout(() => {
    it.next({
      name: 'xxx'
    })
  }, 3000)
}
function *main() {
  var res = yield foo(11, 31);
  console.log(res)
}
it.next()
