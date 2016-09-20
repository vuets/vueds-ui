import * as keymage from '../keymage';
import { getPopup, hidePopup } from '../dom_util';
function handle(e) {
    keymage.clearScope();
    hidePopup(getPopup());
}
export function bind() {
    this.el.addEventListener(this.arg || 'focusin', handle, true);
}
export function unbind() {
    this.el.removeEventListener(this.arg || 'focusin', handle);
}
//# sourceMappingURL=clear.js.map