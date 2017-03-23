var compose = function (f, g) {
  return function(x) {
    return f(g(x));
  }
}

var upperCase = function (str) {
  return str.toUpperCase();
}

var excliam = function (str) {
  return str + '!';
}

var shout = compose(excliam, toUpperCase);

shout('send in the clowns');

var head = function(x) {return x[0];};

var reverse = redu
