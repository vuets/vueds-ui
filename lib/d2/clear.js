import * as keymage from '../keymage';
function handle(e) {
    // TODO
    //util.hidePopup(true)
    keymage.clearScope();
}
export function bind(el, dir, vnode) {
    el.addEventListener(dir.arg || 'focusin', handle, true);
}
export function unbind(el, dir, vnode) {
    el.removeEventListener(dir.arg || 'focusin', handle);
}
//# sourceMappingURL=clear.js.map