// dummy (for the mean time)
export default {};
/*import * as Vue from 'vue'

var FragmentFactory = Vue['FragmentFactory']
var before = Vue.util.before
var replace = Vue.util.replace
var remove = Vue.util.remove
var createAnchor = Vue.util.createAnchor

export var templates = {}

Vue.directive('xp', {
    terminal: true,
    bind() {

    },
    unbind() {
        var str_frag = this.str_frag,
            el_frag = this.el_frag
        
        if (!str_frag)
            return
        
        str_frag.remove()
        if (el_frag)
            el_frag.remove()
    },
    update(value, oldValue) {
        var el = this.el,
            arg = this.arg,
            host = this._host,
            scope = this._scope,
            frag = this._frag,
            vm = this.vm,
            tpl = templates[arg],
            anchor
        
        if (!tpl) {
            console.warn(`The xp template ${arg} could not be resolved.`)
            return
        }
        
        this.str_frag = new FragmentFactory(vm, tpl.main.call(this, value)).create(host, scope, frag)
        if (!el.firstChild) {
            if (value.$replace) {
                this.str_frag.before(el, false)
                remove(el)
            } else {
                el.appendChild(anchor = createAnchor('v-xp', false))
                this.str_frag.before(anchor, false)
            }
            return
        }

        this.el_frag = new FragmentFactory(vm, el.innerHTML).create(host, scope, frag)
        el.innerHTML = ' '
        this.str_frag.before(el.firstChild, false)

        anchor = el.querySelector('content')

        if (value.$replace) {
            while (el.firstChild) before(el.firstChild, el)

            this.el_frag.before(anchor || el)
            remove(el)
            if (anchor)
                remove(anchor)
        } else if (anchor) {
            this.el_frag.before(anchor)
            remove(anchor)
        } else {
            el.appendChild(anchor = createAnchor('v-xp', false))
            this.el_frag.before(anchor)
        }
    }
})*/
//# sourceMappingURL=index.js.map