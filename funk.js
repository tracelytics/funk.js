funk = window.funk || {};

funk.id = function(x) {
    return x;
};

funk.constant = function(x) {
    return function() {
        return x;
    };
};

funk.args = function(args) {
    return Array.prototype.slice.call(args);
}

funk.ap = function() {
    var args = funk.args(arguments);

    return function(f) {
       return f.apply(this, args);
    };
};

funk.bind = function(f, obj) {
    var args = funk.args(arguments).slice(2);

    return funk.method(obj, f).curry(args);
}

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
        var result;

        for (var i = 0; i < args.length; i++) {
            if (!(result = args[i].apply(this, arguments))) {
                return false;
            }
        }

        return result;
    };
};

funk.or = function() {
    var args = funk.args(arguments);

    return function() {
        var result;

        for (var i = 0; i < args.length; i++) {
            if (result = args[i].apply(this, arguments)) {
                return result;
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

funk.kompose = function() {
    var args = funk.args(arguments).reverse(),
        topf = args.shift();

    return function() {
        var result = topf.apply(this, funk.args(arguments));

        for (var i = 0; i < args.length; i++) {
            result = args[i].apply(this, result);
        }

        return result;
    };
};

if (typeof Function.prototype.bind == "undefined") {
    Function.prototype.bind = function() {
        return funk.bind.apply(null, [this].concat(funk.args(arguments)));
    }
}

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

Function.prototype.kompose = function() {
    return funk.kompose.apply(null, [this].concat(funk.args(arguments)));
};

Function.prototype.curry = function() {
    var that = this,
        args = funk.args(arguments);

    return function() {
        return that.apply(this, args.concat(funk.args(arguments)));
    };
};

Function.prototype.permute = function() {
    var that = this,
        perm = funk.args(arguments);

    return function() {
        var args = funk.args(arguments),
            last = args[perm[perm.length - 1]],
            temp;

        for (var i = 0; i < perm.length; i++) {
            temp = args[perm[i]];
            args[perm[i]] = last;
            last = temp;
        }

        return that.apply(this, args);
    };
};

Function.prototype.swap = function(fm, to) {
    return this.permute(fm, to);
};

Function.prototype.flip = function() {
    return this.swap(0, 1);
};

Function.prototype.reverse = function() {
    var that = this,
        args = funk.args(arguments).reverse();

    return function() {
        return that.apply(this, args);
    };
};

Function.prototype.on = function(f) {
    var that = this;

    return function() {
        var args = funk.args(arguments);
        return that.apply(this, args.map(f));
    };
};

