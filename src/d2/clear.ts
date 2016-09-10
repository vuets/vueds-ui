import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import * as keymage from '../keymage'

function handle(e) {
    // TODO
    //util.hidePopup(true)
    keymage.clearScope()
}

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    el.addEventListener(dir.arg || 'focusin', handle, true)
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    el.removeEventListener(dir.arg || 'focusin', handle)
}