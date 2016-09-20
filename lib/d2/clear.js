import * as keymage from '../keymage';
import { getPopup, hidePopup } from '../dom_util';
function handle(e) {
    keymage.clearScope();
    hidePopup(getPopup());
}
export function inserted(el, dir, vnode) {
    el.addEventListener(dir.arg || 'focusin', handle, true);
}
export function unbind(el, dir, vnode) {
    el.removeEventListener(dir.arg || 'focusin', handle);
}
//# sourceMappingURL=clear.js.map