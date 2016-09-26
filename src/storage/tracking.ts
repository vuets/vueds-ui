let listeners = {},
    listening = false,
    listenFn: Function

function listen() {
    if (window.addEventListener) {
        window.addEventListener('storage', change, false);
    } else if (window['attachEvent']) {
        window['attachEvent']('onstorage', change);
    } else {
        window.onstorage = change;
    }
}

function fire(listener, e) {
    listener(JSON.parse(e.newValue), JSON.parse(e.oldValue), e.url || e.uri);
}

function change(e) {
    if (!e)
        e = window.event;
    
    var all = listeners[e.key];
    if (!all)
        return
    
    for (let l of all)
        fire(l, e)
}

export function on(key, fn) {
    let entry
    if ((entry = listeners[key])) {
        entry.push(fn);
    } else {
        listeners[key] = [fn];
    }
    if (!listening) {
        listening = true
        listen()
    }
}

export function off(key, fn) {
    var ns = listeners[key];
    if (ns.length > 1) {
        ns.splice(ns.indexOf(fn), 1);
    } else {
        listeners[key] = [];
    }
}