# Funk.js #

Putting the [Funk](http://youtu.be/oEk3CFxtLRs) in functional programming.

Funk is a collection of useful combinators for the JavaScript programming
language. It's not a 'framework', it's not a new syntax. It's not even
well-documented!

But, it is occasionally useful.

## Quick Preview ##

### Powers of 2 ###

```javascript
[0, 1, 2, 3, 4].map(function(x) { return Math.pow(2, x); })
```

turns into

```javascript
[0, 1, 2, 3, 4].map(Math.pow.curry(2));
```

### Closures in for loops ###

```javascript
var fns = [];

for (var i = 0; i < 10; i++) {
    fns[i] = (function(x) { return function() { console.log(x); })(i);
}
```

turns into

```javascript
var fns = [],
    log = funk.method(console, 'log');

for (var i = 0; i < 10; i++) {
    fns[i] = log.compose(funk.const(i));
}
```
