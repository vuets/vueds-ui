import { addClass, removeClass } from '../dom_util';
export function bind(el, dir, vnode) {
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
export function update(el, dir, vnode) {
    var disabled = !!dir.value;
    // check the state before applying
    if (disabled === el.disabled)
        return;
    el.disabled = disabled;
    if (disabled)
        addClass(el, 'disabled');
    else
        removeClass(el, 'disabled');
}
export function unbind(el, dir, vnode) { }
//# sourceMappingURL=disable.js.map