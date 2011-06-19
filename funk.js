funk = window.funk || {};

funk.id = function(x) {
    return x;
};

funk.const = function(x) {
    return function() {
        return x;
    };
};

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
    var that = this,
        args = funk.args(arguments);

    return function() {
        return that.apply(this, args.concat(funk.args(arguments)));
    };
};

Function.prototype.on = function(f) {
    var that = this;

    return function() {
        var args = funk.args(arguments);
        return that.apply(this, args.map(f));
    };
};

