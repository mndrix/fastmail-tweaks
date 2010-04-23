var MooTools = {
    version: "1.2.4",
    build: "0d9113241a90b9cd5643b926795852a2026710d4"
};
var Native = function (k) {
    k = k || {};
    var a = k.name;
    var i = k.legacy;
    var b = k.protect;
    var c = k.implement;
    var h = k.generics;
    var f = k.initialize;
    var g = k.afterImplement ||
    function () {};
    var d = f || i;
    h = h !== false;
    d.constructor = Native;
    d.$family = {
        name: "native"
    };
    if (i && f) {
        d.prototype = i.prototype;
    }
    d.prototype.constructor = d;
    if (a) {
        var e = a.toLowerCase();
        d.prototype.$family = {
            name: e
        };
        Native.typize(d, e);
    }
    var j = function (n, l, o, m) {
        if (!b || m || !n.prototype[l]) {
            n.prototype[l] = o;
        }
        if (h) {
            Native.genericize(n, l, b);
        }
        g.call(n, l, o);
        return n;
    };
    d.alias = function (n, l, p) {
        if (typeof n == "string") {
            var o = this.prototype[n];
            if ((n = o)) {
                return j(this, l, n, p);
            }
        }
        for (var m in n) {
            this.alias(m, n[m], l);
        }
        return this;
    };
    d.implement = function (m, l, o) {
        if (typeof m == "string") {
            return j(this, m, l, o);
        }
        for (var n in m) {
            j(this, n, m[n], l);
        }
        return this;
    };
    if (c) {
        d.implement(c);
    }
    return d;
};
Native.genericize = function (b, c, a) {
    if ((!a || !b[c]) && typeof b.prototype[c] == "function") {
        b[c] = function () {
            var d = Array.prototype.slice.call(arguments);
            return b.prototype[c].apply(d.shift(), d);
        };
    }
};
Native.implement = function (d, c) {
    for (var b = 0, a = d.length; b < a; b++) {
        d[b].implement(c);
    }
};
Native.typize = function (a, b) {
    if (!a.type) {
        a.type = function (c) {
            return ($type(c) === b);
        };
    }
};
(function () {
    var a = {
        Array: Array,
        Date: Date,
        Function: Function,
        Number: Number,
        RegExp: RegExp,
        String: String
    };
    for (var h in a) {
        new Native({
            name: h,
            initialize: a[h],
            protect: true
        });
    }
    var d = {
        "boolean": Boolean,
        "native": Native,
        object: Object
    };
    for (var c in d) {
        Native.typize(d[c], c);
    }
    var f = {
        Array: ["concat", "indexOf", "join", "lastIndexOf", "pop", "push", "reverse", "shift", "slice", "sort", "splice", "toString", "unshift", "valueOf"],
        String: ["charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "match", "replace", "search", "slice", "split", "substr", "substring", "toLowerCase", "toUpperCase", "valueOf"]
    };
    for (var e in f) {
        for (var b = f[e].length; b--;) {
            Native.genericize(a[e], f[e][b], true);
        }
    }
})();
var Hash = new Native({
    name: "Hash",
    initialize: function (a) {
        if ($type(a) == "hash") {
            a = $unlink(a.getClean());
        }
        for (var b in a) {
            this[b] = a[b];
        }
        return this;
    }
});
Hash.implement({
    forEach: function (b, c) {
        for (var a in this) {
            if (this.hasOwnProperty(a)) {
                b.call(c, this[a], a, this);
            }
        }
    },
    getClean: function () {
        var b = {};
        for (var a in this) {
            if (this.hasOwnProperty(a)) {
                b[a] = this[a];
            }
        }
        return b;
    },
    getLength: function () {
        var b = 0;
        for (var a in this) {
            if (this.hasOwnProperty(a)) {
                b++;
            }
        }
        return b;
    }
});
Hash.alias("forEach", "each");
Array.implement({
    forEach: function (c, d) {
        for (var b = 0, a = this.length; b < a; b++) {
            c.call(d, this[b], b, this);
        }
    }
});
Array.alias("forEach", "each");

function $A(b) {
    if (b.item) {
        var a = b.length,
            c = new Array(a);
        while (a--) {
                c[a] = b[a];
            }
        return c;
    }
    return Array.prototype.slice.call(b);
}
function $arguments(a) {
    return function () {
        return arguments[a];
    };
}
function $chk(a) {
    return !!(a || a === 0);
}
function $clear(a) {
    clearTimeout(a);
    clearInterval(a);
    return null;
}
function $defined(a) {
    return (a != undefined);
}
function $each(c, b, d) {
    var a = $type(c);
    ((a == "arguments" || a == "collection" || a == "array") ? Array : Hash).each(c, b, d);
}
function $empty() {}
function $extend(c, a) {
    for (var b in (a || {})) {
        c[b] = a[b];
    }
    return c;
}
function $H(a) {
    return new Hash(a);
}
function $lambda(a) {
    return ($type(a) == "function") ? a : function () {
        return a;
    };
}
function $merge() {
    var a = Array.slice(arguments);
    a.unshift({});
    return $mixin.apply(null, a);
}
function $mixin(e) {
    for (var d = 1, a = arguments.length; d < a; d++) {
        var b = arguments[d];
        if ($type(b) != "object") {
            continue;
        }
        for (var c in b) {
            var g = b[c],
                f = e[c];
            e[c] = (f && $type(g) == "object" && $type(f) == "object") ? $mixin(f, g) : $unlink(g);
        }
    }
    return e;
}
function $pick() {
    for (var b = 0, a = arguments.length; b < a; b++) {
        if (arguments[b] != undefined) {
            return arguments[b];
        }
    }
    return null;
}
function $random(b, a) {
    return Math.floor(Math.random() * (a - b + 1) + b);
}
function $splat(b) {
    var a = $type(b);
    return (a) ? ((a != "array" && a != "arguments") ? [b] : b) : [];
}
var $time = Date.now ||
function () {
    return +new Date;
};

function $try() {
    for (var b = 0, a = arguments.length; b < a; b++) {
        try {
            return arguments[b]();
        } catch (c) {}
    }
    return null;
}
function $type(a) {
    if (a == undefined) {
        return false;
    }
    if (a.$family) {
        return (a.$family.name == "number" && !isFinite(a)) ? false : a.$family.name;
    }
    if (a.nodeName) {
        switch (a.nodeType) {
        case 1:
            return "element";
        case 3:
            return (/\S/).test(a.nodeValue) ? "textnode" : "whitespace";
        }
    } else {
        if (typeof a.length == "number") {
            if (a.callee) {
                return "arguments";
            } else {
                if (a.item) {
                    return "collection";
                }
            }
        }
    }
    return typeof a;
}
function $unlink(c) {
    var b;
    switch ($type(c)) {
    case "object":
        b = {};
        for (var e in c) {
            b[e] = $unlink(c[e]);
        }
        break;
    case "hash":
        b = new Hash(c);
        break;
    case "array":
        b = [];
        for (var d = 0, a = c.length; d < a; d++) {
            b[d] = $unlink(c[d]);
        }
        break;
    default:
        return c;
    }
    return b;
}
var Browser = $merge({
    Engine: {
        name: "unknown",
        version: 0
    },
    Platform: {
        name: (window.orientation != undefined) ? "ipod" : (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase()
    },
    Features: {
        xpath: !! (document.evaluate),
        air: !! (window.runtime),
        query: !! (document.querySelector)
    },
    Plugins: {},
    Engines: {
        presto: function () {
            return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925));
        },
        trident: function () {
            return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? ((document.querySelectorAll) ? 6 : 5) : 4);
        },
        webkit: function () {
            return (navigator.taintEnabled) ? false : ((Browser.Features.xpath) ? ((Browser.Features.query) ? 525 : 420) : 419);
        },
        gecko: function () {
            return (!document.getBoxObjectFor && window.mozInnerScreenX == null) ? false : ((document.getElementsByClassName) ? 19 : 18);
        }
    }
}, Browser || {});
Browser.Platform[Browser.Platform.name] = true;
Browser.detect = function () {
    for (var b in this.Engines) {
        var a = this.Engines[b]();
        if (a) {
            this.Engine = {
                name: b,
                version: a
            };
            this.Engine[b] = this.Engine[b + a] = true;
            break;
        }
    }
    return {
        name: b,
        version: a
    };
};
Browser.detect();
Browser.Request = function () {
    return $try(function () {
        return new XMLHttpRequest();
    }, function () {
        return new ActiveXObject("MSXML2.XMLHTTP");
    }, function () {
        return new ActiveXObject("Microsoft.XMLHTTP");
    });
};
Browser.Features.xhr = !! (Browser.Request());
Browser.Plugins.Flash = (function () {
    var a = ($try(function () {
        return navigator.plugins["Shockwave Flash"].description;
    }, function () {
        return new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version");
    }) || "0 r0").match(/\d+/g);
    return {
        version: parseInt(a[0] || 0 + "." + a[1], 10) || 0,
        build: parseInt(a[2], 10) || 0
    };
})();

function $exec(b) {
    if (!b) {
        return b;
    }
    if (window.execScript) {
        window.execScript(b);
    } else {
        var a = document.createElement("script");
        a.setAttribute("type", "text/javascript");
        a[(Browser.Engine.webkit && Browser.Engine.version < 420) ? "innerText" : "text"] = b;
        document.head.appendChild(a);
        document.head.removeChild(a);
    }
    return b;
}
Native.UID = 1;
var $uid = (Browser.Engine.trident) ?
function (a) {
    return (a.uid || (a.uid = [Native.UID++]))[0];
} : function (a) {
    return a.uid || (a.uid = Native.UID++);
};
var Window = new Native({
    name: "Window",
    legacy: (Browser.Engine.trident) ? null : window.Window,
    initialize: function (a) {
        $uid(a);
        if (!a.Element) {
            a.Element = $empty;
            if (Browser.Engine.webkit) {
                a.document.createElement("iframe");
            }
            a.Element.prototype = (Browser.Engine.webkit) ? window["[[DOMElement.prototype]]"] : {};
        }
        a.document.window = a;
        return $extend(a, Window.Prototype);
    },
    afterImplement: function (b, a) {
        window[b] = Window.Prototype[b] = a;
    }
});
Window.Prototype = {
    $family: {
        name: "window"
    }
};
new Window(window);
var Document = new Native({
    name: "Document",
    legacy: (Browser.Engine.trident) ? null : window.Document,
    initialize: function (a) {
        $uid(a);
        a.head = a.getElementsByTagName("head")[0];
        a.html = a.getElementsByTagName("html")[0];
        if (Browser.Engine.trident && Browser.Engine.version <= 4) {
            $try(function () {
                a.execCommand("BackgroundImageCache", false, true);
            });
        }
        if (Browser.Engine.trident) {
            a.window.attachEvent("onunload", function () {
                a.window.detachEvent("onunload", arguments.callee);
                a.head = a.html = a.window = null;
            });
        }
        return $extend(a, Document.Prototype);
    },
    afterImplement: function (b, a) {
        document[b] = Document.Prototype[b] = a;
    }
});
Document.Prototype = {
    $family: {
        name: "document"
    }
};
new Document(document);
Array.implement({
    every: function (c, d) {
        for (var b = 0, a = this.length; b < a; b++) {
            if (!c.call(d, this[b], b, this)) {
                return false;
            }
        }
        return true;
    },
    filter: function (d, e) {
        var c = [];
        for (var b = 0, a = this.length; b < a; b++) {
            if (d.call(e, this[b], b, this)) {
                c.push(this[b]);
            }
        }
        return c;
    },
    clean: function () {
        return this.filter($defined);
    },
    indexOf: function (c, d) {
        var a = this.length;
        for (var b = (d < 0) ? Math.max(0, a + d) : d || 0; b < a; b++) {
            if (this[b] === c) {
                return b;
            }
        }
        return -1;
    },
    map: function (d, e) {
        var c = [];
        for (var b = 0, a = this.length; b < a; b++) {
            c[b] = d.call(e, this[b], b, this);
        }
        return c;
    },
    some: function (c, d) {
        for (var b = 0, a = this.length; b < a; b++) {
            if (c.call(d, this[b], b, this)) {
                return true;
            }
        }
        return false;
    },
    associate: function (c) {
        var d = {},
            b = Math.min(this.length, c.length);
        for (var a = 0; a < b; a++) {
                d[c[a]] = this[a];
            }
        return d;
    },
    link: function (c) {
        var a = {};
        for (var e = 0, b = this.length; e < b; e++) {
            for (var d in c) {
                if (c[d](this[e])) {
                    a[d] = this[e];
                    delete c[d];
                    break;
                }
            }
        }
        return a;
    },
    contains: function (a, b) {
        return this.indexOf(a, b) != -1;
    },
    extend: function (c) {
        for (var b = 0, a = c.length; b < a; b++) {
            this.push(c[b]);
        }
        return this;
    },
    getLast: function () {
        return (this.length) ? this[this.length - 1] : null;
    },
    getRandom: function () {
        return (this.length) ? this[$random(0, this.length - 1)] : null;
    },
    include: function (a) {
        if (!this.contains(a)) {
            this.push(a);
        }
        return this;
    },
    combine: function (c) {
        for (var b = 0, a = c.length; b < a; b++) {
            this.include(c[b]);
        }
        return this;
    },
    erase: function (b) {
        for (var a = this.length; a--; a) {
            if (this[a] === b) {
                this.splice(a, 1);
            }
        }
        return this;
    },
    empty: function () {
        this.length = 0;
        return this;
    },
    flatten: function () {
        var d = [];
        for (var b = 0, a = this.length; b < a; b++) {
            var c = $type(this[b]);
            if (!c) {
                continue;
            }
            d = d.concat((c == "array" || c == "collection" || c == "arguments") ? Array.flatten(this[b]) : this[b]);
        }
        return d;
    },
    hexToRgb: function (b) {
        if (this.length != 3) {
            return null;
        }
        var a = this.map(function (c) {
            if (c.length == 1) {
                c += c;
            }
            return c.toInt(16);
        });
        return (b) ? a : "rgb(" + a + ")";
    },
    rgbToHex: function (d) {
        if (this.length < 3) {
            return null;
        }
        if (this.length == 4 && this[3] == 0 && !d) {
            return "transparent";
        }
        var b = [];
        for (var a = 0; a < 3; a++) {
            var c = (this[a] - 0).toString(16);
            b.push((c.length == 1) ? "0" + c : c);
        }
        return (d) ? b : "#" + b.join("");
    }
});
Function.implement({
    extend: function (a) {
        for (var b in a) {
            this[b] = a[b];
        }
        return this;
    },
    create: function (b) {
        var a = this;
        b = b || {};
        return function (d) {
            var c = b.arguments;
            c = (c != undefined) ? $splat(c) : Array.slice(arguments, (b.event) ? 1 : 0);
            if (b.event) {
                c = [d || window.event].extend(c);
            }
            var e = function () {
                return a.apply(b.bind || null, c);
            };
            if (b.delay) {
                return setTimeout(e, b.delay);
            }
            if (b.periodical) {
                return setInterval(e, b.periodical);
            }
            if (b.attempt) {
                return $try(e);
            }
            return e();
        };
    },
    run: function (a, b) {
        return this.apply(b, $splat(a));
    },
    pass: function (a, b) {
        return this.create({
            bind: b,
            arguments: a
        });
    },
    bind: function (b, a) {
        return this.create({
            bind: b,
            arguments: a
        });
    },
    bindWithEvent: function (b, a) {
        return this.create({
            bind: b,
            arguments: a,
            event: true
        });
    },
    attempt: function (a, b) {
        return this.create({
            bind: b,
            arguments: a,
            attempt: true
        })();
    },
    delay: function (b, c, a) {
        return this.create({
            bind: c,
            arguments: a,
            delay: b
        })();
    },
    periodical: function (c, b, a) {
        return this.create({
            bind: b,
            arguments: a,
            periodical: c
        })();
    }
});
Number.implement({
    limit: function (b, a) {
        return Math.min(a, Math.max(b, this));
    },
    round: function (a) {
        a = Math.pow(10, a || 0);
        return Math.round(this * a) / a;
    },
    times: function (b, c) {
        for (var a = 0; a < this; a++) {
            b.call(c, a, this);
        }
    },
    toFloat: function () {
        return parseFloat(this);
    },
    toInt: function (a) {
        return parseInt(this, a || 10);
    }
});
Number.alias("times", "each");
(function (b) {
    var a = {};
    b.each(function (c) {
        if (!Number[c]) {
            a[c] = function () {
                return Math[c].apply(null, [this].concat($A(arguments)));
            };
        }
    });
    Number.implement(a);
})(["abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "exp", "floor", "log", "max", "min", "pow", "sin", "sqrt", "tan"]);
String.implement({
    test: function (a, b) {
        return ((typeof a == "string") ? new RegExp(a, b) : a).test(this);
    },
    contains: function (a, b) {
        return (b) ? (b + this + b).indexOf(b + a + b) > -1 : this.indexOf(a) > -1;
    },
    trim: function () {
        return this.replace(/^\s+|\s+$/g, "");
    },
    clean: function () {
        return this.replace(/\s+/g, " ").trim();
    },
    camelCase: function () {
        return this.replace(/-\D/g, function (a) {
            return a.charAt(1).toUpperCase();
        });
    },
    hyphenate: function () {
        return this.replace(/[A-Z]/g, function (a) {
            return ("-" + a.charAt(0).toLowerCase());
        });
    },
    capitalize: function () {
        return this.replace(/\b[a-z]/g, function (a) {
            return a.toUpperCase();
        });
    },
    escapeRegExp: function () {
        return this.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
    },
    toInt: function (a) {
        return parseInt(this, a || 10);
    },
    toFloat: function () {
        return parseFloat(this);
    },
    hexToRgb: function (b) {
        var a = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
        return (a) ? a.slice(1).hexToRgb(b) : null;
    },
    rgbToHex: function (b) {
        var a = this.match(/\d{1,3}/g);
        return (a) ? a.rgbToHex(b) : null;
    },
    stripScripts: function (b) {
        var a = "";
        var c = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function () {
            a += arguments[1] + "\n";
            return "";
        });
        if (b === true) {
            $exec(a);
        } else {
            if ($type(b) == "function") {
                b(a, c);
            }
        }
        return c;
    },
    substitute: function (a, b) {
        return this.replace(b || (/\\?\{([^{}]+)\}/g), function (d, c) {
            if (d.charAt(0) == "\\") {
                return d.slice(1);
            }
            return (a[c] != undefined) ? a[c] : "";
        });
    }
});
Hash.implement({
    has: Object.prototype.hasOwnProperty,
    keyOf: function (b) {
        for (var a in this) {
            if (this.hasOwnProperty(a) && this[a] === b) {
                return a;
            }
        }
        return null;
    },
    hasValue: function (a) {
        return (Hash.keyOf(this, a) !== null);
    },
    extend: function (a) {
        Hash.each(a || {}, function (c, b) {
            Hash.set(this, b, c);
        }, this);
        return this;
    },
    combine: function (a) {
        Hash.each(a || {}, function (c, b) {
            Hash.include(this, b, c);
        }, this);
        return this;
    },
    erase: function (a) {
        if (this.hasOwnProperty(a)) {
            delete this[a];
        }
        return this;
    },
    get: function (a) {
        return (this.hasOwnProperty(a)) ? this[a] : null;
    },
    set: function (a, b) {
        if (!this[a] || this.hasOwnProperty(a)) {
            this[a] = b;
        }
        return this;
    },
    empty: function () {
        Hash.each(this, function (b, a) {
            delete this[a];
        }, this);
        return this;
    },
    include: function (a, b) {
        if (this[a] == undefined) {
            this[a] = b;
        }
        return this;
    },
    map: function (b, c) {
        var a = new Hash;
        Hash.each(this, function (e, d) {
            a.set(d, b.call(c, e, d, this));
        }, this);
        return a;
    },
    filter: function (b, c) {
        var a = new Hash;
        Hash.each(this, function (e, d) {
            if (b.call(c, e, d, this)) {
                a.set(d, e);
            }
        }, this);
        return a;
    },
    every: function (b, c) {
        for (var a in this) {
            if (this.hasOwnProperty(a) && !b.call(c, this[a], a)) {
                return false;
            }
        }
        return true;
    },
    some: function (b, c) {
        for (var a in this) {
            if (this.hasOwnProperty(a) && b.call(c, this[a], a)) {
                return true;
            }
        }
        return false;
    },
    getKeys: function () {
        var a = [];
        Hash.each(this, function (c, b) {
            a.push(b);
        });
        return a;
    },
    getValues: function () {
        var a = [];
        Hash.each(this, function (b) {
            a.push(b);
        });
        return a;
    },
    toQueryString: function (a) {
        var b = [];
        Hash.each(this, function (f, e) {
            if (a) {
                e = a + "[" + e + "]";
            }
            var d;
            switch ($type(f)) {
            case "object":
                d = Hash.toQueryString(f, e);
                break;
            case "array":
                var c = {};
                f.each(function (h, g) {
                    c[g] = h;
                });
                d = Hash.toQueryString(c, e);
                break;
            default:
                d = e + "=" + encodeURIComponent(f);
            }
            if (f != undefined) {
                b.push(d);
            }
        });
        return b.join("&");
    }
});
Hash.alias({
    keyOf: "indexOf",
    hasValue: "contains"
});
var Event = new Native({
    name: "Event",
    initialize: function (a, f) {
        f = f || window;
        var k = f.document;
        a = a || f.event;
        if (a.$extended) {
            return a;
        }
        this.$extended = true;
        var j = a.type;
        var g = a.target || a.srcElement;
        while (g && g.nodeType == 3) {
            g = g.parentNode;
        }
        if (j.test(/key/)) {
            var b = a.which || a.keyCode;
            var m = Event.Keys.keyOf(b);
            if (j == "keydown") {
                var d = b - 111;
                if (d > 0 && d < 13) {
                    m = "f" + d;
                }
            }
            m = m || String.fromCharCode(b).toLowerCase();
        } else {
            if (j.match(/(click|mouse|menu)/i)) {
                k = (!k.compatMode || k.compatMode == "CSS1Compat") ? k.html : k.body;
                var i = {
                    x: a.pageX || a.clientX + k.scrollLeft,
                    y: a.pageY || a.clientY + k.scrollTop
                };
                var c = {
                    x: (a.pageX) ? a.pageX - f.pageXOffset : a.clientX,
                    y: (a.pageY) ? a.pageY - f.pageYOffset : a.clientY
                };
                if (j.match(/DOMMouseScroll|mousewheel/)) {
                    var h = (a.wheelDelta) ? a.wheelDelta / 120 : -(a.detail || 0) / 3;
                }
                var e = (a.which == 3) || (a.button == 2);
                var l = null;
                if (j.match(/over|out/)) {
                    switch (j) {
                    case "mouseover":
                        l = a.relatedTarget || a.fromElement;
                        break;
                    case "mouseout":
                        l = a.relatedTarget || a.toElement;
                    }
                    if (!(function () {
                        while (l && l.nodeType == 3) {
                            l = l.parentNode;
                        }
                        return true;
                    }).create({
                        attempt: Browser.Engine.gecko
                    })()) {
                        l = false;
                    }
                }
            }
        }
        return $extend(this, {
            event: a,
            type: j,
            page: i,
            client: c,
            rightClick: e,
            wheel: h,
            relatedTarget: l,
            target: g,
            code: b,
            key: m,
            shift: a.shiftKey,
            control: a.ctrlKey,
            alt: a.altKey,
            meta: a.metaKey
        });
    }
});
Event.Keys = new Hash({
    enter: 13,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    esc: 27,
    space: 32,
    backspace: 8,
    tab: 9,
    "delete": 46
});
Event.implement({
    stop: function () {
        return this.stopPropagation().preventDefault();
    },
    stopPropagation: function () {
        if (this.event.stopPropagation) {
            this.event.stopPropagation();
        } else {
            this.event.cancelBubble = true;
        }
        return this;
    },
    preventDefault: function () {
        if (this.event.preventDefault) {
            this.event.preventDefault();
        } else {
            this.event.returnValue = false;
        }
        return this;
    }
});

function Class(b) {
    if (b instanceof Function) {
        b = {
            initialize: b
        };
    }
    var a = function () {
        Object.reset(this);
        if (a._prototyping) {
            return this;
        }
        this._current = $empty;
        var c = (this.initialize) ? this.initialize.apply(this, arguments) : this;
        delete this._current;
        delete this.caller;
        return c;
    }.extend(this);
    a.implement(b);
    a.constructor = Class;
    a.prototype.constructor = a;
    return a;
}
Function.prototype.protect = function () {
    this._protected = true;
    return this;
};
Object.reset = function (a, c) {
    if (c == null) {
        for (var e in a) {
            Object.reset(a, e);
        }
        return a;
    }
    delete a[c];
    switch ($type(a[c])) {
    case "object":
        var d = function () {};
        d.prototype = a[c];
        var b = new d;
        a[c] = Object.reset(b);
        break;
    case "array":
        a[c] = $unlink(a[c]);
        break;
    }
    return a;
};
new Native({
    name: "Class",
    initialize: Class
}).extend({
    instantiate: function (b) {
        b._prototyping = true;
        var a = new b;
        delete b._prototyping;
        return a;
    },
    wrap: function (a, b, c) {
        if (c._origin) {
            c = c._origin;
        }
        return function () {
            if (c._protected && this._current == null) {
                throw new Error('The method "' + b + '" cannot be called.');
            }
            var e = this.caller,
                f = this._current;
            this.caller = f;
            this._current = arguments.callee;
            var d = c.apply(this, arguments);
            this._current = f;
            this.caller = e;
            return d;
        }.extend({
            _owner: a,
            _origin: c,
            _name: b
        });
    }
});
Class.implement({
    implement: function (a, d) {
        if ($type(a) == "object") {
            for (var e in a) {
                this.implement(e, a[e]);
            }
            return this;
        }
        var f = Class.Mutators[a];
        if (f) {
            d = f.call(this, d);
            if (d == null) {
                return this;
            }
        }
        var c = this.prototype;
        switch ($type(d)) {
        case "function":
            if (d._hidden) {
                return this;
            }
            c[a] = Class.wrap(this, a, d);
            break;
        case "object":
            var b = c[a];
            if ($type(b) == "object") {
                $mixin(b, d);
            } else {
                c[a] = $unlink(d);
            }
            break;
        case "array":
            c[a] = $unlink(d);
            break;
        default:
            c[a] = d;
        }
        return this;
    }
});
Class.Mutators = {
    Extends: function (a) {
        this.parent = a;
        this.prototype = Class.instantiate(a);
        this.implement("parent", function () {
            var b = this.caller._name,
                c = this.caller._owner.parent.prototype[b];
            if (!c) {
                    throw new Error('The method "' + b + '" has no parent.');
                }
            return c.apply(this, arguments);
        }.protect());
    },
    Implements: function (a) {
        $splat(a).each(function (b) {
            if (b instanceof Function) {
                b = Class.instantiate(b);
            }
            this.implement(b);
        }, this);
    }
};
var Chain = new Class({
    $chain: [],
    chain: function () {
        this.$chain.extend(Array.flatten(arguments));
        return this;
    },
    callChain: function () {
        return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : false;
    },
    clearChain: function () {
        this.$chain.empty();
        return this;
    }
});
var Events = new Class({
    $events: {},
    addEvent: function (c, b, a) {
        c = Events.removeOn(c);
        if (b != $empty) {
            this.$events[c] = this.$events[c] || [];
            this.$events[c].include(b);
            if (a) {
                b.internal = true;
            }
        }
        return this;
    },
    addEvents: function (a) {
        for (var b in a) {
            this.addEvent(b, a[b]);
        }
        return this;
    },
    fireEvent: function (c, b, a) {
        c = Events.removeOn(c);
        if (!this.$events || !this.$events[c]) {
            return this;
        }
        this.$events[c].each(function (d) {
            d.create({
                bind: this,
                delay: a,
                "arguments": b
            })();
        }, this);
        return this;
    },
    removeEvent: function (b, a) {
        b = Events.removeOn(b);
        if (!this.$events[b]) {
            return this;
        }
        if (!a.internal) {
            this.$events[b].erase(a);
        }
        return this;
    },
    removeEvents: function (c) {
        var d;
        if ($type(c) == "object") {
            for (d in c) {
                this.removeEvent(d, c[d]);
            }
            return this;
        }
        if (c) {
            c = Events.removeOn(c);
        }
        for (d in this.$events) {
            if (c && c != d) {
                continue;
            }
            var b = this.$events[d];
            for (var a = b.length; a--; a) {
                this.removeEvent(d, b[a]);
            }
        }
        return this;
    }
});
Events.removeOn = function (a) {
    return a.replace(/^on([A-Z])/, function (b, c) {
        return c.toLowerCase();
    });
};
var Options = new Class({
    setOptions: function () {
        this.options = $merge.run([this.options].extend(arguments));
        if (!this.addEvent) {
            return this;
        }
        for (var a in this.options) {
            if ($type(this.options[a]) != "function" || !(/^on[A-Z]/).test(a)) {
                continue;
            }
            this.addEvent(a, this.options[a]);
            delete this.options[a];
        }
        return this;
    }
});
var Element = new Native({
    name: "Element",
    legacy: window.Element,
    initialize: function (a, b) {
        var c = Element.Constructors.get(a);
        if (c) {
            return c(b);
        }
        if (typeof a == "string") {
            return document.newElement(a, b);
        }
        return document.id(a).set(b);
    },
    afterImplement: function (a, b) {
        Element.Prototype[a] = b;
        if (Array[a]) {
            return;
        }
        Elements.implement(a, function () {
            var c = [],
                g = true;
            for (var e = 0, d = this.length; e < d; e++) {
                    var f = this[e][a].apply(this[e], arguments);
                    c.push(f);
                    if (g) {
                        g = ($type(f) == "element");
                    }
                }
            return (g) ? new Elements(c) : c;
        });
    }
});
Element.Prototype = {
    $family: {
        name: "element"
    }
};
Element.Constructors = new Hash;
var IFrame = new Native({
    name: "IFrame",
    generics: false,
    initialize: function () {
        var f = Array.link(arguments, {
            properties: Object.type,
            iframe: $defined
        });
        var d = f.properties || {};
        var c = document.id(f.iframe);
        var e = d.onload || $empty;
        delete d.onload;
        d.id = d.name = $pick(d.id, d.name, c ? (c.id || c.name) : "IFrame_" + $time());
        c = new Element(c || "iframe", d);
        var b = function () {
            var g = $try(function () {
                return c.contentWindow.location.host;
            });
            if (!g || g == window.location.host) {
                var h = new Window(c.contentWindow);
                new Document(c.contentWindow.document);
                $extend(h.Element.prototype, Element.Prototype);
            }
            e.call(c.contentWindow, c.contentWindow.document);
        };
        var a = $try(function () {
            return c.contentWindow;
        });
        ((a && a.document.body) || window.frames[d.id]) ? b() : c.addListener("load", b);
        return c;
    }
});
var Elements = new Native({
    initialize: function (f, b) {
        b = $extend({
            ddup: true,
            cash: true
        }, b);
        f = f || [];
        if (b.ddup || b.cash) {
            var g = {},
                e = [];
            for (var c = 0, a = f.length; c < a; c++) {
                    var d = document.id(f[c], !b.cash);
                    if (b.ddup) {
                        if (g[d.uid]) {
                            continue;
                        }
                        g[d.uid] = true;
                    }
                    if (d) {
                        e.push(d);
                    }
                }
            f = e;
        }
        return (b.cash) ? $extend(f, this) : f;
    }
});
Elements.implement({
    filter: function (a, b) {
        if (!a) {
            return this;
        }
        return new Elements(Array.filter(this, (typeof a == "string") ?
        function (c) {
            return c.match(a);
        } : a, b));
    }
});
Document.implement({
    newElement: function (a, b) {
        if (Browser.Engine.trident && b) {
            ["name", "type", "checked"].each(function (c) {
                if (!b[c]) {
                    return;
                }
                a += " " + c + '="' + b[c] + '"';
                if (c != "checked") {
                    delete b[c];
                }
            });
            a = "<" + a + ">";
        }
        return document.id(this.createElement(a)).set(b);
    },
    newTextNode: function (a) {
        return this.createTextNode(a);
    },
    getDocument: function () {
        return this;
    },
    getWindow: function () {
        return this.window;
    },
    id: (function () {
        var a = {
            string: function (d, c, b) {
                d = b.getElementById(d);
                return (d) ? a.element(d, c) : null;
            },
            element: function (b, e) {
                $uid(b);
                if (!e && !b.$family && !(/^object|embed$/i).test(b.tagName)) {
                    var c = Element.Prototype;
                    for (var d in c) {
                        b[d] = c[d];
                    }
                }
                return b;
            },
            object: function (c, d, b) {
                if (c.toElement) {
                    return a.element(c.toElement(b), d);
                }
                return null;
            }
        };
        a.textnode = a.whitespace = a.window = a.document = $arguments(0);
        return function (c, e, d) {
            if (c && c.$family && c.uid) {
                return c;
            }
            var b = $type(c);
            return (a[b]) ? a[b](c, e, d || document) : null;
        };
    })()
});
if (window.$ == null) {
    Window.implement({
        $: function (a, b) {
            return document.id(a, b, this.document);
        }
    });
}
Window.implement({
    $$: function (a) {
        if (arguments.length == 1 && typeof a == "string") {
            return this.document.getElements(a);
        }
        var f = [];
        var c = Array.flatten(arguments);
        for (var d = 0, b = c.length; d < b; d++) {
            var e = c[d];
            switch ($type(e)) {
            case "element":
                f.push(e);
                break;
            case "string":
                f.extend(this.document.getElements(e, true));
            }
        }
        return new Elements(f);
    },
    getDocument: function () {
        return this.document;
    },
    getWindow: function () {
        return this;
    }
});
Native.implement([Element, Document], {
    getElement: function (a, b) {
        return document.id(this.getElements(a, true)[0] || null, b);
    },
    getElements: function (a, d) {
        a = a.split(",");
        var c = [];
        var b = (a.length > 1);
        a.each(function (e) {
            var f = this.getElementsByTagName(e.trim());
            (b) ? c.extend(f) : c = f;
        }, this);
        return new Elements(c, {
            ddup: b,
            cash: !d
        });
    }
});
(function () {
    var h = {},
        f = {};
    var i = {
            input: "checked",
            option: "selected",
            textarea: (Browser.Engine.webkit && Browser.Engine.version < 420) ? "innerHTML" : "value"
        };
    var c = function (l) {
            return (f[l] || (f[l] = {}));
        };
    var g = function (n, l) {
            if (!n) {
                return;
            }
            var m = n.uid;
            if (Browser.Engine.trident) {
                if (n.clearAttributes) {
                    var q = l && n.cloneNode(false);
                    n.clearAttributes();
                    if (q) {
                        n.mergeAttributes(q);
                    }
                } else {
                    if (n.removeEvents) {
                        n.removeEvents();
                    }
                }
                if ((/object/i).test(n.tagName)) {
                    for (var o in n) {
                        if (typeof n[o] == "function") {
                            n[o] = $empty;
                        }
                    }
                    Element.dispose(n);
                }
            }
            if (!m) {
                return;
            }
            h[m] = f[m] = null;
        };
    var d = function () {
            Hash.each(h, g);
            if (Browser.Engine.trident) {
                $A(document.getElementsByTagName("object")).each(g);
            }
            if (window.CollectGarbage) {
                CollectGarbage();
            }
            h = f = null;
        };
    var j = function (n, l, s, m, p, r) {
            var o = n[s || l];
            var q = [];
            while (o) {
                if (o.nodeType == 1 && (!m || Element.match(o, m))) {
                    if (!p) {
                        return document.id(o, r);
                    }
                    q.push(o);
                }
                o = o[l];
            }
            return (p) ? new Elements(q, {
                ddup: false,
                cash: !r
            }) : null;
        };
    var e = {
            html: "innerHTML",
            "class": "className",
            "for": "htmlFor",
            defaultValue: "defaultValue",
            text: (Browser.Engine.trident || (Browser.Engine.webkit && Browser.Engine.version < 420)) ? "innerText" : "textContent"
        };
    var b = ["compact", "nowrap", "ismap", "declare", "noshade", "checked", "disabled", "readonly", "multiple", "selected", "noresize", "defer"];
    var k = ["value", "type", "defaultValue", "accessKey", "cellPadding", "cellSpacing", "colSpan", "frameBorder", "maxLength", "readOnly", "rowSpan", "tabIndex", "useMap"];
    b = b.associate(b);
    Hash.extend(e, b);
    Hash.extend(e, k.associate(k.map(String.toLowerCase)));
    var a = {
            before: function (m, l) {
                if (l.parentNode) {
                    l.parentNode.insertBefore(m, l);
                }
            },
            after: function (m, l) {
                if (!l.parentNode) {
                    return;
                }
                var n = l.nextSibling;
                (n) ? l.parentNode.insertBefore(m, n) : l.parentNode.appendChild(m);
            },
            bottom: function (m, l) {
                l.appendChild(m);
            },
            top: function (m, l) {
                var n = l.firstChild;
                (n) ? l.insertBefore(m, n) : l.appendChild(m);
            }
        };
    a.inside = a.bottom;
    Hash.each(a, function (l, m) {
            m = m.capitalize();
            Element.implement("inject" + m, function (n) {
                l(this, document.id(n, true));
                return this;
            });
            Element.implement("grab" + m, function (n) {
                l(document.id(n, true), this);
                return this;
            });
        });
    Element.implement({
            set: function (o, m) {
                switch ($type(o)) {
                case "object":
                    for (var n in o) {
                        this.set(n, o[n]);
                    }
                    break;
                case "string":
                    var l = Element.Properties.get(o);
                    (l && l.set) ? l.set.apply(this, Array.slice(arguments, 1)) : this.setProperty(o, m);
                }
                return this;
            },
            get: function (m) {
                var l = Element.Properties.get(m);
                return (l && l.get) ? l.get.apply(this, Array.slice(arguments, 1)) : this.getProperty(m);
            },
            erase: function (m) {
                var l = Element.Properties.get(m);
                (l && l.erase) ? l.erase.apply(this) : this.removeProperty(m);
                return this;
            },
            setProperty: function (m, n) {
                var l = e[m];
                if (n == undefined) {
                    return this.removeProperty(m);
                }
                if (l && b[m]) {
                    n = !! n;
                }(l) ? this[l] = n : this.setAttribute(m, "" + n);
                return this;
            },
            setProperties: function (l) {
                for (var m in l) {
                    this.setProperty(m, l[m]);
                }
                return this;
            },
            getProperty: function (m) {
                var l = e[m];
                var n = (l) ? this[l] : this.getAttribute(m, 2);
                return (b[m]) ? !! n : (l) ? n : n || null;
            },
            getProperties: function () {
                var l = $A(arguments);
                return l.map(this.getProperty, this).associate(l);
            },
            removeProperty: function (m) {
                var l = e[m];
                (l) ? this[l] = (l && b[m]) ? false : "" : this.removeAttribute(m);
                return this;
            },
            removeProperties: function () {
                Array.each(arguments, this.removeProperty, this);
                return this;
            },
            hasClass: function (l) {
                return this.className.contains(l, " ");
            },
            addClass: function (l) {
                if (!this.hasClass(l)) {
                    this.className = (this.className + " " + l).clean();
                }
                return this;
            },
            removeClass: function (l) {
                this.className = this.className.replace(new RegExp("(^|\\s)" + l + "(?:\\s|$)"), "$1");
                return this;
            },
            toggleClass: function (l) {
                return this.hasClass(l) ? this.removeClass(l) : this.addClass(l);
            },
            adopt: function () {
                Array.flatten(arguments).each(function (l) {
                    l = document.id(l, true);
                    if (l) {
                        this.appendChild(l);
                    }
                }, this);
                return this;
            },
            appendText: function (m, l) {
                return this.grab(this.getDocument().newTextNode(m), l);
            },
            grab: function (m, l) {
                a[l || "bottom"](document.id(m, true), this);
                return this;
            },
            inject: function (m, l) {
                a[l || "bottom"](this, document.id(m, true));
                return this;
            },
            replaces: function (l) {
                l = document.id(l, true);
                l.parentNode.replaceChild(this, l);
                return this;
            },
            wraps: function (m, l) {
                m = document.id(m, true);
                return this.replaces(m).grab(m, l);
            },
            getPrevious: function (l, m) {
                return j(this, "previousSibling", null, l, false, m);
            },
            getAllPrevious: function (l, m) {
                return j(this, "previousSibling", null, l, true, m);
            },
            getNext: function (l, m) {
                return j(this, "nextSibling", null, l, false, m);
            },
            getAllNext: function (l, m) {
                return j(this, "nextSibling", null, l, true, m);
            },
            getFirst: function (l, m) {
                return j(this, "nextSibling", "firstChild", l, false, m);
            },
            getLast: function (l, m) {
                return j(this, "previousSibling", "lastChild", l, false, m);
            },
            getParent: function (l, m) {
                return j(this, "parentNode", null, l, false, m);
            },
            getParents: function (l, m) {
                return j(this, "parentNode", null, l, true, m);
            },
            getSiblings: function (l, m) {
                return this.getParent().getChildren(l, m).erase(this);
            },
            getChildren: function (l, m) {
                return j(this, "nextSibling", "firstChild", l, true, m);
            },
            getWindow: function () {
                return this.ownerDocument.window;
            },
            getDocument: function () {
                return this.ownerDocument;
            },
            getElementById: function (o, n) {
                var m = this.ownerDocument.getElementById(o);
                if (!m) {
                    return null;
                }
                for (var l = m.parentNode; l != this; l = l.parentNode) {
                    if (!l) {
                        return null;
                    }
                }
                return document.id(m, n);
            },
            getSelected: function () {
                return new Elements($A(this.options).filter(function (l) {
                    return l.selected;
                }));
            },
            getComputedStyle: function (m) {
                if (this.currentStyle) {
                    return this.currentStyle[m.camelCase()];
                }
                var l = this.getDocument().defaultView.getComputedStyle(this, null);
                return (l) ? l.getPropertyValue([m.hyphenate()]) : null;
            },
            toQueryString: function () {
                var l = [];
                this.getElements("input, select, textarea", true).each(function (m) {
                    if (!m.name || m.disabled || m.type == "submit" || m.type == "reset" || m.type == "file") {
                        return;
                    }
                    var n = (m.tagName.toLowerCase() == "select") ? Element.getSelected(m).map(function (o) {
                        return o.value;
                    }) : ((m.type == "radio" || m.type == "checkbox") && !m.checked) ? null : m.value;
                    $splat(n).each(function (o) {
                        if (typeof o != "undefined") {
                            l.push(m.name + "=" + encodeURIComponent(o));
                        }
                    });
                });
                return l.join("&");
            },
            clone: function (o, l) {
                o = o !== false;
                var r = this.cloneNode(o);
                var n = function (v, u) {
                    if (!l) {
                        v.removeAttribute("id");
                    }
                    if (Browser.Engine.trident) {
                        v.clearAttributes();
                        v.mergeAttributes(u);
                        v.removeAttribute("uid");
                        if (v.options) {
                            var w = v.options,
                                s = u.options;
                            for (var t = w.length; t--;) {
                                    w[t].selected = s[t].selected;
                                }
                        }
                    }
                    var x = i[u.tagName.toLowerCase()];
                    if (x && u[x]) {
                        v[x] = u[x];
                    }
                };
                if (o) {
                    var p = r.getElementsByTagName("*"),
                        q = this.getElementsByTagName("*");
                    for (var m = p.length; m--;) {
                            n(p[m], q[m]);
                        }
                }
                n(r, this);
                return document.id(r);
            },
            destroy: function () {
                Element.empty(this);
                Element.dispose(this);
                g(this, true);
                return null;
            },
            empty: function () {
                $A(this.childNodes).each(function (l) {
                    Element.destroy(l);
                });
                return this;
            },
            dispose: function () {
                return (this.parentNode) ? this.parentNode.removeChild(this) : this;
            },
            hasChild: function (l) {
                l = document.id(l, true);
                if (!l) {
                    return false;
                }
                if (Browser.Engine.webkit && Browser.Engine.version < 420) {
                    return $A(this.getElementsByTagName(l.tagName)).contains(l);
                }
                return (this.contains) ? (this != l && this.contains(l)) : !! (this.compareDocumentPosition(l) & 16);
            },
            match: function (l) {
                return (!l || (l == this) || (Element.get(this, "tag") == l));
            }
        });
    Native.implement([Element, Window, Document], {
            addListener: function (o, n) {
                if (o == "unload") {
                    var l = n,
                        m = this;
                    n = function () {
                            m.removeListener("unload", n);
                            l();
                        };
                } else {
                    h[this.uid] = this;
                }
                if (this.addEventListener) {
                    this.addEventListener(o, n, false);
                } else {
                    this.attachEvent("on" + o, n);
                }
                return this;
            },
            removeListener: function (m, l) {
                if (this.removeEventListener) {
                    this.removeEventListener(m, l, false);
                } else {
                    this.detachEvent("on" + m, l);
                }
                return this;
            },
            retrieve: function (m, l) {
                var o = c(this.uid),
                    n = o[m];
                if (l != undefined && n == undefined) {
                        n = o[m] = l;
                    }
                return $pick(n);
            },
            store: function (m, l) {
                var n = c(this.uid);
                n[m] = l;
                return this;
            },
            eliminate: function (l) {
                var m = c(this.uid);
                delete m[l];
                return this;
            }
        });
    window.addListener("unload", d);
})();
Element.Properties = new Hash;
Element.Properties.style = {
    set: function (a) {
        this.style.cssText = a;
    },
    get: function () {
        return this.style.cssText;
    },
    erase: function () {
        this.style.cssText = "";
    }
};
Element.Properties.tag = {
    get: function () {
        return this.tagName.toLowerCase();
    }
};
Element.Properties.html = (function () {
    var c = document.createElement("div");
    var a = {
        table: [1, "<table>", "</table>"],
        select: [1, "<select>", "</select>"],
        tbody: [2, "<table><tbody>", "</tbody></table>"],
        tr: [3, "<table><tbody><tr>", "</tr></tbody></table>"]
    };
    a.thead = a.tfoot = a.tbody;
    var b = {
        set: function () {
            var e = Array.flatten(arguments).join("");
            var f = Browser.Engine.trident && a[this.get("tag")];
            if (f) {
                var g = c;
                g.innerHTML = f[1] + e + f[2];
                for (var d = f[0]; d--;) {
                    g = g.firstChild;
                }
                this.empty().adopt(g.childNodes);
            } else {
                this.innerHTML = e;
            }
        }
    };
    b.erase = b.set;
    return b;
})();
if (Browser.Engine.webkit && Browser.Engine.version < 420) {
    Element.Properties.text = {
        get: function () {
            if (this.innerText) {
                return this.innerText;
            }
            var a = this.ownerDocument.newElement("div", {
                html: this.innerHTML
            }).inject(this.ownerDocument.body);
            var b = a.innerText;
            a.destroy();
            return b;
        }
    };
}
Element.Properties.events = {
    set: function (a) {
        this.addEvents(a);
    }
};
Native.implement([Element, Window, Document], {
    addEvent: function (e, g) {
        var h = this.retrieve("events", {});
        h[e] = h[e] || {
            keys: [],
            values: []
        };
        if (h[e].keys.contains(g)) {
            return this;
        }
        h[e].keys.push(g);
        var f = e,
            a = Element.Events.get(e),
            c = g,
            i = this;
        if (a) {
                if (a.onAdd) {
                    a.onAdd.call(this, g);
                }
                if (a.condition) {
                    c = function (j) {
                        if (a.condition.call(this, j)) {
                            return g.call(this, j);
                        }
                        return true;
                    };
                }
                f = a.base || f;
            }
        var d = function () {
                return g.call(i);
            };
        var b = Element.NativeEvents[f];
        if (b) {
                if (b == 2) {
                    d = function (j) {
                        j = new Event(j, i.getWindow());
                        if (c.call(i, j) === false) {
                            j.stop();
                        }
                    };
                }
                this.addListener(f, d);
            }
        h[e].values.push(d);
        return this;
    },
    removeEvent: function (c, b) {
        var a = this.retrieve("events");
        if (!a || !a[c]) {
            return this;
        }
        var f = a[c].keys.indexOf(b);
        if (f == -1) {
            return this;
        }
        a[c].keys.splice(f, 1);
        var e = a[c].values.splice(f, 1)[0];
        var d = Element.Events.get(c);
        if (d) {
            if (d.onRemove) {
                d.onRemove.call(this, b);
            }
            c = d.base || c;
        }
        return (Element.NativeEvents[c]) ? this.removeListener(c, e) : this;
    },
    addEvents: function (a) {
        for (var b in a) {
            this.addEvent(b, a[b]);
        }
        return this;
    },
    removeEvents: function (a) {
        var c;
        if ($type(a) == "object") {
            for (c in a) {
                this.removeEvent(c, a[c]);
            }
            return this;
        }
        var b = this.retrieve("events");
        if (!b) {
            return this;
        }
        if (!a) {
            for (c in b) {
                this.removeEvents(c);
            }
            this.eliminate("events");
        } else {
            if (b[a]) {
                while (b[a].keys[0]) {
                    this.removeEvent(a, b[a].keys[0]);
                }
                b[a] = null;
            }
        }
        return this;
    },
    fireEvent: function (d, b, a) {
        var c = this.retrieve("events");
        if (!c || !c[d]) {
            return this;
        }
        c[d].keys.each(function (e) {
            e.create({
                bind: this,
                delay: a,
                "arguments": b
            })();
        }, this);
        return this;
    },
    cloneEvents: function (d, a) {
        d = document.id(d);
        var c = d.retrieve("events");
        if (!c) {
            return this;
        }
        if (!a) {
            for (var b in c) {
                this.cloneEvents(d, b);
            }
        } else {
            if (c[a]) {
                c[a].keys.each(function (e) {
                    this.addEvent(a, e);
                }, this);
            }
        }
        return this;
    }
});
Element.NativeEvents = {
    click: 2,
    dblclick: 2,
    mouseup: 2,
    mousedown: 2,
    contextmenu: 2,
    mousewheel: 2,
    DOMMouseScroll: 2,
    mouseover: 2,
    mouseout: 2,
    mousemove: 2,
    selectstart: 2,
    selectend: 2,
    keydown: 2,
    keypress: 2,
    keyup: 2,
    focus: 2,
    blur: 2,
    change: 2,
    reset: 2,
    select: 2,
    submit: 2,
    load: 1,
    unload: 1,
    beforeunload: 2,
    resize: 1,
    move: 1,
    DOMContentLoaded: 1,
    readystatechange: 1,
    error: 1,
    abort: 1,
    scroll: 1
};
(function () {
    var a = function (b) {
        var c = b.relatedTarget;
        if (c == undefined) {
            return true;
        }
        if (c === false) {
            return false;
        }
        return ($type(this) != "document" && c != this && c.prefix != "xul" && !this.hasChild(c));
    };
    Element.Events = new Hash({
        mouseenter: {
            base: "mouseover",
            condition: a
        },
        mouseleave: {
            base: "mouseout",
            condition: a
        },
        mousewheel: {
            base: (Browser.Engine.gecko) ? "DOMMouseScroll" : "mousewheel"
        }
    });
})();
Element.Properties.styles = {
    set: function (a) {
        this.setStyles(a);
    }
};
Element.Properties.opacity = {
    set: function (a, b) {
        if (!b) {
            if (a == 0) {
                if (this.style.visibility != "hidden") {
                    this.style.visibility = "hidden";
                }
            } else {
                if (this.style.visibility != "visible") {
                    this.style.visibility = "visible";
                }
            }
        }
        if (!this.currentStyle || !this.currentStyle.hasLayout) {
            this.style.zoom = 1;
        }
        if (Browser.Engine.trident) {
            this.style.filter = (a == 1) ? "" : "alpha(opacity=" + a * 100 + ")";
        }
        this.style.opacity = a;
        this.store("opacity", a);
    },
    get: function () {
        return this.retrieve("opacity", 1);
    }
};
Element.implement({
    setOpacity: function (a) {
        return this.set("opacity", a, true);
    },
    getOpacity: function () {
        return this.get("opacity");
    },
    setStyle: function (b, a) {
        switch (b) {
        case "opacity":
            return this.set("opacity", parseFloat(a));
        case "float":
            b = (Browser.Engine.trident) ? "styleFloat" : "cssFloat";
        }
        b = b.camelCase();
        if ($type(a) != "string") {
            var c = (Element.Styles.get(b) || "@").split(" ");
            a = $splat(a).map(function (e, d) {
                if (!c[d]) {
                    return "";
                }
                return ($type(e) == "number") ? c[d].replace("@", Math.round(e)) : e;
            }).join(" ");
        } else {
            if (a == String(Number(a))) {
                a = Math.round(a);
            }
        }
        this.style[b] = a;
        return this;
    },
    getStyle: function (g) {
        switch (g) {
        case "opacity":
            return this.get("opacity");
        case "float":
            g = (Browser.Engine.trident) ? "styleFloat" : "cssFloat";
        }
        g = g.camelCase();
        var a = this.style[g];
        if (!$chk(a)) {
            a = [];
            for (var f in Element.ShortStyles) {
                if (g != f) {
                    continue;
                }
                for (var e in Element.ShortStyles[f]) {
                    a.push(this.getStyle(e));
                }
                return a.join(" ");
            }
            a = this.getComputedStyle(g);
        }
        if (a) {
            a = String(a);
            var c = a.match(/rgba?\([\d\s,]+\)/);
            if (c) {
                a = a.replace(c[0], c[0].rgbToHex());
            }
        }
        if (Browser.Engine.presto || (Browser.Engine.trident && !$chk(parseInt(a, 10)))) {
            if (g.test(/^(height|width)$/)) {
                var b = (g == "width") ? ["left", "right"] : ["top", "bottom"],
                    d = 0;
                b.each(function (h) {
                        d += this.getStyle("border-" + h + "-width").toInt() + this.getStyle("padding-" + h).toInt();
                    }, this);
                return this["offset" + g.capitalize()] - d + "px";
            }
            if ((Browser.Engine.presto) && String(a).test("px")) {
                return a;
            }
            if (g.test(/(border(.+)Width|margin|padding)/)) {
                return "0px";
            }
        }
        return a;
    },
    setStyles: function (b) {
        for (var a in b) {
            this.setStyle(a, b[a]);
        }
        return this;
    },
    getStyles: function () {
        var a = {};
        Array.flatten(arguments).each(function (b) {
            a[b] = this.getStyle(b);
        }, this);
        return a;
    }
});
Element.Styles = new Hash({
    left: "@px",
    top: "@px",
    bottom: "@px",
    right: "@px",
    width: "@px",
    height: "@px",
    maxWidth: "@px",
    maxHeight: "@px",
    minWidth: "@px",
    minHeight: "@px",
    backgroundColor: "rgb(@, @, @)",
    backgroundPosition: "@px @px",
    color: "rgb(@, @, @)",
    fontSize: "@px",
    letterSpacing: "@px",
    lineHeight: "@px",
    clip: "rect(@px @px @px @px)",
    margin: "@px @px @px @px",
    padding: "@px @px @px @px",
    border: "@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)",
    borderWidth: "@px @px @px @px",
    borderStyle: "@ @ @ @",
    borderColor: "rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)",
    zIndex: "@",
    zoom: "@",
    fontWeight: "@",
    textIndent: "@px",
    opacity: "@"
});
Element.ShortStyles = {
    margin: {},
    padding: {},
    border: {},
    borderWidth: {},
    borderStyle: {},
    borderColor: {}
};
["Top", "Right", "Bottom", "Left"].each(function (g) {
    var f = Element.ShortStyles;
    var b = Element.Styles;
    ["margin", "padding"].each(function (h) {
        var i = h + g;
        f[h][i] = b[i] = "@px";
    });
    var e = "border" + g;
    f.border[e] = b[e] = "@px @ rgb(@, @, @)";
    var d = e + "Width",
        a = e + "Style",
        c = e + "Color";
    f[e] = {};
    f.borderWidth[d] = f[e][d] = b[d] = "@px";
    f.borderStyle[a] = f[e][a] = b[a] = "@";
    f.borderColor[c] = f[e][c] = b[c] = "rgb(@, @, @)";
});
(function () {
    Element.implement({
        scrollTo: function (h, i) {
            if (b(this)) {
                this.getWindow().scrollTo(h, i);
            } else {
                this.scrollLeft = h;
                this.scrollTop = i;
            }
            return this;
        },
        getSize: function () {
            if (b(this)) {
                return this.getWindow().getSize();
            }
            return {
                x: this.offsetWidth,
                y: this.offsetHeight
            };
        },
        getScrollSize: function () {
            if (b(this)) {
                return this.getWindow().getScrollSize();
            }
            return {
                x: this.scrollWidth,
                y: this.scrollHeight
            };
        },
        getScroll: function () {
            if (b(this)) {
                return this.getWindow().getScroll();
            }
            return {
                x: this.scrollLeft,
                y: this.scrollTop
            };
        },
        getScrolls: function () {
            var i = this,
                h = {
                    x: 0,
                    y: 0
                };
            while (i && !b(i)) {
                    h.x += i.scrollLeft;
                    h.y += i.scrollTop;
                    i = i.parentNode;
                }
            return h;
        },
        getOffsetParent: function () {
            var h = this;
            if (b(h)) {
                return null;
            }
            if (!Browser.Engine.trident) {
                return h.offsetParent;
            }
            while ((h = h.parentNode) && !b(h)) {
                if (d(h, "position") != "static") {
                    return h;
                }
            }
            return null;
        },
        getOffsets: function () {
            if (this.getBoundingClientRect) {
                var j = this.getBoundingClientRect(),
                    m = document.id(this.getDocument().documentElement),
                    p = m.getScroll(),
                    k = this.getScrolls(),
                    i = this.getScroll(),
                    h = (d(this, "position") == "fixed");
                return {
                        x: j.left.toInt() + k.x - i.x + ((h) ? 0 : p.x) - m.clientLeft,
                        y: j.top.toInt() + k.y - i.y + ((h) ? 0 : p.y) - m.clientTop
                    };
            }
            var l = this,
                n = {
                    x: 0,
                    y: 0
                };
            if (b(this)) {
                    return n;
                }
            while (l && !b(l)) {
                    n.x += l.offsetLeft;
                    n.y += l.offsetTop;
                    if (Browser.Engine.gecko) {
                        if (!f(l)) {
                            n.x += c(l);
                            n.y += g(l);
                        }
                        var o = l.parentNode;
                        if (o && d(o, "overflow") != "visible") {
                            n.x += c(o);
                            n.y += g(o);
                        }
                    } else {
                        if (l != this && Browser.Engine.webkit) {
                            n.x += c(l);
                            n.y += g(l);
                        }
                    }
                    l = l.offsetParent;
                }
            if (Browser.Engine.gecko && !f(this)) {
                    n.x -= c(this);
                    n.y -= g(this);
                }
            return n;
        },
        getPosition: function (k) {
            if (b(this)) {
                return {
                    x: 0,
                    y: 0
                };
            }
            var l = this.getOffsets(),
                i = this.getScrolls();
            var h = {
                    x: l.x - i.x,
                    y: l.y - i.y
                };
            var j = (k && (k = document.id(k))) ? k.getPosition() : {
                    x: 0,
                    y: 0
                };
            return {
                    x: h.x - j.x,
                    y: h.y - j.y
                };
        },
        getCoordinates: function (j) {
            if (b(this)) {
                return this.getWindow().getCoordinates();
            }
            var h = this.getPosition(j),
                i = this.getSize();
            var k = {
                    left: h.x,
                    top: h.y,
                    width: i.x,
                    height: i.y
                };
            k.right = k.left + k.width;
            k.bottom = k.top + k.height;
            return k;
        },
        computePosition: function (h) {
            return {
                left: h.x - e(this, "margin-left"),
                top: h.y - e(this, "margin-top")
            };
        },
        setPosition: function (h) {
            return this.setStyles(this.computePosition(h));
        }
    });
    Native.implement([Document, Window], {
        getSize: function () {
            if (Browser.Engine.presto || Browser.Engine.webkit) {
                var i = this.getWindow();
                return {
                    x: i.innerWidth,
                    y: i.innerHeight
                };
            }
            var h = a(this);
            return {
                x: h.clientWidth,
                y: h.clientHeight
            };
        },
        getScroll: function () {
            var i = this.getWindow(),
                h = a(this);
            return {
                    x: i.pageXOffset || h.scrollLeft,
                    y: i.pageYOffset || h.scrollTop
                };
        },
        getScrollSize: function () {
            var i = a(this),
                h = this.getSize();
            return {
                    x: Math.max(i.scrollWidth, h.x),
                    y: Math.max(i.scrollHeight, h.y)
                };
        },
        getPosition: function () {
            return {
                x: 0,
                y: 0
            };
        },
        getCoordinates: function () {
            var h = this.getSize();
            return {
                top: 0,
                left: 0,
                bottom: h.y,
                right: h.x,
                height: h.y,
                width: h.x
            };
        }
    });
    var d = Element.getComputedStyle;

    function e(h, i) {
        return d(h, i).toInt() || 0;
    }
    function f(h) {
        return d(h, "-moz-box-sizing") == "border-box";
    }
    function g(h) {
        return e(h, "border-top-width");
    }
    function c(h) {
        return e(h, "border-left-width");
    }
    function b(h) {
        return (/^(?:body|html)$/i).test(h.tagName);
    }
    function a(h) {
        var i = h.getDocument();
        return (!i.compatMode || i.compatMode == "CSS1Compat") ? i.html : i.body;
    }
})();
Element.alias("setPosition", "position");
Native.implement([Window, Document, Element], {
    getHeight: function () {
        return this.getSize().y;
    },
    getWidth: function () {
        return this.getSize().x;
    },
    getScrollTop: function () {
        return this.getScroll().y;
    },
    getScrollLeft: function () {
        return this.getScroll().x;
    },
    getScrollHeight: function () {
        return this.getScrollSize().y;
    },
    getScrollWidth: function () {
        return this.getScrollSize().x;
    },
    getTop: function () {
        return this.getPosition().y;
    },
    getLeft: function () {
        return this.getPosition().x;
    }
});
Native.implement([Document, Element], {
    getElements: function (h, g) {
        h = h.split(",");
        var c, e = {};
        for (var d = 0, b = h.length; d < b; d++) {
            var a = h[d],
                f = Selectors.Utils.search(this, a, e);
            if (d != 0 && f.item) {
                    f = $A(f);
                }
            c = (d == 0) ? f : (c.item) ? $A(c).concat(f) : c.concat(f);
        }
        return new Elements(c, {
            ddup: (h.length > 1),
            cash: !g
        });
    }
});
Element.implement({
    match: function (b) {
        if (!b || (b == this)) {
            return true;
        }
        var d = Selectors.Utils.parseTagAndID(b);
        var a = d[0],
            e = d[1];
        if (!Selectors.Filters.byID(this, e) || !Selectors.Filters.byTag(this, a)) {
                return false;
            }
        var c = Selectors.Utils.parseSelector(b);
        return (c) ? Selectors.Utils.filter(this, c, {}) : true;
    }
});
var Selectors = {
    Cache: {
        nth: {},
        parsed: {}
    }
};
Selectors.RegExps = {
    id: (/#([\w-]+)/),
    tag: (/^(\w+|\*)/),
    quick: (/^(\w+|\*)$/),
    splitter: (/\s*([+>~\s])\s*([a-zA-Z#.*:\[])/g),
    combined: (/\.([\w-]+)|\[(\w+)(?:([!*^$~|]?=)(["']?)([^\4]*?)\4)?\]|:([\w-]+)(?:\(["']?(.*?)?["']?\)|$)/g)
};
Selectors.Utils = {
    chk: function (b, c) {
        if (!c) {
            return true;
        }
        var a = $uid(b);
        if (!c[a]) {
            return c[a] = true;
        }
        return false;
    },
    parseNthArgument: function (h) {
        if (Selectors.Cache.nth[h]) {
            return Selectors.Cache.nth[h];
        }
        var e = h.match(/^([+-]?\d*)?([a-z]+)?([+-]?\d*)?$/);
        if (!e) {
            return false;
        }
        var g = parseInt(e[1], 10);
        var d = (g || g === 0) ? g : 1;
        var f = e[2] || false;
        var c = parseInt(e[3], 10) || 0;
        if (d != 0) {
            c--;
            while (c < 1) {
                c += d;
            }
            while (c >= d) {
                c -= d;
            }
        } else {
            d = c;
            f = "index";
        }
        switch (f) {
        case "n":
            e = {
                a: d,
                b: c,
                special: "n"
            };
            break;
        case "odd":
            e = {
                a: 2,
                b: 0,
                special: "n"
            };
            break;
        case "even":
            e = {
                a: 2,
                b: 1,
                special: "n"
            };
            break;
        case "first":
            e = {
                a: 0,
                special: "index"
            };
            break;
        case "last":
            e = {
                special: "last-child"
            };
            break;
        case "only":
            e = {
                special: "only-child"
            };
            break;
        default:
            e = {
                a: (d - 1),
                special: "index"
            };
        }
        return Selectors.Cache.nth[h] = e;
    },
    parseSelector: function (e) {
        if (Selectors.Cache.parsed[e]) {
            return Selectors.Cache.parsed[e];
        }
        var d, h = {
            classes: [],
            pseudos: [],
            attributes: []
        };
        while ((d = Selectors.RegExps.combined.exec(e))) {
            var i = d[1],
                g = d[2],
                f = d[3],
                b = d[5],
                c = d[6],
                j = d[7];
            if (i) {
                    h.classes.push(i);
                } else {
                    if (c) {
                        var a = Selectors.Pseudo.get(c);
                        if (a) {
                            h.pseudos.push({
                                parser: a,
                                argument: j
                            });
                        } else {
                            h.attributes.push({
                                name: c,
                                operator: "=",
                                value: j
                            });
                        }
                    } else {
                        if (g) {
                            h.attributes.push({
                                name: g,
                                operator: f,
                                value: b
                            });
                        }
                    }
                }
        }
        if (!h.classes.length) {
            delete h.classes;
        }
        if (!h.attributes.length) {
            delete h.attributes;
        }
        if (!h.pseudos.length) {
            delete h.pseudos;
        }
        if (!h.classes && !h.attributes && !h.pseudos) {
            h = null;
        }
        return Selectors.Cache.parsed[e] = h;
    },
    parseTagAndID: function (b) {
        var a = b.match(Selectors.RegExps.tag);
        var c = b.match(Selectors.RegExps.id);
        return [(a) ? a[1] : "*", (c) ? c[1] : false];
    },
    filter: function (f, c, e) {
        var d;
        if (c.classes) {
            for (d = c.classes.length; d--; d) {
                var g = c.classes[d];
                if (!Selectors.Filters.byClass(f, g)) {
                    return false;
                }
            }
        }
        if (c.attributes) {
            for (d = c.attributes.length; d--; d) {
                var b = c.attributes[d];
                if (!Selectors.Filters.byAttribute(f, b.name, b.operator, b.value)) {
                    return false;
                }
            }
        }
        if (c.pseudos) {
            for (d = c.pseudos.length; d--; d) {
                var a = c.pseudos[d];
                if (!Selectors.Filters.byPseudo(f, a.parser, a.argument, e)) {
                    return false;
                }
            }
        }
        return true;
    },
    getByTagAndID: function (b, a, d) {
        if (d) {
            var c = (b.getElementById) ? b.getElementById(d, true) : Element.getElementById(b, d, true);
            return (c && Selectors.Filters.byTag(c, a)) ? [c] : [];
        } else {
            return b.getElementsByTagName(a);
        }
    },
    search: function (o, h, t) {
        var b = [];
        var c = h.trim().replace(Selectors.RegExps.splitter, function (k, j, i) {
            b.push(j);
            return ":)" + i;
        }).split(":)");
        var p, e, A;
        for (var z = 0, v = c.length; z < v; z++) {
            var y = c[z];
            if (z == 0 && Selectors.RegExps.quick.test(y)) {
                p = o.getElementsByTagName(y);
                continue;
            }
            var a = b[z - 1];
            var q = Selectors.Utils.parseTagAndID(y);
            var B = q[0],
                r = q[1];
            if (z == 0) {
                    p = Selectors.Utils.getByTagAndID(o, B, r);
                } else {
                    var d = {},
                        g = [];
                    for (var x = 0, w = p.length; x < w; x++) {
                            g = Selectors.Getters[a](g, p[x], B, r, d);
                        }
                    p = g;
                }
            var f = Selectors.Utils.parseSelector(y);
            if (f) {
                    e = [];
                    for (var u = 0, s = p.length; u < s; u++) {
                        A = p[u];
                        if (Selectors.Utils.filter(A, f, t)) {
                            e.push(A);
                        }
                    }
                    p = e;
                }
        }
        return p;
    }
};
Selectors.Getters = {
    " ": function (h, g, j, a, e) {
        var d = Selectors.Utils.getByTagAndID(g, j, a);
        for (var c = 0, b = d.length; c < b; c++) {
            var f = d[c];
            if (Selectors.Utils.chk(f, e)) {
                h.push(f);
            }
        }
        return h;
    },
    ">": function (h, g, j, a, f) {
        var c = Selectors.Utils.getByTagAndID(g, j, a);
        for (var e = 0, d = c.length; e < d; e++) {
            var b = c[e];
            if (b.parentNode == g && Selectors.Utils.chk(b, f)) {
                h.push(b);
            }
        }
        return h;
    },
    "+": function (c, b, a, e, d) {
        while ((b = b.nextSibling)) {
            if (b.nodeType == 1) {
                if (Selectors.Utils.chk(b, d) && Selectors.Filters.byTag(b, a) && Selectors.Filters.byID(b, e)) {
                    c.push(b);
                }
                break;
            }
        }
        return c;
    },
    "~": function (c, b, a, e, d) {
        while ((b = b.nextSibling)) {
            if (b.nodeType == 1) {
                if (!Selectors.Utils.chk(b, d)) {
                    break;
                }
                if (Selectors.Filters.byTag(b, a) && Selectors.Filters.byID(b, e)) {
                    c.push(b);
                }
            }
        }
        return c;
    }
};
Selectors.Filters = {
    byTag: function (b, a) {
        return (a == "*" || (b.tagName && b.tagName.toLowerCase() == a));
    },
    byID: function (a, b) {
        return (!b || (a.id && a.id == b));
    },
    byClass: function (b, a) {
        return (b.className && b.className.contains && b.className.contains(a, " "));
    },
    byPseudo: function (a, d, c, b) {
        return d.call(a, c, b);
    },
    byAttribute: function (c, d, b, e) {
        var a = Element.prototype.getProperty.call(c, d);
        if (!a) {
            return (b == "!=");
        }
        if (!b || e == undefined) {
            return true;
        }
        switch (b) {
        case "=":
            return (a == e);
        case "*=":
            return (a.contains(e));
        case "^=":
            return (a.substr(0, e.length) == e);
        case "$=":
            return (a.substr(a.length - e.length) == e);
        case "!=":
            return (a != e);
        case "~=":
            return a.contains(e, " ");
        case "|=":
            return a.contains(e, "-");
        }
        return false;
    }
};
Selectors.Pseudo = new Hash({
    checked: function () {
        return this.checked;
    },
    empty: function () {
        return !(this.innerText || this.textContent || "").length;
    },
    not: function (a) {
        return !Element.match(this, a);
    },
    contains: function (a) {
        return (this.innerText || this.textContent || "").contains(a);
    },
    "first-child": function () {
        return Selectors.Pseudo.index.call(this, 0);
    },
    "last-child": function () {
        var a = this;
        while ((a = a.nextSibling)) {
            if (a.nodeType == 1) {
                return false;
            }
        }
        return true;
    },
    "only-child": function () {
        var b = this;
        while ((b = b.previousSibling)) {
            if (b.nodeType == 1) {
                return false;
            }
        }
        var a = this;
        while ((a = a.nextSibling)) {
            if (a.nodeType == 1) {
                return false;
            }
        }
        return true;
    },
    "nth-child": function (g, e) {
        g = (g == undefined) ? "n" : g;
        var c = Selectors.Utils.parseNthArgument(g);
        if (c.special != "n") {
            return Selectors.Pseudo[c.special].call(this, c.a, e);
        }
        var f = 0;
        e.positions = e.positions || {};
        var d = $uid(this);
        if (!e.positions[d]) {
            var b = this;
            while ((b = b.previousSibling)) {
                if (b.nodeType != 1) {
                    continue;
                }
                f++;
                var a = e.positions[$uid(b)];
                if (a != undefined) {
                    f = a + f;
                    break;
                }
            }
            e.positions[d] = f;
        }
        return (e.positions[d] % c.a == c.b);
    },
    index: function (a) {
        var b = this,
            c = 0;
        while ((b = b.previousSibling)) {
                if (b.nodeType == 1 && ++c > a) {
                    return false;
                }
            }
        return (c == a);
    },
    even: function (b, a) {
        return Selectors.Pseudo["nth-child"].call(this, "2n+1", a);
    },
    odd: function (b, a) {
        return Selectors.Pseudo["nth-child"].call(this, "2n", a);
    },
    selected: function () {
        return this.selected;
    },
    enabled: function () {
        return (this.disabled === false);
    }
});
Element.Events.domready = {
    onAdd: function (a) {
        if (Browser.loaded) {
            a.call(this);
        }
    }
};
(function () {
    var b = function () {
        if (Browser.loaded) {
            return;
        }
        Browser.loaded = true;
        window.fireEvent("domready");
        document.fireEvent("domready");
    };
    window.addEvent("load", b);
    if (Browser.Engine.trident) {
        var a = document.createElement("div");
        (function () {
            ($try(function () {
                a.doScroll();
                return document.id(a).inject(document.body).set("html", "temp").dispose();
            })) ? b() : arguments.callee.delay(50);
        })();
    } else {
        if (Browser.Engine.webkit && Browser.Engine.version < 525) {
            (function () {
                (["loaded", "complete"].contains(document.readyState)) ? b() : arguments.callee.delay(50);
            })();
        } else {
            document.addEvent("DOMContentLoaded", b);
        }
    }
})();
var JSON = new Hash(this.JSON && {
    stringify: JSON.stringify,
    parse: JSON.parse
}).extend({
    $specialChars: {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    $replaceChars: function (a) {
        return JSON.$specialChars[a] || "\\u00" + Math.floor(a.charCodeAt() / 16).toString(16) + (a.charCodeAt() % 16).toString(16);
    },
    encode: function (b) {
        switch ($type(b)) {
        case "string":
            return '"' + b.replace(/[\x00-\x1f\\"]/g, JSON.$replaceChars) + '"';
        case "array":
            return "[" + String(b.map(JSON.encode).clean()) + "]";
        case "object":
        case "hash":
            var a = [];
            Hash.each(b, function (e, d) {
                var c = JSON.encode(e);
                if (c) {
                    a.push(JSON.encode(d) + ":" + c);
                }
            });
            return "{" + a + "}";
        case "number":
        case "boolean":
            return String(b);
        case false:
            return "null";
        }
        return null;
    },
    decode: function (string, secure) {
        if ($type(string) != "string" || !string.length) {
            return null;
        }
        if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, "@").replace(/"[^"\\\n\r]*"/g, ""))) {
            return null;
        }
        return eval("(" + string + ")");
    }
});
Native.implement([Hash, Array, String, Number], {
    toJSON: function () {
        return JSON.encode(this);
    }
});
var Cookie = new Class({
    Implements: Options,
    options: {
        path: false,
        domain: false,
        duration: false,
        secure: false,
        document: document
    },
    initialize: function (b, a) {
        this.key = b;
        this.setOptions(a);
    },
    write: function (b) {
        b = encodeURIComponent(b);
        if (this.options.domain) {
            b += "; domain=" + this.options.domain;
        }
        if (this.options.path) {
            b += "; path=" + this.options.path;
        }
        if (this.options.duration) {
            var a = new Date();
            a.setTime(a.getTime() + this.options.duration * 24 * 60 * 60 * 1000);
            b += "; expires=" + a.toGMTString();
        }
        if (this.options.secure) {
            b += "; secure";
        }
        this.options.document.cookie = this.key + "=" + b;
        return this;
    },
    read: function () {
        var a = this.options.document.cookie.match("(?:^|;)\\s*" + this.key.escapeRegExp() + "=([^;]*)");
        return (a) ? decodeURIComponent(a[1]) : null;
    },
    dispose: function () {
        new Cookie(this.key, $merge(this.options, {
            duration: -1
        })).write("");
        return this;
    }
});
Cookie.write = function (b, c, a) {
    return new Cookie(b, a).write(c);
};
Cookie.read = function (a) {
    return new Cookie(a).read();
};
Cookie.dispose = function (b, a) {
    return new Cookie(b, a).dispose();
};
var Fx = new Class({
    Implements: [Chain, Events, Options],
    options: {
        fps: 50,
        unit: false,
        duration: 500,
        link: "ignore"
    },
    initialize: function (a) {
        this.subject = this.subject || this;
        this.setOptions(a);
        this.options.duration = Fx.Durations[this.options.duration] || this.options.duration.toInt();
        var b = this.options.wait;
        if (b === false) {
            this.options.link = "cancel";
        }
    },
    getTransition: function () {
        return function (a) {
            return -(Math.cos(Math.PI * a) - 1) / 2;
        };
    },
    step: function () {
        var a = $time();
        if (a < this.time + this.options.duration) {
            var b = this.transition((a - this.time) / this.options.duration);
            this.set(this.compute(this.from, this.to, b));
        } else {
            this.set(this.compute(this.from, this.to, 1));
            this.complete();
        }
    },
    set: function (a) {
        return a;
    },
    compute: function (c, b, a) {
        return Fx.compute(c, b, a);
    },
    check: function () {
        if (!this.timer) {
            return true;
        }
        switch (this.options.link) {
        case "cancel":
            this.cancel();
            return true;
        case "chain":
            this.chain(this.caller.bind(this, arguments));
            return false;
        }
        return false;
    },
    start: function (b, a) {
        if (!this.check(b, a)) {
            return this;
        }
        this.from = b;
        this.to = a;
        this.time = 0;
        this.transition = this.getTransition();
        this.startTimer();
        this.onStart();
        return this;
    },
    complete: function () {
        if (this.stopTimer()) {
            this.onComplete();
        }
        return this;
    },
    cancel: function () {
        if (this.stopTimer()) {
            this.onCancel();
        }
        return this;
    },
    onStart: function () {
        this.fireEvent("start", this.subject);
    },
    onComplete: function () {
        this.fireEvent("complete", this.subject);
        if (!this.callChain()) {
            this.fireEvent("chainComplete", this.subject);
        }
    },
    onCancel: function () {
        this.fireEvent("cancel", this.subject).clearChain();
    },
    pause: function () {
        this.stopTimer();
        return this;
    },
    resume: function () {
        this.startTimer();
        return this;
    },
    stopTimer: function () {
        if (!this.timer) {
            return false;
        }
        this.time = $time() - this.time;
        this.timer = $clear(this.timer);
        return true;
    },
    startTimer: function () {
        if (this.timer) {
            return false;
        }
        this.time = $time() - this.time;
        this.timer = this.step.periodical(Math.round(1000 / this.options.fps), this);
        return true;
    }
});
Fx.compute = function (c, b, a) {
    return (b - c) * a + c;
};
Fx.Durations = {
    "short": 250,
    normal: 500,
    "long": 1000
};
Fx.CSS = new Class({
    Extends: Fx,
    prepare: function (d, e, b) {
        b = $splat(b);
        var c = b[1];
        if (!$chk(c)) {
            b[1] = b[0];
            b[0] = d.getStyle(e);
        }
        var a = b.map(this.parse);
        return {
            from: a[0],
            to: a[1]
        };
    },
    parse: function (a) {
        a = $lambda(a)();
        a = (typeof a == "string") ? a.split(" ") : $splat(a);
        return a.map(function (c) {
            c = String(c);
            var b = false;
            Fx.CSS.Parsers.each(function (f, e) {
                if (b) {
                    return;
                }
                var d = f.parse(c);
                if ($chk(d)) {
                    b = {
                        value: d,
                        parser: f
                    };
                }
            });
            b = b || {
                value: c,
                parser: Fx.CSS.Parsers.String
            };
            return b;
        });
    },
    compute: function (d, c, b) {
        var a = [];
        (Math.min(d.length, c.length)).times(function (e) {
            a.push({
                value: d[e].parser.compute(d[e].value, c[e].value, b),
                parser: d[e].parser
            });
        });
        a.$family = {
            name: "fx:css:value"
        };
        return a;
    },
    serve: function (c, b) {
        if ($type(c) != "fx:css:value") {
            c = this.parse(c);
        }
        var a = [];
        c.each(function (d) {
            a = a.concat(d.parser.serve(d.value, b));
        });
        return a;
    },
    render: function (a, d, c, b) {
        a.setStyle(d, this.serve(c, b));
    },
    search: function (a) {
        if (Fx.CSS.Cache[a]) {
            return Fx.CSS.Cache[a];
        }
        var b = {};
        Array.each(document.styleSheets, function (e, d) {
            var c = e.href;
            if (c && c.contains("://") && !c.contains(document.domain)) {
                return;
            }
            var f = e.rules || e.cssRules;
            Array.each(f, function (j, g) {
                if (!j.style) {
                    return;
                }
                var h = (j.selectorText) ? j.selectorText.replace(/^\w+/, function (i) {
                    return i.toLowerCase();
                }) : null;
                if (!h || !h.test("^" + a + "$")) {
                    return;
                }
                Element.Styles.each(function (k, i) {
                    if (!j.style[i] || Element.ShortStyles[i]) {
                        return;
                    }
                    k = String(j.style[i]);
                    b[i] = (k.test(/^rgb/)) ? k.rgbToHex() : k;
                });
            });
        });
        return Fx.CSS.Cache[a] = b;
    }
});
Fx.CSS.Cache = {};
Fx.CSS.Parsers = new Hash({
    Color: {
        parse: function (a) {
            if (a.match(/^#[0-9a-f]{3,6}$/i)) {
                return a.hexToRgb(true);
            }
            return ((a = a.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [a[1], a[2], a[3]] : false;
        },
        compute: function (c, b, a) {
            return c.map(function (e, d) {
                return Math.round(Fx.compute(c[d], b[d], a));
            });
        },
        serve: function (a) {
            return a.map(Number);
        }
    },
    Number: {
        parse: parseFloat,
        compute: Fx.compute,
        serve: function (b, a) {
            return (a) ? b + a : b;
        }
    },
    String: {
        parse: $lambda(false),
        compute: $arguments(1),
        serve: $arguments(0)
    }
});
Fx.Tween = new Class({
    Extends: Fx.CSS,
    initialize: function (b, a) {
        this.element = this.subject = document.id(b);
        this.parent(a);
    },
    set: function (b, a) {
        if (arguments.length == 1) {
            a = b;
            b = this.property || this.options.property;
        }
        this.render(this.element, b, a, this.options.unit);
        return this;
    },
    start: function (c, e, d) {
        if (!this.check(c, e, d)) {
            return this;
        }
        var b = Array.flatten(arguments);
        this.property = this.options.property || b.shift();
        var a = this.prepare(this.element, this.property, b);
        return this.parent(a.from, a.to);
    }
});
Element.Properties.tween = {
    set: function (a) {
        var b = this.retrieve("tween");
        if (b) {
            b.cancel();
        }
        return this.eliminate("tween").store("tween:options", $extend({
            link: "cancel"
        }, a));
    },
    get: function (a) {
        if (a || !this.retrieve("tween")) {
            if (a || !this.retrieve("tween:options")) {
                this.set("tween", a);
            }
            this.store("tween", new Fx.Tween(this, this.retrieve("tween:options")));
        }
        return this.retrieve("tween");
    }
};
Element.implement({
    tween: function (a, c, b) {
        this.get("tween").start(arguments);
        return this;
    },
    fade: function (c) {
        var e = this.get("tween"),
            d = "opacity",
            a;
        c = $pick(c, "toggle");
        switch (c) {
            case "in":
                e.start(d, 1);
                break;
            case "out":
                e.start(d, 0);
                break;
            case "show":
                e.set(d, 1);
                break;
            case "hide":
                e.set(d, 0);
                break;
            case "toggle":
                var b = this.retrieve("fade:flag", this.get("opacity") == 1);
                e.start(d, (b) ? 0 : 1);
                this.store("fade:flag", !b);
                a = true;
                break;
            default:
                e.start(d, arguments);
            }
        if (!a) {
                this.eliminate("fade:flag");
            }
        return this;
    },
    highlight: function (c, a) {
        if (!a) {
            a = this.retrieve("highlight:original", this.getStyle("background-color"));
            a = (a == "transparent") ? "#fff" : a;
        }
        var b = this.get("tween");
        b.start("background-color", c || "#ffff88", a).chain(function () {
            this.setStyle("background-color", this.retrieve("highlight:original"));
            b.callChain();
        }.bind(this));
        return this;
    }
});
Fx.Morph = new Class({
    Extends: Fx.CSS,
    initialize: function (b, a) {
        this.element = this.subject = document.id(b);
        this.parent(a);
    },
    set: function (a) {
        if (typeof a == "string") {
            a = this.search(a);
        }
        for (var b in a) {
            this.render(this.element, b, a[b], this.options.unit);
        }
        return this;
    },
    compute: function (e, d, c) {
        var a = {};
        for (var b in e) {
            a[b] = this.parent(e[b], d[b], c);
        }
        return a;
    },
    start: function (b) {
        if (!this.check(b)) {
            return this;
        }
        if (typeof b == "string") {
            b = this.search(b);
        }
        var e = {},
            d = {};
        for (var c in b) {
                var a = this.prepare(this.element, c, b[c]);
                e[c] = a.from;
                d[c] = a.to;
            }
        return this.parent(e, d);
    }
});
Element.Properties.morph = {
    set: function (a) {
        var b = this.retrieve("morph");
        if (b) {
            b.cancel();
        }
        return this.eliminate("morph").store("morph:options", $extend({
            link: "cancel"
        }, a));
    },
    get: function (a) {
        if (a || !this.retrieve("morph")) {
            if (a || !this.retrieve("morph:options")) {
                this.set("morph", a);
            }
            this.store("morph", new Fx.Morph(this, this.retrieve("morph:options")));
        }
        return this.retrieve("morph");
    }
};
Element.implement({
    morph: function (a) {
        this.get("morph").start(a);
        return this;
    }
});
Fx.implement({
    getTransition: function () {
        var a = this.options.transition || Fx.Transitions.Sine.easeInOut;
        if (typeof a == "string") {
            var b = a.split(":");
            a = Fx.Transitions;
            a = a[b[0]] || a[b[0].capitalize()];
            if (b[1]) {
                a = a["ease" + b[1].capitalize() + (b[2] ? b[2].capitalize() : "")];
            }
        }
        return a;
    }
});
Fx.Transition = function (b, a) {
    a = $splat(a);
    return $extend(b, {
        easeIn: function (c) {
            return b(c, a);
        },
        easeOut: function (c) {
            return 1 - b(1 - c, a);
        },
        easeInOut: function (c) {
            return (c <= 0.5) ? b(2 * c, a) / 2 : (2 - b(2 * (1 - c), a)) / 2;
        }
    });
};
Fx.Transitions = new Hash({
    linear: $arguments(0)
});
Fx.Transitions.extend = function (a) {
    for (var b in a) {
        Fx.Transitions[b] = new Fx.Transition(a[b]);
    }
};
Fx.Transitions.extend({
    Pow: function (b, a) {
        return Math.pow(b, a[0] || 6);
    },
    Expo: function (a) {
        return Math.pow(2, 8 * (a - 1));
    },
    Circ: function (a) {
        return 1 - Math.sin(Math.acos(a));
    },
    Sine: function (a) {
        return 1 - Math.sin((1 - a) * Math.PI / 2);
    },
    Back: function (b, a) {
        a = a[0] || 1.618;
        return Math.pow(b, 2) * ((a + 1) * b - a);
    },
    Bounce: function (f) {
        var e;
        for (var d = 0, c = 1; 1; d += c, c /= 2) {
            if (f >= (7 - 4 * d) / 11) {
                e = c * c - Math.pow((11 - 6 * d - 11 * f) / 4, 2);
                break;
            }
        }
        return e;
    },
    Elastic: function (b, a) {
        return Math.pow(2, 10 * --b) * Math.cos(20 * b * Math.PI * (a[0] || 1) / 3);
    }
});
["Quad", "Cubic", "Quart", "Quint"].each(function (b, a) {
    Fx.Transitions[b] = new Fx.Transition(function (c) {
        return Math.pow(c, [a + 2]);
    });
});
var Request = new Class({
    Implements: [Chain, Events, Options],
    options: {
        url: "",
        data: "",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "text/javascript, text/html, application/xml, text/xml, */*"
        },
        async: true,
        format: false,
        method: "post",
        link: "ignore",
        isSuccess: null,
        emulation: true,
        urlEncoded: true,
        encoding: "utf-8",
        evalScripts: false,
        evalResponse: false,
        noCache: false
    },
    initialize: function (a) {
        this.xhr = new Browser.Request();
        this.setOptions(a);
        this.options.isSuccess = this.options.isSuccess || this.isSuccess;
        this.headers = new Hash(this.options.headers);
    },
    onStateChange: function () {
        if (this.xhr.readyState != 4 || !this.running) {
            return;
        }
        this.running = false;
        this.status = 0;
        $try(function () {
            this.status = this.xhr.status;
        }.bind(this));
        this.xhr.onreadystatechange = $empty;
        if (this.options.isSuccess.call(this, this.status)) {
            this.response = {
                text: this.xhr.responseText,
                xml: this.xhr.responseXML
            };
            this.success(this.response.text, this.response.xml);
        } else {
            this.response = {
                text: null,
                xml: null
            };
            this.failure();
        }
    },
    isSuccess: function () {
        return ((this.status >= 200) && (this.status < 300));
    },
    processScripts: function (a) {
        if (this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader("Content-type"))) {
            return $exec(a);
        }
        return a.stripScripts(this.options.evalScripts);
    },
    success: function (b, a) {
        this.onSuccess(this.processScripts(b), a);
    },
    onSuccess: function () {
        this.fireEvent("complete", arguments).fireEvent("success", arguments).callChain();
    },
    failure: function () {
        this.onFailure();
    },
    onFailure: function () {
        this.fireEvent("complete").fireEvent("failure", this.xhr);
    },
    setHeader: function (a, b) {
        this.headers.set(a, b);
        return this;
    },
    getHeader: function (a) {
        return $try(function () {
            return this.xhr.getResponseHeader(a);
        }.bind(this));
    },
    check: function () {
        if (!this.running) {
            return true;
        }
        switch (this.options.link) {
        case "cancel":
            this.cancel();
            return true;
        case "chain":
            this.chain(this.caller.bind(this, arguments));
            return false;
        }
        return false;
    },
    send: function (k) {
        if (!this.check(k)) {
            return this;
        }
        this.running = true;
        var i = $type(k);
        if (i == "string" || i == "element") {
            k = {
                data: k
            };
        }
        var d = this.options;
        k = $extend({
            data: d.data,
            url: d.url,
            method: d.method
        }, k);
        var g = k.data,
            b = String(k.url),
            a = k.method.toLowerCase();
        switch ($type(g)) {
            case "element":
                g = document.id(g).toQueryString();
                break;
            case "object":
            case "hash":
                g = Hash.toQueryString(g);
            }
        if (this.options.format) {
                var j = "format=" + this.options.format;
                g = (g) ? j + "&" + g : j;
            }
        if (this.options.emulation && !["get", "post"].contains(a)) {
                var h = "_method=" + a;
                g = (g) ? h + "&" + g : h;
                a = "post";
            }
        if (this.options.urlEncoded && a == "post") {
                var c = (this.options.encoding) ? "; charset=" + this.options.encoding : "";
                this.headers.set("Content-type", "application/x-www-form-urlencoded" + c);
            }
        if (this.options.noCache) {
                var f = "noCache=" + new Date().getTime();
                g = (g) ? f + "&" + g : f;
            }
        var e = b.lastIndexOf("/");
        if (e > -1 && (e = b.indexOf("#")) > -1) {
                b = b.substr(0, e);
            }
        if (g && a == "get") {
                b = b + (b.contains("?") ? "&" : "?") + g;
                g = null;
            }
        this.xhr.open(a.toUpperCase(), b, this.options.async);
        this.xhr.onreadystatechange = this.onStateChange.bind(this);
        this.headers.each(function (m, l) {
                try {
                    this.xhr.setRequestHeader(l, m);
                } catch (n) {
                    this.fireEvent("exception", [l, m]);
                }
            }, this);
        this.fireEvent("request");
        this.xhr.send(g);
        if (!this.options.async) {
                this.onStateChange();
            }
        return this;
    },
    cancel: function () {
        if (!this.running) {
            return this;
        }
        this.running = false;
        this.xhr.abort();
        this.xhr.onreadystatechange = $empty;
        this.xhr = new Browser.Request();
        this.fireEvent("cancel");
        return this;
    }
});
(function () {
    var a = {};
    ["get", "post", "put", "delete", "GET", "POST", "PUT", "DELETE"].each(function (b) {
        a[b] = function () {
            var c = Array.link(arguments, {
                url: String.type,
                data: $defined
            });
            return this.send($extend(c, {
                method: b
            }));
        };
    });
    Request.implement(a);
})();
Element.Properties.send = {
    set: function (a) {
        var b = this.retrieve("send");
        if (b) {
            b.cancel();
        }
        return this.eliminate("send").store("send:options", $extend({
            data: this,
            link: "cancel",
            method: this.get("method") || "post",
            url: this.get("action")
        }, a));
    },
    get: function (a) {
        if (a || !this.retrieve("send")) {
            if (a || !this.retrieve("send:options")) {
                this.set("send", a);
            }
            this.store("send", new Request(this.retrieve("send:options")));
        }
        return this.retrieve("send");
    }
};
Element.implement({
    send: function (a) {
        var b = this.get("send");
        b.send({
            data: this,
            url: a || b.options.url
        });
        return this;
    }
});
Request.HTML = new Class({
    Extends: Request,
    options: {
        update: false,
        append: false,
        evalScripts: true,
        filter: false
    },
    processHTML: function (c) {
        var b = c.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        c = (b) ? b[1] : c;
        var a = new Element("div");
        return $try(function () {
            var d = "<root>" + c + "</root>",
                g;
            if (Browser.Engine.trident) {
                    g = new ActiveXObject("Microsoft.XMLDOM");
                    g.async = false;
                    g.loadXML(d);
                } else {
                    g = new DOMParser().parseFromString(d, "text/xml");
                }
            d = g.getElementsByTagName("root")[0];
            if (!d) {
                    return null;
                }
            for (var f = 0, e = d.childNodes.length; f < e; f++) {
                    var h = Element.clone(d.childNodes[f], true, true);
                    if (h) {
                        a.grab(h);
                    }
                }
            return a;
        }) || a.set("html", c);
    },
    success: function (d) {
        var c = this.options,
            b = this.response;
        b.html = d.stripScripts(function (e) {
                b.javascript = e;
            });
        var a = this.processHTML(b.html);
        b.tree = a.childNodes;
        b.elements = a.getElements("*");
        if (c.filter) {
                b.tree = b.elements.filter(c.filter);
            }
        if (c.update) {
                document.id(c.update).empty().set("html", b.html);
            } else {
                if (c.append) {
                    document.id(c.append).adopt(a.getChildren());
                }
            }
        if (c.evalScripts) {
                $exec(b.javascript);
            }
        this.onSuccess(b.tree, b.elements, b.html, b.javascript);
    }
});
Element.Properties.load = {
    set: function (a) {
        var b = this.retrieve("load");
        if (b) {
            b.cancel();
        }
        return this.eliminate("load").store("load:options", $extend({
            data: this,
            link: "cancel",
            update: this,
            method: "get"
        }, a));
    },
    get: function (a) {
        if (a || !this.retrieve("load")) {
            if (a || !this.retrieve("load:options")) {
                this.set("load", a);
            }
            this.store("load", new Request.HTML(this.retrieve("load:options")));
        }
        return this.retrieve("load");
    }
};
Element.implement({
    load: function () {
        this.get("load").send(Array.link(arguments, {
            data: Object.type,
            url: String.type
        }));
        return this;
    }
});
Request.JSON = new Class({
    Extends: Request,
    options: {
        secure: true
    },
    initialize: function (a) {
        this.parent(a);
        this.headers.extend({
            Accept: "application/json",
            "X-Request": "JSON"
        });
    },
    success: function (a) {
        this.response.json = JSON.decode(a, this.options.secure);
        this.onSuccess(this.response.json, a);
    }
});
MooTools.More = {
    version: "1.2.4.2",
    build: "bd5a93c0913cce25917c48cbdacde568e15e02ef"
};
Fx.Elements = new Class({
    Extends: Fx.CSS,
    initialize: function (b, a) {
        this.elements = this.subject = $$(b);
        this.parent(a);
    },
    compute: function (g, h, j) {
        var c = {};
        for (var d in g) {
            var a = g[d],
                e = h[d],
                f = c[d] = {};
            for (var b in a) {
                    f[b] = this.parent(a[b], e[b], j);
                }
        }
        return c;
    },
    set: function (b) {
        for (var c in b) {
            var a = b[c];
            for (var d in a) {
                this.render(this.elements[c], d, a[d], this.options.unit);
            }
        }
        return this;
    },
    start: function (c) {
        if (!this.check(c)) {
            return this;
        }
        var h = {},
            j = {};
        for (var d in c) {
                var f = c[d],
                    a = h[d] = {},
                    g = j[d] = {};
                for (var b in f) {
                        var e = this.prepare(this.elements[d], b, f[b]);
                        a[b] = e.from;
                        g[b] = e.to;
                    }
            }
        return this.parent(h, j);
    }
});
Fx.Scroll = new Class({
    Extends: Fx,
    options: {
        offset: {
            x: 0,
            y: 0
        },
        wheelStops: true
    },
    initialize: function (b, a) {
        this.element = this.subject = document.id(b);
        this.parent(a);
        var d = this.cancel.bind(this, false);
        if ($type(this.element) != "element") {
            this.element = document.id(this.element.getDocument().body);
        }
        var c = this.element;
        if (this.options.wheelStops) {
            this.addEvent("start", function () {
                c.addEvent("mousewheel", d);
            }, true);
            this.addEvent("complete", function () {
                c.removeEvent("mousewheel", d);
            }, true);
        }
    },
    set: function () {
        var a = Array.flatten(arguments);
        if (Browser.Engine.gecko) {
            a = [Math.round(a[0]), Math.round(a[1])];
        }
        this.element.scrollTo(a[0], a[1]);
    },
    compute: function (c, b, a) {
        return [0, 1].map(function (d) {
            return Fx.compute(c[d], b[d], a);
        });
    },
    start: function (c, g) {
        if (!this.check(c, g)) {
            return this;
        }
        var e = this.element.getScrollSize(),
            b = this.element.getScroll(),
            d = {
                x: c,
                y: g
            };
        for (var f in d) {
                var a = e[f];
                if ($chk(d[f])) {
                    d[f] = ($type(d[f]) == "number") ? d[f] : a;
                } else {
                    d[f] = b[f];
                }
                d[f] += this.options.offset[f];
            }
        return this.parent([b.x, b.y], [d.x, d.y]);
    },
    toTop: function () {
        return this.start(false, 0);
    },
    toLeft: function () {
        return this.start(0, false);
    },
    toRight: function () {
        return this.start("right", false);
    },
    toBottom: function () {
        return this.start(false, "bottom");
    },
    toElement: function (b) {
        var a = document.id(b).getPosition(this.element);
        return this.start(a.x, a.y);
    },
    scrollIntoView: function (c, e, d) {
        e = e ? $splat(e) : ["x", "y"];
        var h = {};
        c = document.id(c);
        var f = c.getPosition(this.element);
        var i = c.getSize();
        var g = this.element.getScroll();
        var a = this.element.getSize();
        var b = {
            x: f.x + i.x,
            y: f.y + i.y
        };
        ["x", "y"].each(function (j) {
            if (e.contains(j)) {
                if (b[j] > g[j] + a[j]) {
                    h[j] = b[j] - a[j];
                }
                if (f[j] < g[j]) {
                    h[j] = f[j];
                }
            }
            if (h[j] == null) {
                h[j] = g[j];
            }
            if (d && d[j]) {
                h[j] = h[j] + d[j];
            }
        }, this);
        if (h.x != g.x || h.y != g.y) {
            this.start(h.x, h.y);
        }
        return this;
    },
    scrollToCenter: function (c, e, d) {
        e = e ? $splat(e) : ["x", "y"];
        c = $(c);
        var h = {},
            f = c.getPosition(this.element),
            i = c.getSize(),
            g = this.element.getScroll(),
            a = this.element.getSize(),
            b = {
                x: f.x + i.x,
                y: f.y + i.y
            };
            ["x", "y"].each(function (j) {
                if (e.contains(j)) {
                    h[j] = f[j] - (a[j] - i[j]) / 2;
                }
                if (h[j] == null) {
                    h[j] = g[j];
                }
                if (d && d[j]) {
                    h[j] = h[j] + d[j];
                }
            }, this);
        if (h.x != g.x || h.y != g.y) {
                this.start(h.x, h.y);
            }
        return this;
    }
});
var Drag = new Class({
    Implements: [Events, Options],
    options: {
        snap: 6,
        unit: "px",
        grid: false,
        style: true,
        limit: false,
        handle: false,
        invert: false,
        preventDefault: false,
        stopPropagation: false,
        modifiers: {
            x: "left",
            y: "top"
        }
    },
    initialize: function () {
        var b = Array.link(arguments, {
            options: Object.type,
            element: $defined
        });
        this.element = document.id(b.element);
        this.document = this.element.getDocument();
        this.setOptions(b.options || {});
        var a = $type(this.options.handle);
        this.handles = ((a == "array" || a == "collection") ? $$(this.options.handle) : document.id(this.options.handle)) || this.element;
        this.mouse = {
            now: {},
            pos: {}
        };
        this.value = {
            start: {},
            now: {}
        };
        this.selection = (Browser.Engine.trident) ? "selectstart" : "mousedown";
        this.bound = {
            start: this.start.bind(this),
            check: this.check.bind(this),
            drag: this.drag.bind(this),
            stop: this.stop.bind(this),
            cancel: this.cancel.bind(this),
            eventStop: $lambda(false)
        };
        this.attach();
    },
    attach: function () {
        this.handles.addEvent("mousedown", this.bound.start);
        return this;
    },
    detach: function () {
        this.handles.removeEvent("mousedown", this.bound.start);
        return this;
    },
    start: function (c) {
        if (c.rightClick) {
            return;
        }
        if (this.options.preventDefault) {
            c.preventDefault();
        }
        if (this.options.stopPropagation) {
            c.stopPropagation();
        }
        this.mouse.start = c.page;
        this.fireEvent("beforeStart", this.element);
        var a = this.options.limit;
        this.limit = {
            x: [],
            y: []
        };
        for (var d in this.options.modifiers) {
            if (!this.options.modifiers[d]) {
                continue;
            }
            if (this.options.style) {
                this.value.now[d] = this.element.getStyle(this.options.modifiers[d]).toInt();
            } else {
                this.value.now[d] = this.element[this.options.modifiers[d]];
            }
            if (this.options.invert) {
                this.value.now[d] *= -1;
            }
            this.mouse.pos[d] = c.page[d] - this.value.now[d];
            if (a && a[d]) {
                for (var b = 2; b--; b) {
                    if ($chk(a[d][b])) {
                        this.limit[d][b] = $lambda(a[d][b])();
                    }
                }
            }
        }
        if ($type(this.options.grid) == "number") {
            this.options.grid = {
                x: this.options.grid,
                y: this.options.grid
            };
        }
        this.document.addEvents({
            mousemove: this.bound.check,
            mouseup: this.bound.cancel
        });
        this.document.addEvent(this.selection, this.bound.eventStop);
    },
    check: function (a) {
        if (this.options.preventDefault) {
            a.preventDefault();
        }
        var b = Math.round(Math.sqrt(Math.pow(a.page.x - this.mouse.start.x, 2) + Math.pow(a.page.y - this.mouse.start.y, 2)));
        if (b > this.options.snap) {
            this.cancel();
            this.document.addEvents({
                mousemove: this.bound.drag,
                mouseup: this.bound.stop
            });
            this.fireEvent("start", [this.element, a]).fireEvent("snap", this.element);
        }
    },
    drag: function (a) {
        if (this.options.preventDefault) {
            a.preventDefault();
        }
        this.mouse.now = a.page;
        for (var b in this.options.modifiers) {
            if (!this.options.modifiers[b]) {
                continue;
            }
            this.value.now[b] = this.mouse.now[b] - this.mouse.pos[b];
            if (this.options.invert) {
                this.value.now[b] *= -1;
            }
            if (this.options.limit && this.limit[b]) {
                if ($chk(this.limit[b][1]) && (this.value.now[b] > this.limit[b][1])) {
                    this.value.now[b] = this.limit[b][1];
                } else {
                    if ($chk(this.limit[b][0]) && (this.value.now[b] < this.limit[b][0])) {
                        this.value.now[b] = this.limit[b][0];
                    }
                }
            }
            if (this.options.grid[b]) {
                this.value.now[b] -= ((this.value.now[b] - (this.limit[b][0] || 0)) % this.options.grid[b]);
            }
            if (this.options.style) {
                this.element.setStyle(this.options.modifiers[b], this.value.now[b] + this.options.unit);
            } else {
                this.element[this.options.modifiers[b]] = this.value.now[b];
            }
        }
        this.fireEvent("drag", [this.element, a]);
    },
    cancel: function (a) {
        this.document.removeEvent("mousemove", this.bound.check);
        this.document.removeEvent("mouseup", this.bound.cancel);
        if (a) {
            this.document.removeEvent(this.selection, this.bound.eventStop);
            this.fireEvent("cancel", this.element);
        }
    },
    stop: function (a) {
        this.document.removeEvent(this.selection, this.bound.eventStop);
        this.document.removeEvent("mousemove", this.bound.drag);
        this.document.removeEvent("mouseup", this.bound.stop);
        if (a) {
            this.fireEvent("complete", [this.element, a]);
        }
    }
});
Element.implement({
    makeResizable: function (a) {
        var b = new Drag(this, $merge({
            modifiers: {
                x: "width",
                y: "height"
            }
        }, a));
        this.store("resizer", b);
        return b.addEvent("drag", function () {
            this.fireEvent("resize", b);
        }.bind(this));
    }
});
var Asset = {
    javascript: function (f, d) {
        d = $extend({
            onload: $empty,
            document: document,
            check: $lambda(true)
        }, d);
        var b = new Element("script", {
            src: f,
            type: "text/javascript"
        });
        var e = d.onload.bind(b),
            a = d.check,
            g = d.document;
        delete d.onload;
        delete d.check;
        delete d.document;
        b.addEvents({
                load: e,
                readystatechange: function () {
                    if (["loaded", "complete"].contains(this.readyState)) {
                        e();
                    }
                }
            }).set(d);
        if (Browser.Engine.webkit419) {
                var c = (function () {
                    if (!$try(a)) {
                        return;
                    }
                    $clear(c);
                    e();
                }).periodical(50);
            }
        return b.inject(g.head);
    },
    css: function (b, a) {
        return new Element("link", $merge({
            rel: "stylesheet",
            media: "screen",
            type: "text/css",
            href: b
        }, a)).inject(document.head);
    },
    image: function (c, b) {
        b = $merge({
            onload: $empty,
            onabort: $empty,
            onerror: $empty
        }, b);
        var d = new Image();
        var a = document.id(d) || new Element("img");
        ["load", "abort", "error"].each(function (e) {
            var f = "on" + e;
            var g = b[f];
            delete b[f];
            d[f] = function () {
                if (!d) {
                    return;
                }
                if (!a.parentNode) {
                    a.width = d.width;
                    a.height = d.height;
                }
                d = d.onload = d.onabort = d.onerror = null;
                g.delay(1, a, a);
                a.fireEvent(e, a, 1);
            };
        });
        d.src = a.src = c;
        if (d && d.complete) {
            d.onload.delay(1);
        }
        return a.set(b);
    },
    images: function (d, c) {
        c = $merge({
            onComplete: $empty,
            onProgress: $empty,
            onError: $empty,
            properties: {}
        }, c);
        d = $splat(d);
        var a = [];
        var b = 0;
        return new Elements(d.map(function (e) {
            return Asset.image(e, $extend(c.properties, {
                onload: function () {
                    c.onProgress.call(this, b, d.indexOf(e));
                    b++;
                    if (b == d.length) {
                        c.onComplete();
                    }
                },
                onerror: function () {
                    c.onError.call(this, b, d.indexOf(e));
                    b++;
                    if (b == d.length) {
                        c.onComplete();
                    }
                }
            }));
        }));
    }
};
Hash.Cookie = new Class({
    Extends: Cookie,
    options: {
        autoSave: true
    },
    initialize: function (b, a) {
        this.parent(b, a);
        this.load();
    },
    save: function () {
        var a = JSON.encode(this.hash);
        if (!a || a.length > 4096) {
            return false;
        }
        if (a == "{}") {
            this.dispose();
        } else {
            this.write(a);
        }
        return true;
    },
    load: function () {
        this.hash = new Hash(JSON.decode(this.read(), true));
        return this;
    }
});
Hash.each(Hash.prototype, function (b, a) {
    if (typeof b == "function") {
        Hash.Cookie.implement(a, function () {
            var c = b.apply(this.hash, arguments);
            if (this.options.autoSave) {
                this.save();
            }
            return c;
        });
    }
});
Window.implement({
    $E: function (selector) {
        return this.document.getElement(selector);
    }
});
Element.implement({
    sendEvent: function (type, event, delay) {
        if (typeof type != 'string') {
            event = type;
            type = event.type;
        }
        event = $extend({
            page: {
                x: 0,
                y: 0
            },
            client: {
                x: 0,
                y: 0
            },
            rightClick: false,
            wheel: 0,
            relatedTarget: null,
            code: 0,
            key: 0,
            shift: false,
            control: false,
            alt: false,
            meta: false
        }, event);
        var bubble = !(event.canBubble === false);
        var isCancelable = !(event.isCancelable === false);
        var cancelled = false;
        event = $extend(event, {
            type: type,
            target: this,
            stop: function () {
                return this.stopPropagation().preventDefault();
            },
            stopPropagation: function () {
                bubble = false;
                return this;
            },
            preventDefault: function () {
                if (isCancelable) {
                    cancelled = true;
                }
                return this;
            }
        });
        var originalTarget = this;
        var tag = this.get('tag');
        var dispatchEvent = function () {
            (Element.DefaultPreActions[tag] || $empty)(type, originalTarget);
            var target = originalTarget;
            do {
                var events = target.retrieve('events');
                if (events && events[type]) {
                    events[type].keys.each(function (fn) {
                        fn.call(target, event);
                    });
                }
                if (target == document) break;
            } while (bubble && ((target = $(target.parentNode)) || (target = document)));
            (Element.DefaultActions[tag] || $empty)(type, originalTarget, cancelled);
        };
        delay ? dispatchEvent.delay(delay) : dispatchEvent();
        return this;
    },
    meGetStyle: function (style, value) {
        value = value || this.getStyle(style);
        if (value.match(/px$/)) return value;
        if (this.runtimeStyle) {
            var left = this.style.left;
            var runtimeStyle = this.runtimeStyle.left;
            this.runtimeStyle.left = this.currentStyle.left;
            this.style.left = value || 0;
            value = this.style.pixelLeft;
            this.style.left = left;
            this.runtimeStyle.left = runtimeStyle;
        } else {
            var sizingDiv = $('sizingDiv');
            if (!sizingDiv) {
                sizingDiv = new Element('div', {
                    id: 'sizingDiv',
                    style: 'visibility: hidden; position: absolute; padding: 0; border: 0; margin: 0'
                }).inject(document.body);
            }
            value = sizingDiv.setStyle('width', value).clientWidth;
        }
        return value + "px";
    }
});
if (Browser.Engine.webkit) Element.Properties.type = {
    set: function (value) {
        (value == undefined) ? this.removeAttribute('type') : this.setAttribute('type', '' + value);
    }
};
Element.DefaultPreActions = {
    input: function (type, el) {
        if (type == 'click' && el.type == 'checkbox') {
            el.checked = !el.checked;
        }
    }
};
Element.DefaultActions = {
    a: function (type, el, cancelled) {
        if (cancelled || type != 'click') {
            return;
        }
        location.href = el.href;
    },
    button: function (type, el, cancelled) {
        if (cancelled) {
            return;
        }
        if (type == 'click' && el.type == 'submit') {
            el.form.fireEvent('submit');
            var data = new Element('input', {
                type: 'hidden',
                name: el.name,
                value: el.value
            }).inject(el.form);
            el.form.submit();
            data.destroy();
        }
        if (type == 'mousedown') {
            el.focus();
        }
    },
    input: function (type, el, cancelled) {
        if (cancelled != (el.type == 'checkbox') || type != 'click') return;
        switch (el.type) {
        case 'checkbox':
            el.checked = !el.checked;
            break;
        case 'radio':
            el.checked = true;
            break;
        case 'submit':
        case 'image':
            el.form.fireEvent('submit');
            var data = new Element('input', {
                type: 'hidden',
                name: el.name,
                value: el.value
            }).inject(el.form);
            el.form.submit();
            data.destroy();
            break;
        case 'reset':
            el.form.reset();
            break;
        default:
            break;
        }
    },
    form: function (type, el, cancelled) {
        if (cancelled) return;
        if (type == 'click' || type == 'submit') {
            el.submit();
        }
        if (type == 'reset') {
            el.reset();
        }
    }
};
var FastMail = {};
FastMail.Preferences = new Hash.Cookie('preferences', {
    duration: 365
});
FastMail.UIEnhancements = {
    autoUpdateServiceSelect: function (root) {
        var changeFunction = function () {
            if (!this.checked) return;
            var priceItems = this.getParent().getElements('ul.priceList li');
            var firstItem = undefined;
            var selectedItem = undefined;
            root.getElements('div.periodItem').each(function (periodItem) {
                var periodRadio = periodItem.getElement('input[type=radio]');
                var foundIndex = -1;
                for (var j = 0; j < priceItems.length; j++) {
                    if (periodItem.get('id') == priceItems[j].get('periodKey')) {
                        foundIndex = j;
                        periodItem.getElement('span.periodText').innerHTML = priceItems[j].innerHTML;
                    }
                }
                if (foundIndex == -1) {
                    periodItem.addClass('hidden');
                    if (periodRadio.checked) {
                        selectedItem = undefined;
                    }
                } else {
                    periodItem.removeClass('hidden');
                    if (periodRadio.checked) {
                        selectedItem = periodRadio;
                    }
                    if (firstItem == undefined) {
                        firstItem = periodRadio;
                    }
                }
            });
            if (selectedItem == undefined) {
                firstItem.checked = true;
            }
        };
        root.getElements('ul.priceList').getParent().getElement('input[type=radio]').addEvent('click', changeFunction).addEvent('keyup', changeFunction).each(function (input) {
            if (input.checked) changeFunction.apply(input);
        });
    },
    autoSubmitOnSelectChange: function (root) {
        root.getElements('button.autoDo').each(function (button) {
            var select = button.getPrevious('select');
            select.addEvent('change', function (event) {
                var confirmText = this.options[this.selectedIndex].getAttribute('confirm');
                if (event && confirmText && !confirm(confirmText)) return this.selectedIndex = 0;
                var className = this.options[this.selectedIndex].className;
                if (className.contains('noAuto')) button.addClass('hidden');
                else if (className.contains('showButton')) button.removeClass('hidden');
                else button.addClass('hidden').sendEvent('click');
                return 0;
            });
            select.getElements('option.disabled').addClass('noAuto');
            if (!select.options[select.selectedIndex].className.contains('showButton')) button.addClass('hidden');
        });
    },
    showActionBarInput: function (root) {
        root.getElements('option.showActionBarInput').each(function (option) {
            var actionBarInput = option.getParent('.actions').getElement('i');
            option.getParent('select').addEvent('change', function () {
                if (option.selected) {
                    actionBarInput.removeClass('hidden');
                    actionBarInput.getElement('input[type=text]').focus();
                }
                else actionBarInput.addClass('hidden');
            });
            if (!option.selected) actionBarInput.addClass('hidden');
        });
    },
    addAdvancedHideShow: function (root) {
        root.getElements('a.addAdvancedHideShow').each(function (advancedLink) {
            var stanzaTable = advancedLink.getParent('table');
            var isHidden = false;
            advancedLink.addEvent('click', function (event) {
                isHidden = !isHidden;
                stanzaTable.getElements('tr.isAdvanced')[isHidden ? 'addClass' : 'removeClass']('hidden');
                advancedLink.set('text', '[' + (isHidden ? "Show" : "Hide") + ' Advanced Options]');
                event.preventDefault();
            }).sendEvent('click');
        });
    },
    addStatefulOptions: function (root) {
        root.getElements('select.statefulOptions').each(function (select) {
            var stanzaTable = select.getParent('table');
            var rows = stanzaTable.getElements('tr[displayOnValues]');
            select.addEvent('change', function () {
                var optionVal = this.options[this.selectedIndex].value;
                rows.each(function (row) {
                    row[row.getAttribute('displayOnValues').split(' ').contains(optionVal) ? 'removeClass' : 'addClass']('hidden');
                });
            }).fireEvent('change');
        });
    },
    setDefaultFocus: function (root) {
        root.getElements('input.defaultFocus').each(function (elem) {
            elem.focus();
        });
    },
    enableTabs: function (root) {
        var tabPosition = new Hash.Cookie('tabs');
        root.getElements('ul.tabs').each(function (tabBar) {
            new Element('li').inject(tabBar).grab(new Element('a', {
                href: '#all' + tabBar.id,
                text: 'Show all'
            }));
            var allTabs = tabBar.getElements('a');
            var tabs = new Elements();
            allTabs.each(function (link, index) {
                link.store('index', index);
                var section = $(link.href.split('#')[1]);
                if (section) tabs.push(link.store('section', section));
            });
            tabBar.addEvent('click', function (event) {
                var target = $(event.target);
                allTabs.removeClass('selected');
                tabs.retrieve('section').addClass('hidden');
                if (event.preventDefault) event.preventDefault();
                var section = target.addClass('selected').retrieve('section');
                section = section || tabs.retrieve('section');
                section.removeClass('hidden');
                tabPosition.set(tabBar.id, target.retrieve('index'));
            });
            var start = tabPosition.get(tabBar.id) || 0;
            tabBar.fireEvent('click', {
                target: allTabs[start] || allTabs[0]
            });
        });
    },
    labelsOverTextBox: function (root) {
        root.getElements('label.overLabel').each(function (label) {
            var input = $(label.htmlFor);
            if (input.value !== '') label.addClass('hidden');
            input.addEvents({
                focus: function () {
                    label.addClass('hidden');
                },
                blur: function () {
                    if (this.value === '') label.removeClass('hidden');
                }
            });
            if (Browser.Engine.webkit419) {
                label.addEvent('click', function () {
                    field.focus();
                });
            }
        });
    },
    autoExpandTextAreas: function (root) {
        root.getElements('textarea.autoExpand').each(function (textarea) {
            new ExpandingTextArea(textarea);
        });
    },
    confirmAction: function (root) {
        root.getElements('a[confirm], button[confirm]').addEvent('click', function () {
            return confirm(this.getAttribute('confirm'));
        });
    },
    linkAsSubmit: function (root) {
        root.getElements('a.submitLink').addEvent('click', function (event) {
            event.stop();
            FastMail.Form.createSignal(FastMail.Form.extractSignal(this.href));
            FastMail.Form.neuterIEButtons();
            try {
                $E('form').fireEvent('submit').submit();
            } catch (e) {}
        });
    },
    disableOnSubmit: function (root) {
        root.getElements('button[disableOnSubmit]').addEvent('click', function () {
            this.set.delay(10, this, ['disabled', true]);
            (this.getElement('div') || this).set('text', this.getAttribute('disableOnSubmit'));
        });
    },
    targetOnEnter: function () {
        document.addEvent('keypress', function (event) {
            var target = event.target;
            if (target && event.key == 'enter' && target.nodeName.toLowerCase() == 'input' && target.get('targetonenter')) {
                event.preventDefault();
                var targetOnEnter;
                while ((targetOnEnter = target.getAttribute('targetonenter')) && (target = $E(targetOnEnter))) {
                    if (target.offsetHeight && (target.nodeName.toLowerCase() == 'textarea' || ['text', 'password'].contains(target.type))) {
                        target.focus();
                        break;
                    }
                    else if (target.nodeName.toLowerCase() == 'button' || target.match('input[type=submit]')) {
                        target.sendEvent('click');
                        break;
                    }
                }
            }
        });
    },
    addNavbarShortcuts: function () {
        $$('#navigation a[kbshortcut]').each(function (section) {
            KeyboardShortcuts.Actions.set(section.get('kbshortcut'), function (event, modifier) {
                if (modifier) return;
                section.sendEvent('click');
            });
        });
    },
    fixHeightWrapperScroll: function () {
        $('heightWrapper').addEvent('scroll', function () {
            this.scrollTop = 0;
        });
    }
};
FastMail.enhanceWaiting = false;
FastMail.enhance = function (root) {
    var isDoc = (root == document);
    var f = FastMail.UIEnhancements;
    var jsf = FastMail.jsFeatures;
    if (jsf.get('autoUpdateServiceSelect')) f.autoUpdateServiceSelect(root);
    if (jsf.get('autoSubmitOnSelectChange')) f.autoSubmitOnSelectChange(root);
    if (jsf.get('showActionBarInput')) f.showActionBarInput(root);
    if (jsf.get('addAdvancedHideShow')) f.addAdvancedHideShow(isDoc ? $('main') : root);
    if (jsf.get('addStatefulOptions')) f.addStatefulOptions(root);
    if (jsf.get('setDefaultFocus')) f.setDefaultFocus(root);
    if (jsf.get('enableTabs')) f.enableTabs(root);
    if (!isDoc && FastMail.enhanceWaiting) return;
    (function () {
        f.labelsOverTextBox(root);
        f.autoExpandTextAreas(root);
        f.confirmAction(root);
        f.linkAsSubmit(root);
        f.disableOnSubmit(root);
        if (isDoc) FastMail.enhanceWaiting = false;
    }).delay(1);
    if (isDoc) FastMail.enhanceWaiting = true;
};
FastMail.alert = function (message) {
    var growl = new Notifications();
    FastMail.alert = function (message) {
        growl.alert(message);
    };
    FastMail.alert(message);
};
FastMail.Form = {
    createSignal: function (signal, args) {
        var form = $E('form');
        if (!form) return undefined;
        var input = $('submitSignal');
        if (!input) {
            input = new Element('input', {
                id: 'submitSignal',
                type: 'hidden',
                name: 'MSignal'
            }).inject(form);
            FastMail.Form.onButtonClick(form, function (b) {
                input.destroy();
            }, 1);
        }
        input.value = signal + '*' + (args ? '*' + $splat(args).join('*') : '');
        return input;
    },
    removeSignal: function (signal) {
        signal.destroy();
    },
    extractSignal: function (url) {
        var signal = /[&;]MSignal=([^;]+)/.exec(url);
        return signal ? decodeURIComponent(signal[1]) : null;
    },
    onButtonClick: function (form, cb, remove) {
        form.addEvent('click', function (event) {
            var target = event.target;
            if ($(target).nodeName.toLowerCase() == 'button' || (target = target.getParent('button'))) {
                cb(target);
                if (remove) form.removeEvent('click', cb);
            }
        });
    },
    fixIEButtons: function () {
        if (!Browser.Engine.trident4 && !Browser.Engine.trident5) return;
        var form = $E('form');
        if (!form) return;
        var input = $('ieNeuteredSignal');
        if (!input) {
            input = new Element('input', {
                id: 'ieNeuteredSignal',
                type: 'hidden'
            }).inject(form);
            FastMail.Form.onButtonClick(form, function (b) {
                FastMail.Form.neuterIEButtons();
                input.name = b.retrieve('name');
                input.value = b.value;
            }, 0);
        }
    },
    neuterIEButtons: function () {
        FastMail.Form.neuterIEButtons = function () {};
        if (!Browser.Engine.trident || Browser.Engine.trident6) return;
        $$('button').each(function (button) {
            button.store('name', button.name);
            button.removeAttribute('name');
        });
    }
};
FastMail.Services = {
    addAutoCompleteAddresses: function () {
        if (!Browser.Features.xhr) return;
        var inputs = Array.slice(arguments);
        new FastMail.Request({
            method: 'get'
        }).send({
            signal: 'MsgCompose-GetAddressBook',
            onSuccess: function (data) {
                var addresses = [];
                data.contacts.each(function (contact) {
                    contact.emails.each(function (email) {
                        addresses.push({
                            name: (contact.name ? contact.name + ' ' : '') + (contact.nickname ? '(' + contact.nickname + ') ' : '') + (contact.isglobal ? '(global) ' : '') + '<' + email + '>',
                            value: (contact.name ? '"' + contact.name + '" ' : '') + '<' + email + '>'
                        });
                    });
                });
                data.groups.each(function (group) {
                    addresses.push({
                        name: (group.name ? group.name + ' ' : '') + (group.nickname ? '(' + group.nickname + ') ' : '') + '<group>',
                        value: group.emails.join(', ')
                    });
                });
                inputs.each(function (input) {
                    input.addData(addresses);
                });
                FastMail.Services.addAutoCompleteAddresses = function () {
                    Array.each(arguments, function (input) {
                        input.addData(addresses);
                    });
                };
            }
        });
    }
};
FastMail.Request = new Class({
    Extends: Request.JSON,
    initialize: function (options) {
        var hiddenFields = new Hash(),
            screenState = new Hash(),
            formHiddenState = new Hash();
        $E('form').getElements('input[type=hidden]').each(function (input) {
                var name = input.name;
                if (!name) return;
                var putHash = hiddenFields;
                var firstChar = name.charAt(0);
                if (name.match(/^M(?:Signal|LS)/) || firstChar == '_') {
                    return;
                }
                else if (firstChar == 'S' || name == 'MSS') {
                    putHash = screenState;
                }
                else if (firstChar == 'F') {
                    putHash = formHiddenState;
                }
                putHash.set(name, input.value);
            });
        this.parent($extend({
                url: $E('form').get('action'),
                link: 'cancel',
                hiddenFields: hiddenFields,
                screenState: screenState,
                formHiddenState: formHiddenState
            }, options));
    },
    send: function (options) {
        var data = new Hash(this.options.hiddenFields);
        if (options.includeScreenState) data.extend(this.options.screenState);
        if (options.includeFormHiddenState) data.extend(this.options.formHiddenState);
        if (options.signal) data.set('MSignal', options.signal + '*' + (options.args ? '*' + $splat(options.args).join('*') : ''));
        if (options.extraData) data.extend(options.extraData);
        if (options.includeFormState) {
            var ifs = options.includeFormState;
            $E('form').getElements('[name^=F]:not([type=file]):not([type=hidden])').each(function (field) {
                if (ifs === true || ifs.contains(field) || ifs.contains(field.name)) {
                    if ((field.type == "checkbox" || field.type == "radio") && !field.checked) return;
                    data.set(field.name, field.value);
                }
            });
        }
        var method = options.method || this.options.method;
        if (method != 'post') data.erase('Mnonce');
        if (options.excludeState) options.excludeState.each(function (name) {
            data.erase(name);
        });
        if (options.timeout) var timeout = this.fireEvent.delay(options.timeout, this, 'timeout');
        this.addEvents({
            success: function (data, text) {
                $clear(timeout);
                if (!this.getHeader('Content-Type').contains('application/json') || !data || data.error !== false) {
                    (options.onFailure || $empty).apply(options, arguments);
                } else {
                    delete data['error'];
                    (options.onSuccess || $empty)(data);
                }
                this.removeEvents();
            }.bind(this),
            failure: function () {
                $clear(timeout);
                (options.onFailure || $empty).apply(options, arguments);
                this.removeEvents();
            }.bind(this),
            timeout: function () {
                options.onTimeout(this);
            }.bind(this),
            cancel: function () {
                $clear(timeout);
                (options.onCancel || $empty)();
                (options.onComplete || $empty)();
                this.removeEvents();
            }.bind(this),
            complete: function () {
                (options.onComplete || $empty)();
            }
        });
        this.parent({
            data: data,
            method: method
        });
    }
});
var Notifications = new Class({
    Implements: Options,
    options: {
        duration: 5000
    },
    initialize: function (options) {
        this.setOptions(options);
        this.messages = [];
    },
    createContainer: function () {
        if (this.container) return;
        this.container = new Element('div', {
            styles: {
                position: Browser.Engine.trident4 ? 'absolute' : 'fixed',
                top: '10px',
                right: '10px',
                zIndex: '1000'
            }
        }).inject(document.body);
        if (Browser.Engine.trident4) {
            var that = this;
            var reposition = function () {
                that.container.setStyle('top', window.getScrollTop() + 10 + 'px');
            };
            window.addEvents({
                scroll: reposition,
                resize: reposition
            });
        }
    },
    alert: function (data) {
        this.createContainer();
        var message = new Element('div', {
            'class': 'notification',
            opacity: 0
        });
        if (data.title) message.grab(new Element('h4', {
            html: data.title
        }));
        if (data.body) message.grab(new Element('p', {
            html: data.body
        }));
        message.set('morph', {
            link: 'cancel',
            duration: 400
        });
        var remove = this.remove.bind(this, message);
        this.messages.push(message.addEvent('click', remove));
        if (this.options.duration) {
            var over = false;
            var trigger = (function () {
                trigger = null;
                if (!over) remove();
            }).delay(this.options.duration);
            message.addEvents({
                mouseenter: function () {
                    over = true;
                },
                mouseleave: function () {
                    over = false;
                    if (!trigger) remove();
                }
            });
        }
        message.inject(this.container).morph({
            opacity: 0.75
        });
        return message;
    },
    remove: function (message) {
        var index = this.messages.indexOf(message);
        if (index == -1) return this;
        this.messages.splice(index, 1);
        message.removeEvents();
        message.morph({
            opacity: 0,
            marginBottom: 0,
            marginTop: -message.getHeight()
        }).get('morph').chain(message.destroy.bind(message));
        return this;
    },
    empty: function () {
        while (this.items.length)
        this.remove(this.items[0]);
        return this;
    }
});
Element.NativeEvents.paste = 2;
Element.Properties.selection = {
    get: function () {
        if (typeof(this.selectionStart) == "undefined" && this.createTextRange) {
            var range = document.selection.createRange();
            var stored_range = range.duplicate();
            if (this.nodeName.toLowerCase() == 'textarea') stored_range.moveToElementText(this);
            else stored_range.expand('textedit');
            stored_range.setEndPoint('EndToEnd', range);
            var start = stored_range.text.stripCr().length - range.text.stripCr().length;
            var end = start + range.text.stripCr().length;
            return {
                start: start,
                end: end
            };
        } else return {
            start: this.selectionStart,
            end: this.selectionEnd
        };
    },
    set: function (start, end) {
        end = $pick(end, start);
        if (typeof(this.selectionStart) == "undefined" && this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        } else {
            this.focus();
            this.setSelectionRange(start, end);
        }
        return this;
    }
};
String.implement({
    escapeHTMLEntities: function () {
        return this.split('&').join('&amp;').split('"').join('&quot;').split("'").join('&#039;').split('<').join('&lt;').split('>').join('&gt;');
    },
    unescapeHTMLEntities: function () {
        return this.split('&quot;').join('"').split('&#039;').join("'").split('&lt;').join('<').split('&gt;').join('>').split('&amp;').join('&');
    },
    stripCr: function () {
        return this.replace(/\r/g, '');
    },
    sliceSelection: function (s) {
        var str = Browser.Engine.presto ? this : this.stripCr();
        var parts = [str.slice(0, s.start), str.slice(s.start, s.end), str.slice(s.end)];
        if (Browser.Engine.presto) parts.each(function (item, i) {
            parts[i] = item.stripCr();
        });
        return parts;
    },
    selectionLength: function () {
        return Browser.Engine.presto ? this.replace(/\n/g, "\r\n").length : this.length;
    }
});
var ExpandingTextArea = new Class({
    initialize: function (textarea) {
        this.textarea = $(textarea).addClass('autoExpand');
        this.minHeight = Math.max(textarea.offsetHeight - textarea.getStyle('borderTopWidth').toInt() - textarea.getStyle('borderBottomWidth').toInt() - textarea.getStyle('paddingTop').toInt() - textarea.getStyle('paddingBottom').toInt(), 40);
        if (Browser.Engine.trident) {
            (function () {
                if (this.textarea.hasClass('hidden')) return;
                this.textarea.style.height = Math.max(this.textarea.scrollHeight, this.minHeight) + 'px';
            }).periodical(200, this);
            return this;
        }
        this.ghost = new Element('div', {
            'styles': textarea.getStyles('font-family', 'font-size', 'font-weight', 'font-variant', 'line-height', 'text-indent'),
            'class': 'textAreaGhost'
        }).inject(document.body);
        if (!this.ghost.getStyle('font-size').toInt()) this.ghost.setStyle('font-size', '');
        if (Browser.Engine.presto) {
            this.extraWidth = textarea.getStyle('border-left-width').toInt() + textarea.getStyle('border-right-width').toInt() + textarea.getStyle('padding-left').toInt() + textarea.getStyle('padding-right').toInt();
        } else if (Browser.Engine.webkit) {
            this.extraWidth = 6;
        } else {
            this.extraWidth = 0;
        }
        this.extraSpace = Browser.Engine.webkit ? '' : ' ';
        this.autoExpand.periodical(200, this);
        return this;
    },
    autoExpand: function () {
        if (this.textarea.hasClass('hidden')) return;
        this.ghost.style.display = this.textarea.getStyle('display');
        this.ghost.style.width = (this.textarea.scrollWidth - this.extraWidth) + 'px';
        this.ghost.set('text', this.textarea.value + this.extraSpace);
        this.textarea.style.height = Math.max(this.ghost.offsetHeight, this.minHeight) + 'px';
    }
});
var ExpandingTextBox = new Class({
    initialize: function (input) {
        this.el = $(input);
        this.ghost = new Element('div', {
            styles: this.el.getStyles('font-family', 'font-size', 'font-weight'),
            'class': 'inputGhost'
        }).inject(document.body);
        if (!this.ghost.getStyle('font-size').toInt()) this.ghost.setStyle('font-size', '');
        var that = this,
            cache;

        function autoExpand() {
                if (cache != that.el.value) {
                    that.ghost.set('text', that.el.value);
                    that.el.style.width = (that.ghost.offsetWidth + 31) + 'px';
                    cache = that.el.value;
                }
            }
        this.el.addEvents({
                keyup: autoExpand,
                change: autoExpand,
                paste: autoExpand,
                focus: autoExpand
            });
        autoExpand();
    },
    cancel: function () {
        this.el.removeEvents('keyup').removeEvents('change').removeEvents('paste').removeEvents('focus');
        this.ghost.destroy();
    }
});
var TokenisingTextBox = new Class({
    Implements: Options,
    options: {
        className: 'token'
    },
    initialize: function (element, options) {
        this.input = $(element).setStyle('display', 'none');
        this.setOptions(options);
        this.inputProperties = this.input.getProperties('targetonenter');
        this.maininput = this.createInput(this.input.get('value'));
        this.tabindex = this.input.get('tabindex');
        this.input.removeAttribute('tabindex');
        this.maininput.retrieve('input').set('tabindex', this.tabindex || '');
        var id = this.input.get('id');
        this.input.set('id', id + '-original');
        this.maininput.retrieve('input').set('id', id);
        this.maininput.retrieve('input').set('class', this.input.get('class'));
        var that = this;
        this.holder = new Element('ul', {
            id: id + '-holder',
            'class': 'holder',
            events: {
                click: function (e) {
                    var el = $(e.target);
                    switch (el.nodeName.toLowerCase()) {
                    case 'input':
                        break;
                    case 'li':
                        if (el.retrieve('type') == 'box') that.focusBox(el);
                        break;
                    case 'a':
                    case 'span':
                        e.preventDefault();
                        that.destroyBox(el.getParent('li'));
                        break;
                    default:
                        var input = that.maininput.retrieve('input');
                        input.set('selection', input.value.length);
                        break;
                    }
                },
                dblclick: function (e) {
                    var li = $(e.target);
                    if (li.nodeName.toLowerCase() == 'li' && li.retrieve('type') == 'box') that.destroyBox(li, li.retrieve('value'));
                },
                change: function (e) {
                    if ($(e.target).nodeName.toLowerCase() != 'input') e.target = that.focussedInput;
                    var li = e.target.retrieve('li');
                    if (li.retrieve('cacheValue') != e.target.value) li.store('cacheValue', that.parse(li));
                },
                paste: function (e) {
                    if (e.target.nodeName.toLowerCase() == 'input') {
                        var li = $(e.target).retrieve('li');
                        li.store('cacheValue', that.parse.delay(1, that, [li, true]));
                    }
                },
                keyup: function (e) {
                    if (e.target.nodeName.toLowerCase() != 'input') return;
                    var li = $(e.target).retrieve('li');
                    if (li.retrieve('cacheValue') != e.target.value) li.store('cacheValue', that.parse(li));
                },
                keydown: function (e) {
                    var el = $(e.target);
                    if (el.nodeName.toLowerCase() != 'input') return true;
                    var li = el.retrieve('li');
                    var focusDirection;
                    if (e.key == 'a' && (e.meta || e.control)) {
                        e.stop();
                        while (li && (li = li.getPrevious('li.token-box'))) {
                            if (li.getPrevious().retrieve('input').value) break;
                        }
                        li = li || that.holder.getFirst('li').getNext();
                        that.focusBox(li);
                        while (li && (li = li.getNext('li.token-box')) && !li.getPrevious().retrieve('input').value)
                        li.addClass('focussed');
                        that.focusBox();
                        that.focusInput.store('direction', 'right');
                        return true;
                    }
                    var selection = el.get('selection');
                    if (selection.start !== selection.end) return true;
                    if (selection.end === 0 && li.getPrevious()) {
                        switch (e.key) {
                        case 'backspace':
                            e.stop();
                            that.focusInput.store('direction', 'left');
                            that.focusBox(li.getPrevious());
                            break;
                        case 'left':
                            e.stop();
                            if (e.shift && !e.meta) {
                                that.focusInput.store('direction', 'left');
                                that.focusBox(li.getPrevious());
                                break;
                            }
                            else if (!e.meta) {
                                var prev = li.getPrevious().getPrevious().retrieve('input');
                                prev.set('selection', prev.value.length);
                                break;
                            }
                        case 'home':
                            focusDirection = 'getPrevious';
                            that.focusInput.store('direction', 'left');
                            break;
                        default:
                            break;
                        }
                    }
                    if (selection.start == el.value.length && li.getNext()) {
                        switch (e.key) {
                        case 'delete':
                            e.stop();
                            that.focusInput.store('direction', 'right');
                            that.focusBox(li.getNext());
                            break;
                        case 'right':
                            e.stop();
                            if (e.shift && !e.meta) {
                                that.focusInput.store('direction', 'right');
                                that.focusBox(li.getNext());
                                break;
                            }
                            else if (!e.meta) {
                                li.getNext('li.token-input').retrieve('input').set('selection', 0);
                                break;
                            }
                        case 'end':
                            focusDirection = 'getNext';
                            that.focusInput.store('direction', 'right');
                            break;
                        default:
                            break;
                        }
                    }
                    if (focusDirection) {
                        e.preventDefault();
                        if (e.shift) {
                            while (li && (li = li[focusDirection]('li.token-box'))) {
                                li.addClass('focussed');
                                if (li[focusDirection]().retrieve('input').value) break;
                            }
                            that.focusBox();
                            return true;
                        }
                        if (focusDirection == 'getPrevious') return that.holder.getFirst('li').retrieve('input').set('selection', 0);
                        else return that.maininput.retrieve('input').set('selection', that.maininput.retrieve('input').value.length);
                    }
                }
            }
        }).inject(this.input, 'before').adopt(this.maininput);
        var monitor;
        this.focusInput = new Element('input', {
            type: 'text',
            styles: {
                'position': 'absolute',
                'left': '-2000px'
            },
            events: {
                blur: function () {
                    $clear(monitor);
                    this.holder.getElements('li.focussed').removeClass('focussed');
                    this.focusInput.erase('value');
                    this.focusInput.eliminate('direction');
                }.bind(this),
                focus: function () {
                    monitor = (function () {
                        var focussed;
                        if (this.focusInput.value !== this.focusInput.retrieve('value') && (focussed = this.holder.getElements('li.focussed'))) this.destroyBox(focussed, this.focusInput.value);
                    }).periodical(200, this);
                }.bind(this),
                keydown: function (e) {
                    e.stopPropagation();
                    var prev, next, first, last, input;
                    switch (e.key) {
                    case 'left':
                        this.focusInput.store('direction', this.focusInput.retrieve('direction') || 'left');
                        if (e.shift) {
                            if (this.focusInput.retrieve('direction') == 'left') {
                                prev = this.holder.getFirst('li.focussed');
                                if (prev && (prev = prev.getPrevious('li.token-box'))) {
                                    if (prev.getNext().retrieve('input').value) return;
                                    this.focusBox(prev);
                                }
                            }
                            else {
                                last = this.holder.getLast('li.focussed').removeClass('focussed');
                                this.focusBox();
                                if (!this.holder.getElement('li.focussed')) {
                                    input = last.getPrevious().retrieve('input');
                                    input.set('selection', input.value.length);
                                }
                            }
                        }
                        else {
                            prev = this.holder.getFirst('li.focussed');
                            if (prev) {
                                input = prev.getPrevious().retrieve('input');
                                input.set('selection', input.value.length);
                            }
                        }
                        e.preventDefault();
                        break;
                    case 'right':
                        this.focusInput.store('direction', this.focusInput.retrieve('direction') || 'right');
                        if (e.shift) {
                            if (this.focusInput.retrieve('direction') == 'right') {
                                next = this.holder.getLast('li.focussed');
                                if (next && (next = next.getNext('li.token-box'))) {
                                    if (next.getPrevious().retrieve('input').value) return;
                                    this.focusBox(next);
                                }
                            }
                            else {
                                first = this.holder.getFirst('li.focussed');
                                if (first) first.removeClass('focussed');
                                this.focusBox();
                                if (!this.holder.getElement('li.focussed') && first) first.getNext().retrieve('input').set('selection', 0);
                            }
                        }
                        else {
                            next = this.holder.getLast('li.focussed');
                            if (next) next.getNext().retrieve('input').set('selection', 0);
                        }
                        e.preventDefault();
                        break;
                    case 'home':
                        if (e.shift) {
                            prev = this.holder.getFirst('li.focussed');
                            while (prev && (prev = prev.getPrevious('li.token-box')) && !prev.getNext().retrieve('input').value)
                            prev.addClass('focussed');
                            this.focusBox();
                        }
                        else this.holder.getFirst('li').retrieve('input').set('selection', 0);
                        e.preventDefault();
                        break;
                    case 'end':
                        if (e.shift) {
                            next = this.holder.getLast('li.focussed');
                            while (next && (next = next.getNext('li.token-box')) && !next.getPrevious().retrieve('input').value)
                            next.addClass('focussed');
                            this.focusBox();
                        }
                        else this.maininput.retrieve('input').set('selection', this.maininput.retrieve('input').value.length);
                        e.preventDefault();
                        break;
                    case 'enter':
                        var focussed = this.holder.getElements('li.focussed');
                        if (focussed.length == 1) this.destroyBox.delay(1, this, [focussed[0], this.focusInput.value]);
                        break;
                    default:
                        break;
                    }
                }.bind(this)
            }
        }).inject(this.holder, 'after');
        this.parse(this.maininput, true);
    },
    toElement: function () {
        return this.holder;
    },
    createInput: function (text) {
        var li = new Element('li', {
            'class': this.options.className + '-input'
        });
        var el = new Element('input', {
            type: 'text',
            value: (text && text.trim()) || '',
            tabindex: '-1',
            autocomplete: 'off',
            events: {
                'focus': function (e) {
                    this.focussedInput = el;
                    this.holder.fireEvent('focus');
                }.bind(this),
                'blur': function (e) {
                    li.store('cacheValue', this.parse(li, true));
                    this.updateHiddenField();
                    this.holder.fireEvent('blur');
                }.bind(this)
            }
        }).setProperties(this.inputProperties).inject(li).store('li', li);
        (function () {
            li.store('expanding-input', new ExpandingTextBox(el));
        }).delay(10);
        return li.store('type', 'input').store('input', el);
    },
    reToken: /\s*(?:(?:\"((?:\\\"|.)*?)\"\s*)|(?:\<([^\,\;\>]*?)\>\s*)|(?:\((.*?)\)\s*)|(?:([\,\;])\s*)|(?:((?:\\\"|[^\s\,\;\"\<])*)\s*)|(?:$))/g,
    reEmailLike: /^[a-zA-Z0-9_\.\-\#\$\%\*\+\=\/\'\&]+\@(?:(?:[a-zA-Z0-9_\-]+\.)+[a-zA-Z]+|sms)'?$/,
    parse: function (li, parseLastToken) {
        var input = li.retrieve('input');
        var isVisible = !input.getParent('.hidden');
        var cursorPoint = isVisible ? input.get('selection').start : 0;
        var original = input.value;
        var tokenFirst = 0,
            sepLast = 0,
            tokenLast = this.reToken.lastIndex = 0;
        var gotEnd = false,
            matches, match;
        var phrase = '',
            email = '',
            comment = '';
        var that = this;
        var makeToken = function (index, clear, gotEmail) {
                if (!email && !gotEmail && that.reEmailLike.test(phrase)) {
                    email = phrase;
                    phrase = '';
                    email = email.replace(/^'(.*)'$/, "$1");
                }
                if (email) {
                    var value = (phrase ? (/[^\w ]/.test(phrase) ? '"' + phrase + '" ' : phrase + ' ') : '') + (phrase || (/"/.test(email)) ? '<' + email + '>' : email) + (comment ? ' (' + comment + ')' : '');
                    var newLi = that.createBox(value, phrase || email, email + (comment ? ' (' + comment + ')' : ''));
                    var unboxed = original.substr(tokenFirst, sepLast - tokenFirst);
                    that.createInput(unboxed).inject(li, 'before');
                    newLi.inject(li, 'before');
                    tokenFirst = index;
                }
                if (email || clear) phrase = email = comment = '';
            };
        while (!gotEnd && (matches = this.reToken.exec(original)) !== null) {
                if (matches[4]) {
                    makeToken(this.reToken.lastIndex, true);
                    sepLast = matches ? matches.index : 0;
                } else if (match = matches[1] || matches[5]) {
                    if (!(/^[(<]/.test(match))) makeToken(tokenLast, false);
                    phrase += (phrase ? ' ' : '') + match;
                } else if (matches[2]) {
                    makeToken(tokenLast, false, true);
                    email = matches[2];
                } else if (matches[3]) {
                    comment = matches[3];
                } else {
                    gotEnd = true;
                }
                tokenLast = this.reToken.lastIndex;
            }
        if (parseLastToken) {
                makeToken(tokenLast, true);
            }
        if (tokenFirst) {
                var remainder = original.substr(tokenFirst);
                input.set('value', (remainder === ' ' ? '' : remainder)).fireEvent('change');
                if (isVisible) input.set('selection', cursorPoint - tokenFirst);
            }
        return input.value;
    },
    createBox: function (text, display, title) {
        var li = new Element('li', {
            'class': this.options.className + '-box',
            title: title,
            text: display
        }).store('type', 'box').store('value', text);
        new Element('a', {
            href: '#',
            'class': this.options.className + '-menu'
        }).grab(new Element('span')).inject(li);
        return li;
    },
    focusBox: function (li) {
        if (li) li.addClass('focussed');
        var val = [];
        for (li = this.holder.getElements('li.focussed'), i = 0; i < li.length; i++)
        val.push(li[i].retrieve('value'));
        this.focusInput.store('value', val.join(', '));
        this.focusInput.value = this.focusInput.retrieve('value');
        this.focusInput.focus();
        this.focusInput.select();
    },
    destroyBox: function (li, text) {
        if ($defined(li.length) && li.length === 0) return;
        var prevText = (li.length ? li[0] : li).getPrevious().retrieve('input');
        var nextText = (li.length ? li[li.length - 1] : li).getNext().retrieve('input');
        nextText.value = prevText.value + (text || '') + nextText.value;
        nextText.set('selection', prevText.value.length + (text && text.length == 1 ? 1 : 0), prevText.value.length + (text || '').length);
        nextText.fireEvent('change');
        var prevLi = li.getPrevious();
        $splat(prevLi.retrieve('expanding-input')).each(function (input) {
            input.cancel();
        });
        prevLi.destroy();
        li.destroy();
    },
    updateHiddenField: function () {
        var value = '';
        this.holder.getElements('li').each(function (li) {
            switch (li.retrieve('type')) {
            case 'box':
                value += li.retrieve('value') + ', ';
                break;
            case 'input':
                value += li.retrieve('input').value.trim() ? (li.retrieve('input').value.trim() + ', ') : '';
                break;
            default:
                break;
            }
        });
        this.input.value = value;
    },
    get: function (what) {
        return this.focussedInput.get(what);
    },
    set: function (what, value) {
        this.focussedInput.set.apply(this.focussedInput, arguments);
        return this;
    },
    sendEvent: function () {
        this.focussedInput.sendEvent.apply(this.focussedInput, arguments);
    }
});
var AutoCompleteTextBox = (function () {
    var searchRegExps = {};

    function getSearchRegExp(value) {
        return searchRegExps[value] || (searchRegExps[value] = new RegExp('(?:^|["\\s<@\\(])' + value.escapeRegExp() + '(.*?)\\b', 'i'));
    }
    var hightlightRegExps = {};

    function getHighlightRegExp(value) {
        return hightlightRegExps[value] || (hightlightRegExps[value] = new RegExp('(^|&quot;|\\s|&lt;|@|\\()(' + value.escapeRegExp() + ')', 'gi'));
    }
    return new Class({
        Implements: Options,
        data: [],
        options: {
            noDuplicates: false,
            maxresults: 10,
            minchars: 1
        },
        initialize: function (input, options) {
            this.setOptions(options);
            var that = this;
            this.holder = new Element('ul', {
                'class': 'autoComplete-holder',
                events: {
                    mouseover: function (e) {
                        var el = e.target;
                        if (el.nodeName.toLowerCase() != 'li') el = $(el).getParent('li');
                        that.focusSuggestion(el);
                    },
                    mousedown: function (e) {
                        var el = e.stop().target;
                        if (el.nodeName.toLowerCase() != 'li') el = $(el).getParent('li');
                        that.acceptSuggestion(e.target, e);
                    }
                }
            }).inject(document.body);
            this.align = $(this.options.align) || $(input);
            var keyevent = '';
            $(input).addEvents({
                keydown: function (e) {
                    switch (e.key) {
                    case 'up':
                        keyevent = 'up';
                        this.moveFocus('Previous');
                        e.preventDefault();
                        break;
                    case 'down':
                        keyevent = 'down';
                        this.moveFocus('Next');
                        e.preventDefault();
                        break;
                    case 'tab':
                    case 'enter':
                        if (!this.currentlyFocussed) break;
                        keyevent = 'accept';
                        e.stop();
                        break;
                    default:
                        break;
                    }
                }.bind(this),
                keypress: function (e) {
                    if (keyevent == 'accept') e.stop();
                },
                keyup: function (e) {
                    switch (keyevent) {
                    case '':
                        this.showSuggestions();
                        break;
                    case 'accept':
                        this.acceptSuggestion(this.currentlyFocussed, e);
                        break;
                    default:
                        break;
                    }
                    keyevent = '';
                }.bind(this),
                focus: this.showSuggestions.bind(this),
                blur: this.hideSuggestions.bind(this)
            });
            this.input = $type(input) == 'string' ? $(input) : input;
        },
        showSuggestions: function () {
            var value = this.input.get('value');
            value = value.slice(value.lastIndexOf(',') + 1).trim();
            if (!value || value.length < this.options.minchars) {
                this.hideSuggestions();
            } else {
                this.holder.empty();
                this.holder.setStyles({
                    'display': 'block',
                    'top': this.align.getTop() + this.align.getHeight() + 'px',
                    'left': this.align.getLeft() + 'px',
                    'width': this.align.getWidth() + 2 * ($(this.input).getStyle('padding-left').toInt() + $(this.input).getStyle('border-left-width').toInt()) + 'px'
                });
                var tests = value.split(' ').map(getSearchRegExp);
                var results = this.data.filter(function (dataItem) {
                    var matches = 0,
                        fullMatches = 0;
                    tests.each(function (regExp) {
                            matches += regExp.test(dataItem.name) ? 1 : 0;
                            fullMatches += (RegExp.$1 === "") ? 1 : 0;
                        });
                    dataItem.fullMatches = fullMatches;
                    return matches == tests.length;
                });
                results = [results.filter(function (d) {
                    return d.fullMatches;
                }), results.filter(function (d) {
                    return !d.fullMatches;
                })].flatten();
                results.each(function (result, index) {
                    if (index >= this.options.maxresults) return;
                    var el = new Element('li', {
                        html: this.highlightSearchText(result.name, value)
                    }).inject(this.holder).store('result', result);
                    if (index === 0) this.focusSuggestion(el);
                }, this);
                if (Browser.Engine.trident4 && !this.toShow) this.toShow = $$('select:not(.hidden)').addClass('hidden');
                if (!this.holder.getFirst()) this.hideSuggestions();
            }
        },
        highlightSearchText: function (html, searchTerm) {
            html = html.escapeHTMLEntities();
            searchTerm.split(' ').map(getHighlightRegExp).each(function (regExp) {
                html = html.replace(regExp, '$1<em>$2</em>');
            });
            return html;
        },
        hideSuggestions: function () {
            delete this.currentlyFocussed;
            this.holder.setStyle('display', 'none');
            if (Browser.Engine.trident4 && this.toShow) {
                this.toShow.removeClass('hidden');
                delete this.toShow;
            }
        },
        focusSuggestion: function (el) {
            if (!el) return;
            if (this.currentlyFocussed) this.currentlyFocussed.removeClass('autoComplete-focus');
            this.currentlyFocussed = el.addClass('autoComplete-focus');
        },
        moveFocus: function (direction) {
            if (!this.currentlyFocussed) return;
            this.focusSuggestion(this.currentlyFocussed['get' + direction]());
        },
        acceptSuggestion: function (el, event) {
            var result;
            if (!el || !(result = el.retrieve('result'))) return;
            var value = this.input.get('value').slice(0, (this.input.get('value').lastIndexOf(',') + 1) || null);
            value = value + (value ? ' ' : '') + result.value + ', ';
            this.input.set('value', value);
            this.input.sendEvent('change');
            this.input.set('selection', value.length);
            if (this.options.noDuplicates) delete this.data[this.data.indexOf(el.retrieve('result'))];
            this.hideSuggestions();
        },
        addData: function (data) {
            switch ($type(data)) {
            case 'object':
                this.data.include(data);
                break;
            case 'array':
                if (this.data.length) this.data.combine(data);
                else this.data = data;
                break;
            default:
                break;
            }
        }
    });
})();
var KeyboardShortcuts = new Class({
    initialize: function () {
        var that = this;
        document.addEvent('keypress', function (event) {
            var tag = event.target.nodeName.toLowerCase();
            if (tag == 'select' || tag == 'textarea' || (tag == 'input' && (event.target.type == 'text' || event.target.type == 'password'))) {
                if (event.key == 'esc') event.target.blur();
                return;
            }
            var key = KeyboardShortcuts.LookupKey(event);
            if (!FastMail.EnableKeyboardShortcuts && key != 'ctrl- ') return;
            var fun;
            do {
                fun = key;
                do {
                    fun = KeyboardShortcuts.Actions.get(fun);
                } while (typeof(fun) == 'string');
            } while (!fun && (key.search(/shift-[^a-zA-Z0-9]$/) != -1) && (key = key.replace(/shift-/, '')));
            if (fun) {
                event.preventDefault();
                fun(event);
            }
        });
        if (Browser.Engine.webkit) {
            document.addEvent('keydown', function (event) {
                if (event.target.nodeName.toLowerCase() == 'input' && event.key == 'esc') event.target.blur();
            });
        }
    }
});
if (Browser.Engine.trident || Browser.Engine.webkit) {
    Event.Keys.extend({
        'enterctrl': 10
    });
}
Event.Keys.extend({
    'pageup': 33,
    'pagedown': 34,
    'end': 35,
    'home': 36
});
KeyboardShortcuts.LookupKey = function (event, noModifiers) {
    var modifiers = '';
    if (!noModifiers) {
        if (event.alt) modifiers += 'alt-';
        if (event.control) modifiers += 'ctrl-';
        if (event.meta) modifiers += 'meta-';
        if (event.shift) modifiers += 'shift-';
    }
    var normalKey = event.event.which !== 0 && event.code >= 32 ? true : false;
    if (Browser.Engine.presto && normalKey && event.code <= 36 && !event.shift) normalKey = false;
    return modifiers + (normalKey ? String.fromCharCode(event.code).toLowerCase() : Event.Keys.keyOf(event.event.keyCode));
};
KeyboardShortcuts.Actions = new Hash;
var SelectMenu = new Class({
    Implements: [Events, Options],
    options: {
        title: 'Select a choice',
        label: '',
        method: 'firstLetter',
        start: 0,
        end: undefined
    },
    initialize: function (select, options) {
        this.setOptions(options);
        this.select = $(select);
    },
    createMenu: function () {
        if (this.menu) return;
        this.menu = new Element('div', {
            'class': 'keyboardMenu hidden'
        }).inject(document.body);
        var contents = new Element('div').inject(this.menu);
        this.title = new Element('h2', {
            text: this.options.title
        }).inject(contents);
        new Element('label', {
            html: this.options.label
        }).inject(contents);
        this.input = new Element('input', {
            type: 'text',
            'class': 'keyboardMenu-' + this.options.method,
            events: {
                blur: function () {
                    this.hide();
                }.bind(this),
                keydown: function (event) {
                    switch (event.key) {
                    case 'esc':
                        this.hide();
                        break;
                    case 'up':
                        this.focus(this.getPrevious());
                        break;
                    case 'down':
                        this.focus(this.getNext());
                        break;
                    case 'enter':
                        this.selected.sendEvent('click', null, 10);
                        break;
                    default:
                        if (this.options.method == 'firstLetter' && event.key.match(/^[a-z]$/)) {
                            var next = this.selected;
                            do {
                                next = this.choices[next.retrieve('index') + 1] || this.choices[0];
                            } while (next.get('text').trim().charAt(0).toLowerCase() != event.key && next != this.selected);
                            this.focus(next);
                            break;
                        }
                    }
                }.bindWithEvent(this),
                keypress: function (event) {
                    event.stopPropagation();
                    if (this.options.method == 'shortcut') {
                        var key = KeyboardShortcuts.LookupKey(event, 1);
                        for (var i = 0; i < this.choices.length; i++) {
                            if (this.choices[i].retrieve('kbshortcut').contains(key, ' ')) {
                                this.choices[i].fireEvent('click');
                                break;
                            }
                        }
                    }
                    else if (this.options.method == 'filter') return;
                    event.preventDefault();
                }.bindWithEvent(this),
                keyup: function (event) {
                    if (this.options.method != 'filter') return;
                    var pattern = new RegExp('\\b' + this.input.value.escapeRegExp(), 'i');
                    this.choices.each(function (li) {
                        li.get('text').test(pattern) ? li.removeClass('hidden') : li.addClass('hidden');
                    });
                    if (this.selected.hasClass('hidden')) this.focus(this.getNext());
                }.bindWithEvent(this)
            }
        }).inject(contents);
        var ul = new Element('ul').setStyle('max-height', window.getHeight() - 150 + 'px').inject(contents);
        var i = 0,
            subMenuLi;
        var group = this.select.get('kbgroup'),
            options;
        if (group) options = $$('#main button[kbgroup=' + group + '], #main select[kbgroup=' + group + '] option');
        else options = this.select.getElements('option');
        options.each(function (option, index) {
                if (index < this.options.start || index >= this.options.end || option.get('kbclass').contains('noKeyboard')) return false;
                if (option.get('kbclass').contains('subMenu')) {
                    var subMenu = new SelectMenu(this.select, {
                        title: option.get('text').replace(/\s?-+\s?/g, '') + '...',
                        label: 'Type to find a folder...',
                        start: index + 1,
                        end: (option.getNext('option.disabled') && option.getNext('option.disabled').index) || this.options.end,
                        method: 'filter',
                        onChange: function () {
                            this.fireEvent('change');
                        }.bind(this)
                    });
                    subMenuLi = new Element('li', {
                        'class': option.get('kbclass'),
                        text: option.get('text').replace(/\s?-+\s?/g, '') + ' folder...',
                        events: {
                            click: function (event) {
                                this.hide();
                                subMenu.show();
                            }.bind(this)
                        }
                    }).inject(ul).store('index', i);
                    i++;
                    option.store('li', subMenuLi);
                    if (this.options.method == 'shortcut') {
                        new Element('span', {
                            text: option.get('kbshortcut').split(' ')[0]
                        }).inject(subMenuLi, 'top');
                        subMenuLi.store('kbshortcut', option.get('kbshortcut'));
                    }
                }
                else if (option.get('kbclass').contains('header')) {
                    subMenuLi = null;
                    new Element('h3', {
                        text: option.get('text').replace(/\s?-+\s?/g, '')
                    }).inject(contents);
                    ul = new Element('ul').inject(contents);
                } else {
                    if (subMenuLi) return option.store('parentLi', subMenuLi);
                    var li = new Element('li', {
                        'class': option.get('kbclass') + (option.get('text').match(/\./g) ? ' level' + option.get('text').match(/\./g).length : ''),
                        text: option.get('text').split('.').join(' ').replace(/\s*[Â«Â»]\s*/g, ''),
                        events: {
                            click: function (event) {
                                if (option.nodeName.toLowerCase() == 'option') {
                                    option.selected = true;
                                    this.fireEvent('change');
                                }
                                else {
                                    this.hide();
                                    option.sendEvent('click');
                                }
                            }.bind(this)
                        }
                    }).inject(ul).store('index', i);
                    i++;
                    option.store('li', li).store('menu', this);
                    if (this.options.method == 'shortcut') {
                        new Element('span', {
                            text: option.get('kbshortcut').split(' ')[0]
                        }).inject(li, 'top');
                        li.store('kbshortcut', option.get('kbshortcut'));
                    }
                }
                if (option.get('kbselected')) {
                    this.selected = option.retrieve('li').addClass('selected');
                    var parent = option.retrieve('parentLi');
                    if (parent) parent.retrieve('menu').selected = parent.addClass('selected');
                }
                return false;
            }, this);
        this.choices = $(this.menu).getElements('li');
        this.fade = new Fx.Tween(this.menu, {
                duration: 200,
                link: 'cancel'
            });
        this.scroll = new Fx.Scroll(this.menu.getElement('ul'), {
                duration: 400,
                transition: Fx.Transitions.Quad.easeInOut
            });
        if (Browser.Engine.trident) {
                var lists = this.menu.removeClass('hidden').getElements('ul');
                var max = 0;
                for (i = 0, l = lists.length; i < l; i++) {
                    max = Math.max(lists[i].getWidth(), max);
                }
                lists.setStyle('width', max + 'px');
                this.menu.setStyle('width', max + 'px').addClass('hidden');
            }
    },
    getNext: function () {
        var next = this.selected;
        do {
            next = this.choices[next.retrieve('index') + 1] || this.choices[0];
        } while (next.hasClass('hidden') && next != this.selected);
        return next;
    },
    getPrevious: function () {
        var prev = this.selected;
        do {
            prev = this.choices[prev.retrieve('index') - 1] || this.choices[this.choices.length - 1];
        } while (prev.hasClass('hidden') && prev != this.selected);
        return prev;
    },
    focus: function (li) {
        if (this.selected) this.selected.removeClass('selected');
        this.selected = li.addClass('selected');
        var ul = this.menu.getElement('ul');
        if (this.selected.offsetTop < ul.scrollTop) {
            this.scroll.start(false, this.selected.offsetTop - 5);
        }
        else if (this.selected.offsetTop + this.selected.offsetHeight > ul.scrollTop + ul.offsetHeight) {
            this.scroll.start(false, this.selected.offsetTop - 5);
        }
    },
    show: function () {
        this.createMenu();
        this.fireEvent('show');
        var currentOption = this.select.getElement('option[selected]');
        this.focus(this.selected || (currentOption.retrieve('menu') == this ? currentOption.retrieve('li') : currentOption.retrieve('parentLi')) || this.choices[0]);
        this.menu.removeClass('hidden').setStyle('opacity', 1);
        this.input.focus();
    },
    hide: function () {
        this.input.set('value', '').blur();
        this.fade.start('opacity', 0).chain(function () {
            this.menu.addClass('hidden');
        }.bind(this));
        this.fireEvent('hide');
    }
});
var Menu = (function () {
    var MenuSingleton = new Class({
        initialize: function () {
            this.ul = new Element('ul', {
                id: 'menu',
                'class': 'hidden'
            }).inject(document.body);
            document.addEvent('click', function () {
                this.ul.addClass('hidden');
            }.bind(this));
        },
        show: function (options) {
            this.ul.empty();
            options.choices.each(function (choice) {
                new Element('li', {
                    text: choice.name,
                    'class': choice.className,
                    events: {
                        click: choice.callBack
                    }
                }).inject(this.ul);
            }, this);
            this.ul.setStyles({
                top: options.align.getPosition().y + options.align.getHeight(),
                left: options.align.getPosition().x
            }).removeClass('hidden');
        }
    });
    var menu;
    return (function (options) {
        if (!menu) menu = new MenuSingleton();
        menu.show(options);
    });
})();
var ModalDialog = new Class({
    Implements: Events,
    initialize: function (contents) {
        this.contents = contents;
    },
    createContent: function () {
        if (this.content) return;
        this.dim = new Element('div', {
            'class': 'dimScreen hidden'
        }).inject(document.body);
        this.box = new Element('div', {
            'class': 'modalDialog hidden'
        }).inject(document.body);
        this.title = new Element('h2', {
            text: this.contents.title
        }).inject(this.box);
        this.content = new Element('div').inject(this.box);
    },
    show: function (title, body) {
        this.createContent();
        $(document.body).addClass('modal');
        this.dim.removeClass('hidden');
        this.box.removeClass('hidden');
        this.fireEvent('show');
    },
    hide: function () {
        this.createContent();
        $(document.body).removeClass('modal');
        this.dim.addClass('hidden');
        this.box.addClass('hidden');
        this.fireEvent('hide');
    }
});
var Sidebar = new Class({
    initialize: function () {
        var main = $('main'),
            sidebar = $('sidebar');
        var sbWidth = sidebar.meGetStyle('width').toInt();
        this.gap = main.getLeft() - (sbWidth + sidebar.getLeft());
        if (this.gap < 0) {
                this.gap = 7;
            }
        $$('#sidebar ul.folderTree').each(function (tree) {
                new Sidebar.FolderTree(tree);
            });
        this.hideSections();
        if ($('savedSearches')) this.toggleSavedSearches();
            (function () {
                this.enableHideSidebar();
                this.enableResize();
                this.keyboardShortcuts();
            }).delay(1, this);
    },
    enableResize: function () {
        var sidebar = $('sidebar');
        var main = $('main');
        var minWidth = 150;
        $$('#folderTree a.empty').each(function (emptyLink) {
            var total = emptyLink.getParent().getElement('.messageTotal');
            total.setStyles({
                visibility: 'hidden',
                display: 'inline'
            });
            minWidth = Math.max(sidebar.getStyle('width').toInt() - emptyLink.getLeft() + total.getLeft() + total.getWidth() + 10, minWidth);
            total.erase('style');
        });
        var that = this;
        this.resize = new Drag(sidebar, {
            handle: new Element('div', {
                id: 'resizeHandle',
                html: '&larr; resize &rarr;',
                events: {
                    dblclick: function (el) {
                        sidebar.style.width = main.style.marginLeft = "";
                        FastMail.Preferences.erase('sidebarWidth');
                    }
                }
            }).inject(sidebar, 'top'),
            limit: {
                x: [minWidth, 500]
            },
            modifiers: {
                x: 'width',
                y: false
            },
            onDrag: function (el) {
                main.style.marginLeft = el.style.width.toInt() + that.gap + 'px';
            },
            onComplete: function (el) {
                FastMail.Preferences.set('sidebarWidth', sidebar.getStyle('width').toInt());
            }
        });
        if (FastMail.Preferences.get('sidebarHidden')) {
            $('resizeHandle').addClass('hidden');
            this.resize.detach();
        }
    },
    enableHideSidebar: function () {
        var sidebar = $('sidebar');
        var main = $('main');
        var transition = new Fx.Elements([sidebar, main], {
            transition: Fx.Transitions.Sine.easeInOut,
            duration: 400,
            link: 'cancel'
        });
        var that = this;
        this.slideinSidebar = function (chain) {
            transition.start({
                '0': {
                    'marginLeft': 0
                },
                '1': {
                    'marginLeft': that.gap + sidebar.meGetStyle('width').toInt()
                }
            }).chain(chain || $empty);
        };
        this.slideoutSidebar = function (chain) {
            transition.start({
                '0': {
                    'marginLeft': 7 - sidebar.meGetStyle('width').toInt()
                },
                '1': {
                    'marginLeft': 7 + that.gap
                }
            }).chain(chain || $empty);
        };
        var delay;

        function sidebarIn() {
            $clear(delay);
            that.slideinSidebar();
        }

        function sidebarOut() {
            delay = that.slideoutSidebar.delay(350);
        }
        var isChangingState = false;
        var hideSidebar = new Element('a', {
            id: 'hideSidebar',
            href: '#',
            html: '&laquo; Auto hide the sidebar',
            events: {
                click: function (event) {
                    event.stop();
                    if (isChangingState) return;
                    isChangingState = true;
                    if (FastMail.Preferences.get('sidebarHidden')) {
                        sidebar.removeEvent('mouseenter', sidebarIn);
                        main.removeEvent('mouseenter', sidebarOut);
                        $('hideSidebar').set('html', '&laquo; Auto hide the sidebar').removeClass('active');
                        that.slideinSidebar(function () {
                            that.resize.attach();
                            $('resizeHandle').removeClass('hidden');
                            isChangingState = false;
                        });
                    }
                    else {
                        that.resize.detach();
                        $('resizeHandle').addClass('hidden');
                        that.slideoutSidebar(function () {
                            main.addEvent('mouseenter', sidebarOut);
                            sidebar.addEvent('mouseenter', sidebarIn);
                            $('hideSidebar').set('html', 'Stop hiding the sidebar &raquo;').addClass('active');
                            isChangingState = false;
                        });
                    }
                    FastMail.Preferences.set('sidebarHidden', !FastMail.Preferences.get('sidebarHidden'));
                }
            }
        }).inject(sidebar);
        var width = FastMail.Preferences.get('sidebarWidth');
        if (width > 50) {
            if (Math.abs(main.style.marginLeft - (width + this.gap)) > 5) main.style.marginLeft = (width + this.gap) + 'px';
            if (Math.abs(sidebar.style.width - width) > 5) sidebar.style.width = width + 'px';
        }
        if (FastMail.Preferences.get('sidebarHidden')) {
            sidebar.setStyle('marginLeft', 7 - sidebar.meGetStyle('width').toInt());
            main.setStyle('marginLeft', 7 + this.gap);
            main.addEvent('mouseenter', sidebarOut);
            sidebar.addEvent('mouseenter', sidebarIn);
            $('hideSidebar').set('html', 'Stop hiding the sidebar &raquo;').addClass('active');
        }
        document.html.removeClass('sidebarHidden');
        $$('#sidebar input[type=text]').addEvents({
            focus: function (event) {
                if (FastMail.Preferences.get('sidebarHidden')) this.slideinSidebar();
                var sectionId = $(event.target).getParent('div.sidebarSection').id;
                if (FastMail.Preferences.get(sectionId)) this[sectionId + 'Toggle'](null, 1);
            }.bind(this),
            blur: function (event) {
                if (FastMail.Preferences.get('sidebarHidden')) this.slideoutSidebar();
                var sectionId = $(event.target).getParent('div.sidebarSection').id;
                if (FastMail.Preferences.get(sectionId)) this[sectionId + 'Toggle'](null, 1);
            }.bind(this)
        });
    },
    hideSections: function () {
        var that = this;
        $('sidebar').getElements('h2').each(function (section) {
            var div = section.getNext();
            var sectionPref = section.getParent().id;
            var fx, originalHeight;
            var toggle = that[sectionPref + 'Toggle'] = function (event, noPref) {
                if (event && event.target.nodeName.toLowerCase() == 'a') return;
                section.toggleClass('collapsed');
                if (!fx) fx = new Fx.Morph(div, {
                    link: 'cancel',
                    duration: 200
                });
                if (section.hasClass('collapsed')) {
                    originalHeight = div.getHeight();
                    fx.start({
                        height: 0
                    }).chain(function () {
                        div.setStyles({
                            paddingTop: 0,
                            paddingBottom: 0
                        });
                    });
                    if (!noPref) FastMail.Preferences.set(sectionPref, true);
                }
                else {
                    div.setStyles({
                        paddingTop: '',
                        paddingBottom: ''
                    });
                    fx.start({
                        height: originalHeight
                    }).chain(function () {
                        div.setStyle('height', '').scrollTop = 0;
                    });
                    if (!noPref) FastMail.Preferences.erase(sectionPref);
                }
            };
            section.addClass('collapsable').addEvent('click', toggle);
            if (FastMail.Preferences.get(sectionPref)) {
                section.toggleClass('collapsed');
                originalHeight = div.getHeight();
                div.setStyles({
                    height: 0,
                    paddingTop: 0,
                    paddingBottom: 0
                });
            }
        });
    },
    toggleSavedSearches: function () {
        var action = "Hide";
        if (!FastMail.Preferences.get('showSavedSearches')) {
            $('savedSearches').addClass('hidden');
            action = "Show";
        }
        $('searchOptions').innerHTML += ' - <a href="#" id="showHideSavedSearch">' + action + ' saved</a>';
        $('showHideSavedSearch').addEvent('click', function () {
            var doShow = !this.get('text').contains('Hide');
            this.set('text', (doShow ? 'Hide' : 'Show') + ' saved');
            FastMail.Preferences.set('showSavedSearches', doShow);
            $('savedSearches').toggleClass('hidden');
            return false;
        });
    },
    keyboardShortcuts: function () {
        KeyboardShortcuts.Actions.extend({
            '/': function (event) {
                $('searchBox') && $('searchBox').set('selection', 0, $('searchBox').value.length);
            },
            'ctrl-/': function (event) {
                $('clearSearch') && $('clearSearch').sendEvent('click');
            }
        });
        $('searchBox') && $('searchBox').addEvent('keypress', function (event) {
            var key = KeyboardShortcuts.LookupKey(event);
            if (key == 'ctrl-.' && $('searchAll')) {
                event.preventDefault();
                $('searchAll').checked = !$('searchAll').checked;
            }
        });
    }
});
Sidebar.FolderTree = new Class({
    Implements: Events,
    initialize: function (root) {
        this.root = root;
        this.loaded = !root.getElements('li.collapsed').length;
        this.folders = [];
        if (Browser.Features.xhr) {
            $('filterFolders').addEvent('click', function () {
                FastMail.alert({
                    title: 'Please wait...',
                    body: 'Sorry, we\'re still loading all your folders. Please try again in a few seconds.'
                });
                $('filter').blur();
            });
            this.addEvent('loaded', function () {
                root.getElements('ul').each(function (ul) {
                    ul.injectAfter(ul.getParent());
                });
                this.activateFilter();
            }.bind(this));
            this.request = new FastMail.Request();
            var screenSignal = document.body.id == 'message' ? 'MsgRead' : document.body.id.capitalize();
            if (!this.loaded) {
                var folder = $('selectedFolder'),
                    generation = $('mailboxGeneration');
                this.request.send({
                        method: 'get',
                        signal: screenSignal + '-GetFolderTreeHTML',
                        args: [folder ? folder.value : 0, generation ? generation.value : 0],
                        includeScreenState: true,
                        excludeState: ['SMR-UM'],
                        onSuccess: function (data) {
                            var filter = $('filterFolders').dispose();
                            root.set('html', data.html).grab(filter, 'top');
                            FastMail.enhance(root);
                            this.loaded = true;
                            this.fireEvent('loaded');
                        }.bind(this)
                    });
            } else this.fireEvent('loaded');
            root.addEvent('click', function (event) {
                if (!$(event.target).hasClass('expandCollapseLink')) return;
                event.preventDefault();
                if (!this.loaded) {
                    FastMail.alert({
                        title: 'Please wait...',
                        body: 'Folders still loading. Try again in a second or two.'
                    });
                    return;
                }
                var li = event.target.getParent('li').toggleClass('collapsed');
                var isCollapsed = li.hasClass('collapsed');
                li.getNext('ul')[isCollapsed ? 'addClass' : 'removeClass']('hidden');
                event.target.innerHTML = isCollapsed ? '+' : '&#8211;';
                this.request.send({
                    signal: screenSignal + '-FolderState',
                    args: [li.id, isCollapsed ? 'collapsed' : 'expanded']
                });
            }.bind(this));
        } else {
            $('filterFolders').addClass('hidden');
        }
    },
    activateFilter: function () {
        var that = this;
        var filter = this.filter = $('filter');
        var folders = this.folders = this.root.getElements('li:not([id=filterFolders])');
        var root = this.root;
        filter.erase('disabled');
        $('filterFolders').removeEvents('click');
        filter.addEvents({
            focus: function (event) {
                that.moveKeyboardSelected(0);
                that.filterFolders();
                that.filterFocus = true;
            },
            blur: function (event) {
                var selected = $('keyboardSelectedFolder');
                if (selected) selected.erase('id');
                that.filterFocus = false;
                that.hideFolders();
            },
            keydown: function (event) {
                (shortcutKeys[event.key] || $empty)(event);
            },
            keypress: function (event) {
                if (['up', 'down', 'enter'].contains(event.key)) event.stop();
            },
            keyup: function (event) {
                that.filterFolders();
            }
        });
        var shortcutKeys = {
            up: function (event) {
                that.moveKeyboardSelected(-1);
                event.preventDefault();
            },
            down: function (event) {
                that.moveKeyboardSelected(1);
                event.preventDefault();
            },
            left: function (event) {
                if (filter.value !== '') return;
                var selected = $('keyboardSelectedFolder');
                var expand = selected.getElement('a.expandCollapseLink');
                if (expand && !selected.hasClass('collapsed')) expand.sendEvent('click');
            },
            right: function (event) {
                if (filter.value !== '') return;
                if ($('keyboardSelectedFolder').hasClass('collapsed')) $('keyboardSelectedFolder').getElement('a.expandCollapseLink').sendEvent('click');
            },
            enter: function (event) {
                event.stop();
                if (!$('keyboardSelectedFolder')) return;
                if (event.meta || event.alt) {
                    if (event.control & document.body.id == 'mailbox') $('copyOption').selected = true;
                    $('keyboardSelectedFolder').getElement('button, input').sendEvent('click', null, 10);
                }
                else $('keyboardSelectedFolder').getElement('a.folder').sendEvent('click', null, 10);
            }
        };
        KeyboardShortcuts.Actions.extend({
            ',': function (event) {
                filter.select();
                filter.focus();
            }
        });
        var copyRelease = $empty,
            original;
        var select = $E('#moveCopyOption select'),
            copyOption = $('copyOption');
        if (select && copyOption) {
                copyRelease = function () {
                    if ($chk(original)) {
                        select.options[original].selected = true;
                        original = null;
                    }
                };
                document.addEvents({
                    keyup: (function (event) {
                        copyRelease();
                    }).bind(this),
                    keydown: (function (event) {
                        if (this.buttonOver && !$chk(original) && event.control) {
                            original = select.selectedIndex;
                            copyOption.selected = true;
                        }
                    }).bind(this)
                });
            }
        root.addEvents({
                mouseover: (function (event) {
                    this.mouseOver = true;
                    this.buttonOver = $(event.target).match('button, input[type=submit]');
                }).bind(this),
                mouseleave: (function (event) {
                    this.mouseOver = false;
                    this.buttonOver = false;
                    copyRelease();
                    this.hideFolders();
                }).bind(this)
            });
    },
    filterFolders: function (event) {
        if (this.filter.value === '') {
            this.root.removeClass('isFiltering');
            this.folders.removeClass('hidden');
        }
        else {
            this.root.addClass('isFiltering');
            var pattern = new RegExp('\\b' + this.filter.value.escapeRegExp(), 'i');
            this.folders.each(function (folder) {
                if (folder.get('text').trim().test(pattern)) folder.removeClass('hidden');
                else folder.addClass('hidden');
            });
        }
        this.moveKeyboardSelected(0);
    },
    moveKeyboardSelected: function (direction) {
        var visibleFolders = this.folders.filter(function (folder) {
            return folder.offsetHeight && !folder.hasClass('selected');
        });
        var selected = $('keyboardSelectedFolder');
        var i = visibleFolders.indexOf(selected);
        i = (i == -1) ? direction : i + direction;
        if (i < 0) i = visibleFolders.length - 1;
        if (i >= visibleFolders.length) i = 0;
        if (selected) selected.erase('id');
        if (visibleFolders[i]) visibleFolders[i].set('id', 'keyboardSelectedFolder');
    },
    hideFolders: function () {
        if (!this.filterFocus && !this.mouseOver && this.filter.value === "") {
            this.folders.each(function (folder) {
                folder[folder.hasClass('initHidden') ? 'addClass' : 'removeClass']('hidden');
            });
        }
    }
});
var ContentTable = new Class({
    initialize: function (table) {
        this.table = $(table);
        if (table.getElement('td.checkbox')) {
            this.generateCheckAll();
            if (!table.hasClass('continuous')) this.keyboardSupport();
            this.watchCheckboxes.delay(1, this);
        }
        if (Browser.Engine.trident4) {
            (function () {
                table.getElements('tr').each(function (row) {
                    if (row.hasClass('preview')) return;
                    row.addEvent('mouseenter', function () {
                        row.addClass('hover');
                    });
                    row.addEvent('mouseleave', function () {
                        row.removeClass('hover');
                    });
                });
            }).delay(1);
        }
    },
    generateCheckAll: function () {
        var table = this.table;
        var checkAll = new Element('input', {
            type: 'checkbox',
            id: 'checkAll',
            title: 'Select/Deselect all displayed items'
        }).addEvent('click', function (event) {
            table.getElements('tbody td.checkbox input[type=checkbox]').each(function (box) {
                box.checked = checkAll.checked;
                box.getParent('tr')[box.checked ? 'addClass' : 'removeClass']('selected');
            });
        }).inject(this.table.getElement('th.checkbox'));
    },
    watchCheckboxes: function () {
        var checkBoxes = this.table.getElements('tbody input[type=checkbox]');
        var lastChecked = 0;
        checkBoxes.each(function (box, index) {
            box.store('row', box.getParent('tr')).store('index', index);
            box.retrieve('row')[box.checked ? 'addClass' : 'removeClass']('selected');
        });
        this.table.getElement('tbody').addEvent('click', function (event) {
            var box = $(event.target);
            if (box.nodeName.toLowerCase() != 'input' || box.type != 'checkbox') return;
            box.retrieve('row')[box.checked ? 'addClass' : 'removeClass']('selected');
            if (event.shift) {
                var i = box.retrieve('index') + 1;
                while (i <= lastChecked) {
                    checkBoxes[i].checked = box.checked;
                    checkBoxes[i].retrieve('row')[checkBoxes[i].checked ? 'addClass' : 'removeClass']('selected');
                    i++;
                }
                i--;
                while (i >= lastChecked) {
                    checkBoxes[i].checked = box.checked;
                    checkBoxes[i].retrieve('row')[checkBoxes[i].checked ? 'addClass' : 'removeClass']('selected');
                    i--;
                }
            }
            lastChecked = box.retrieve('index');
        });
    },
    keyboardSupport: function () {
        if (!FastMail.EnableKeyboardShortcuts) return;
        var scrollWindow = new Fx.Scroll(window, {
            duration: 200,
            transition: Fx.Transitions.Quad.easeInOut,
            link: 'cancel'
        });
        var lastMessage = $('lastMessageUID');
        var selectedRow = (lastMessage && $(lastMessage.value)) || this.table.getElement('td.chevron').getParent();
        selectedRow.addClass('keyboardSelected');
        makeRowVisible(selectedRow);

        function moveSelector(direction, extendSel, event) {
            var row = $E('tr.keyboardSelected');
            if (!row) return;
            var newRow = row;
            while ((newRow = newRow['get' + direction]())) {
                if (newRow.getElement('td.checkbox')) {
                    row.removeClass('keyboardSelected');
                    newRow.addClass('keyboardSelected');
                    if (extendSel) newRow.getElement('td.checkbox input').sendEvent('click', event);
                    makeRowVisible(newRow);
                    break;
                }
            }
        }

        function makeRowVisible(row) {
            if (!row) return;
            var prevRow = row.getPrevious();
            if (prevRow && prevRow.hasClass('folderName')) row = prevRow;
            var scrollPosition = row.getTop();
            var preview = row.getNext();
            if (scrollPosition < window.getScrollTop() || scrollPosition + row.getHeight() + (preview && preview.hasClass('preview') ? preview.getHeight() : 0) > window.getScrollTop() + window.getHeight()) {
                scrollWindow.toElement(row);
            }
        }
        KeyboardShortcuts.Actions.extend({
            j: function (event) {
                moveSelector('Next');
            },
            'shift-j': function (event) {
                moveSelector('Next', 1, event);
            },
            k: function (event) {
                moveSelector('Previous');
            },
            'shift-k': function (event) {
                moveSelector('Previous', 1, event);
            },
            'shift-x': 'x',
            x: function (event) {
                var checkbox = $E('tr.keyboardSelected input');
                checkbox.sendEvent('click', event);
            },
            r: function (event) {
                var textbox = $E('tr.keyboardSelected input[type=text]');
                if (textbox) textbox.focus();
            },
            o: 'enter',
            enter: function (event) {
                $E('tr.keyboardSelected a').sendEvent('click', event);
            }
        });
    }
});
$(document.html).addClass('JSEnabled');
window.addEvent('domready', function () {
    if (!document.html.id) return;
    var fui = FastMail.UIEnhancements;
    if (window.innerWidth && window.innerWidth < 481) {
        fui.autoSubmitOnSelectChange();
        fui.showActionBarInput();
        return;
    }
    FastMail.jsFeatures = $('jsFeatures');
    FastMail.EnableKeyboardShortcuts = !FastMail.jsFeatures.get('disableKeyboardShortcuts');
    document.html.addClass((FastMail.EnableKeyboardShortcuts ? 'enable' : 'disable') + 'KeyboardShortcuts');
    FastMail.enhance(document);
    if ($('sidebar')) new Sidebar();
    $$('table.contentTable').each(function (table) {
        new ContentTable(table);
    });
    switch (document.body.id) {
    case 'mailbox':
        new MailboxScreen();
        break;
    case 'compose':
        new ComposeScreen();
        break;
    case 'message':
        new MessageScreen();
        break;
    case 'addressBook':
        new AddressBookScreen();
        break;
    default:
        break;
    }(function () {
        fui.targetOnEnter();
        fui.fixHeightWrapperScroll();
        fui.addNavbarShortcuts();
        new KeyboardShortcuts();
    }).delay(1);
    FastMail.Form.fixIEButtons();
});
1;