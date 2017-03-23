var curry = require('lodash').curry;

var match = curry(function(what, str){
  return str.match(what);
});

var replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement);
})

var replaceSpace = replace(/\s+/g);

var str = 'hello  world,I love you.';

var res = replaceSpace('-', str);
console.log(res); // hello-world,I-love-you

var replacePunc = replace(/\.|\,/g);

var res1 = replacePunc('!', str);
console.log(res1); // hello world!I love you!

var hasSpace = match(/\s+/g);

var filter = curry(function(f, arr){
  return arr.filter(f)
})

var filterSpace = filter(hasSpace, ['nihao', 'ni hao']);
console.log(filterSpace);

var res3 = String.prototype.match.call(str, /\s+/g);
console.log(res3);

var arr = ['nihao','ni hao'];
var res4 = arr.filter(function(str){
  return str.match(/\s+/g)
})
console.log(res4);

function filterArrayByReg(array, reg) {
  return array.filter(function(str) {
    return str.match(reg);
  })
}

var array = ['xutao', 'duxx', 'huhb', 'jinzk', 'xiefl']
var getNameHasX = filterArrayByReg(array, 'x');
console.log(getNameHasX);


var map = curry(function(f, arr) {
  return arr.map(f);
})

var mapNameHasX = map(function(str){
  return str.replace('x', 'y');
});

var xNames = mapNameHasX(array);
console.log(xNames);
