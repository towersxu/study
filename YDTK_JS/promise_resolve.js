function foo (x) {
  return x*2
}
Promise.resolve(foo(2)).then(function(res){
  console.log(res) // 4
})

function foo1 (x) {
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve(x*3)
    }, 2000)
  })
}
Promise.resolve(foo1(2)).then(function(res){
  console.log(res) // 6
})
