import { VNodeDirective, VNodeWithData } from '../v2/'
import * as keymage from '../keymage'
import { getPopup, hidePopup } from '../dom_util'

function handle(e) {
    keymage.clearScope()
    hidePopup(getPopup())
}

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    el.addEventListener(dir.arg || 'focusin', handle, true)
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    el.removeEventListener(dir.arg || 'focusin', handle)
}