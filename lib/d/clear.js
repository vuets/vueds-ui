import * as keymage from '../keymage';
function handle(e) {
    // TODO
    //util.hidePopup(true)
    keymage.clearScope();
}
export function bind() {
    this.el.addEventListener(this.arg || 'focusin', handle, true);
}
export function unbind() {
    this.el.removeEventListener(this.arg || 'focusin', handle);
}
//# sourceMappingURL=clear.js.map