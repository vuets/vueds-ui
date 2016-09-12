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

export function bind() {
    this.el.addEventListener(this.arg || 'focusin', handle, true)
}

export function unbind() {
    this.el.removeEventListener(this.arg || 'focusin', handle)
}