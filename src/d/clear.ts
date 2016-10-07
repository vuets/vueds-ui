import * as keymage from '../keymage'
import { getPopup, hidePopup } from '../dom_util'

function handle(e) {
    keymage.clearScope()
    hidePopup(getPopup())
}

export function bind(this: any) {
    this.el.addEventListener(this.arg || 'focusin', handle, true)
}

export function unbind(this: any) {
    this.el.removeEventListener(this.arg || 'focusin', handle)
}