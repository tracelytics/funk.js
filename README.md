# Funk.js #

Putting the Funk in functional programming.

Funk is a collection of useful combinators for the JavaScript programming language.

## Quick Preview ##

### Powers of 2 ###

```javascript
[0, 1, 2, 3, 4].map(function(x) { return Math.pow(2, x); })
```

turns into

```javascript
[0, 1, 2, 3, 4].map(Math.pow.curry(2));
```
