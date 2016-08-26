"use strict";
var util_1 = require('../util');
function bind(el, dir, vnode) {
    /*let value = dir.value,
        style = el.style

    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    if (value && transition && transition.appear && !isIE9) {
      enter(vnode)
    }
    
    const originalDisplay = style.display === 'none' ? '' : style.display
    style.display = value ? originalDisplay : 'none'
    el.__vOriginalDisplay = originalDisplay*/
}
exports.bind = bind;
function update(el, _a, vnode) {
    var value = _a.value, oldValue = _a.oldValue;
    var disabled = !!value;
    // check the state before applying
    if (disabled === el.disabled)
        return;
    el.disabled = disabled;
    if (disabled)
        util_1.addClass(el, 'disabled');
    else
        util_1.removeClass(el, 'disabled');
}
exports.update = update;
function unbind(el, dir, vnode) { }
exports.unbind = unbind;
//# sourceMappingURL=disable.js.map