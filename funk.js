funk = window.funk || {};

funk.args = function(as) {
    return Array.prototype.slice.apply(as);
}

// TODO: ECMAScript 5 bind

funk.method = function(obj, m) {
    if (typeof m != 'function') {
        m = obj[m];
    }

    return function() {
        return m.apply(obj, arguments);
    };
}

funk.and = function() {
    var args = funk.args(arguments);

    return function() {
        for (var i = 0; i < args.length; i++) {
            if (!args[i].apply(this, arguments)) {
                return false;
            }
        }

        return true;
    };
};

funk.or = function() {
    var args = funk.args(arguments);

    return function() {
        for (var i = 0; i < args.length; i++) {
            if (args[i].apply(this, arguments)) {
                return true;
            }
        }

        return false;
    };
};

funk.seq = function() {
    var args = funk.args(arguments);

    return function() {
        for (var i = 0; i < args.length; i++) {
            args[i].apply(this, arguments);
        }
    };
};

funk.compose = function() {
    var args = funk.args(arguments).reverse(),
        topf = args.shift();

    return function() {
        var result = topf.apply(this, funk.args(arguments));
        
        for (var i = 0; i < args.length; i++) {
            result = args[i].call(this, result);
        }

        return result;
    };
};

funk.curry = function(f) {
    var args = funk.args(arguments);
    args.shift();

    return function() {
        return f.apply(this, args.concat(funk.args(arguments)));
    };
};


Function.prototype.method = function(obj) {
    return funk.method(obj, this);
};

Function.prototype.and = function() {
    return funk.and.apply(null, [this].concat(funk.args(arguments)));
};

Function.prototype.or = function() {
    return funk.or.apply(null, [this].concat(funk.args(arguments)));
};

Function.prototype.seq = function() {
    return funk.seq.apply(null, [this].concat(funk.args(arguments)));
};

Function.prototype.compose = function() {
    return funk.compose.apply(null, [this].concat(funk.args(arguments)));
};

Function.prototype.curry = function() {
    return funk.curry.apply(null, [this].concat(funk.args(arguments)));
};

