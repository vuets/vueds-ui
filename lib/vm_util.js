export function getValue(obj, key) {
    /* jshint eqeqeq: false */
    if (key.indexOf('.') < 0) {
        return obj[key];
    }
    var path = key.split('.'), d = -1, l = path.length, container;
    while (++d < l && obj != null) {
        container = obj;
        key = path[d];
        obj = obj[key];
    }
    return container[key];
}
export function vmGetValue(obj, key) {
    var val = getValue(obj, key);
    return val === undefined && obj.$parent
        ? obj.$parent.$get(key)
        : val;
}
export function vmLookup(target, p) {
    var parent = p || target.parentElement, gparent = parent.parentElement, ggparent = gparent.parentElement, gggparent = ggparent.parentElement;
    return target.__vue__ || parent.__vue__ || gparent.__vue__ || ggparent.__vue__ || gggparent.__vue__;
}
export function vfragLookup(target, p) {
    var parent = p || target.parentElement, gparent = parent.parentElement, ggparent = gparent.parentElement, gggparent = ggparent.parentElement;
    return target.__v_frag || parent.__v_frag || gparent.__v_frag || ggparent.__v_frag || gggparent.__v_frag;
}
export function vmGetHandler(vm) {
    while (!vm.handle)
        vm = vm.$parent;
    return vm.handle;
}
export function setValue(obj, key, value) {
    /* jshint eqeqeq: false */
    if (key.indexOf('.') < 0) {
        obj[key] = value;
        return;
    }
    var path = key.split('.'), d = -1, l = path.length, container;
    while (++d < l && obj != null) {
        container = obj;
        key = path[d];
        obj = obj[key];
    }
    container[key] = value;
}
export function getObjAndKey(obj, key) {
    /* jshint eqeqeq: false */
    if (key.indexOf('.') < 0) {
        return { obj: obj, key: key };
    }
    var path = key.split('.'), d = -1, l = path.length, container;
    while (++d < l && obj != null) {
        container = obj;
        key = path[d];
        obj = obj[key];
    }
    return { obj: container, key: key };
}
export function getObj(obj, key) {
    /* jshint eqeqeq: false */
    if (key.indexOf('.') < 0) {
        return obj;
    }
    var path = key.split('.'), d = -1, l = path.length, container;
    while (++d < l && obj != null) {
        container = obj;
        key = path[d];
        obj = obj[key];
    }
    return container;
}
//# sourceMappingURL=vm_util.js.map