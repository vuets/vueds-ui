// keymage.js - Javascript keyboard event handling
// http://github.com/piranha/keymage
//
// (c) 2012 Alexander Solovyov
// under terms of ISC License
//(function(define, undefined) {
//define(function() {
//var VERSION = '1.0.1';
// Defining all keys
var MODPROPS = ['shiftKey', 'ctrlKey', 'altKey', 'metaKey'];
var MODS = {
    'shift': 'shift',
    'ctrl': 'ctrl', 'control': 'ctrl',
    'alt': 'alt', 'option': 'alt',
    'win': 'meta', 'cmd': 'meta', 'super': 'meta',
    'meta': 'meta',
    // default modifier for os x is cmd and for others is ctrl
    'defmod': ~navigator.userAgent.indexOf('Mac OS X') ?
        'meta' : 'ctrl'
};
var defmodKey = MODS.defmod + 'Key';
var MODORDER = ['shift', 'ctrl', 'alt', 'meta'];
var MODNUMS = [16, 17, 18, 91];
var KEYS = {
    'backspace': 8,
    'tab': 9,
    'enter': 13, 'return': 13,
    'pause': 19,
    'caps': 20, 'capslock': 20,
    'escape': 27, 'esc': 27,
    'space': 32,
    'pgup': 33, 'pageup': 33,
    'pgdown': 34, 'pagedown': 34,
    'end': 35,
    'home': 36,
    'ins': 45, 'insert': 45,
    'del': 46, 'delete': 46,
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    '*': 106,
    '+': 107, 'plus': 107,
    '-': 109, 'minus': 109,
    ';': 186,
    '=': 187,
    ',': 188,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    "'": 222
};
var i;
// numpad
for (i = 0; i < 10; i++) {
    KEYS['num-' + i] = i + 95;
}
// top row 0-9
for (i = 0; i < 10; i++) {
    KEYS[i.toString()] = i + 48;
}
// f1-f24
for (i = 1; i < 25; i++) {
    KEYS['f' + i] = i + 111;
}
// alphabet
for (i = 65; i < 91; i++) {
    KEYS[String.fromCharCode(i).toLowerCase()] = i;
}
// Reverse key codes
var KEYREV = {};
for (var k in KEYS) {
    var val = KEYS[k];
    if (!KEYREV[val] || KEYREV[val].length < k.length) {
        KEYREV[val] = k;
    }
}
var currentScope = '';
export var bindings = { preventDefault: false };
export function parse(keystring) {
    var bits = keystring.split('-');
    var button = bits[bits.length - 1];
    var key = { code: KEYS[button] };
    if (!key.code) {
        throw Error('Unknown key "' + button + '" in keystring "' + keystring + '"');
    }
    var mod;
    for (var i = 0; i < bits.length - 1; i++) {
        button = bits[i];
        mod = MODS[button];
        if (!mod) {
            throw Error('Unknown modifier "' + button + '" in keystring "' + keystring + '"');
        }
        key[mod] = true;
    }
    return key;
}
export function stringify(key) {
    var buf = '';
    for (var _i = 0, MODORDER_1 = MODORDER; _i < MODORDER_1.length; _i++) {
        var k_1 = MODORDER_1[_i];
        if (key[k_1])
            buf += k_1 + '-';
    }
    buf += KEYREV[key.code];
    return buf;
}
function normalizeKeyChain(keychainStr) {
    var keychain = [];
    for (var _i = 0, _a = keychainStr.split(' '); _i < _a.length; _i++) {
        var k_2 = _a[_i];
        keychain.push(stringify(parse(k_2)));
    }
    // TODO
    //keychain.original = keychainString;
    return keychain;
}
function eventKeyString(e) {
    var key = { code: e.keyCode };
    for (var i = 0; i < MODPROPS.length; i++) {
        var mod = MODPROPS[i];
        if (e[mod]) {
            key[mod.slice(0, mod.length - 3)] = true;
        }
    }
    return stringify(key);
}
function getNestedChains(chains, scope) {
    for (var i = 0; i < scope.length; i++) {
        var bit = scope[i];
        if (bit) {
            chains = chains[bit];
        }
        if (!chains) {
            break;
        }
    }
    return chains;
}
var sequence = [];
function dispatch(e) {
    var target = e.target, tagName = target.tagName, keyCode = e.keyCode, scope;
    // Skip all modifiers
    if (tagName === 'SELECT' || tagName === 'TEXTAREA' || ~MODNUMS.indexOf(keyCode))
        return;
    if (target.type === 'text') {
        // allow up/down
        if (!target.getAttribute('c-list') || (keyCode !== 38 && keyCode !== 40))
            return;
        e.preventDefault();
        scope = ['list'];
    }
    else {
        scope = currentScope.split('.');
    }
    var seq = sequence.slice();
    seq.push(eventKeyString(e));
    var matched, chains, key;
    for (var i = scope.length; i >= 0; i--) {
        chains = getNestedChains(bindings, scope.slice(0, i));
        if (!chains) {
            continue;
        }
        matched = true;
        for (var j = 0; j < seq.length; j++) {
            key = seq[j];
            if (!chains[key]) {
                matched = false;
                break;
            }
            chains = chains[key];
        }
        if (matched) {
            break;
        }
    }
    var definitionScope = scope.slice(0, i).join('.');
    var preventDefault = chains.preventDefault;
    // partial match, save the sequence
    if (matched && !chains.handlers) {
        sequence = seq;
        if (preventDefault) {
            e.preventDefault();
        }
        return;
    }
    if (matched) {
        for (i = 0; i < chains.handlers.length; i++) {
            var handler = chains.handlers[i];
            var options = handler._keymage;
            var res = handler.call(options.context, e, {
                shortcut: options.original,
                scope: currentScope,
                definitionScope: definitionScope
            });
            if (res === false || preventDefault) {
                e.preventDefault();
            }
        }
    }
    // either matched or not, drop the sequence
    sequence = [];
}
function assignKey(scope, keychain, fn) {
    var bits = scope.split('.'), chains = bindings, keymage = fn._keymage;
    bits = bits.concat(keychain);
    var bit;
    for (var _i = 0, bits_1 = bits; _i < bits_1.length; _i++) {
        bit = bits_1[_i];
        if (!bit)
            continue;
        chains = chains[bit] || (chains[bit] = {});
        chains.preventDefault = !!keymage.preventDefault;
    }
    if (!bit)
        return;
    var handlers = chains.handlers || (chains.handlers = []);
    handlers.push(fn);
}
// optional arguments: scope, options.
export function $(scope, keychain, fn, options) {
    /*if (keychain === undefined && fn === undefined) {
        return function (keychain, fn) {
            return keymage(scope, keychain, fn);
        };
    }*/
    if (!options)
        options = {};
    fn._keymage = options;
    //fn._keymage.original = keychain[i];
    if (Array.isArray(keychain)) {
        for (var _i = 0, keychain_1 = keychain; _i < keychain_1.length; _i++) {
            var k_3 = keychain_1[_i];
            assignKey(scope, normalizeKeyChain(k_3), fn);
        }
    }
    else {
        assignKey(scope, normalizeKeyChain(keychain), fn);
    }
}
export function setScope(scope) {
    currentScope = scope || '';
}
export function clearScope() {
    currentScope = '';
}
export function getScope() {
    return currentScope;
}
export function pushScope(scope) {
    currentScope = (currentScope ? (currentScope + '.') : '') + scope;
    return currentScope;
}
;
export function popScope(scope) {
    var i;
    if (!scope) {
        i = currentScope.lastIndexOf('.');
        scope = currentScope.slice(i + 1);
        currentScope = i == -1 ? '' : currentScope.slice(0, i);
        return scope;
    }
    currentScope = currentScope.replace(new RegExp('(^|\\.)' + scope + '(\\.|$).*'), '');
    return scope;
}
export function isDefmod(e) {
    return e[defmodKey];
}
//keymage.version = VERSION;
window.addEventListener('keydown', dispatch, false);
//    return keymage;
//});
//})(typeof define !== 'undefined' ? define : function(factory) {
//    window.keymage = factory();
//}); 
//# sourceMappingURL=keymage.js.map