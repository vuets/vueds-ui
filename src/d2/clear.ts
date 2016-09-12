import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import * as keymage from '../keymage'
import { removeClass } from '../dom_util'

var initialized = false,
    popup

function handle(e) {
    keymage.clearScope()
    
    if (!initialized) {
        initialized = true
        popup = document.getElementById('popup')
    }
    
    if (popup)
        removeClass(popup, 'active')
}

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    el.addEventListener(dir.arg || 'focusin', handle, true)
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    el.removeEventListener(dir.arg || 'focusin', handle)
}