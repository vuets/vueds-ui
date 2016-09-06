import { resolveElement, removeClass, addClass } from './dom_util'

export interface Opts {
    type: string
    check_initial?: boolean
    class_def: string
    class_alt: string
    
    array: any[]
    vm: any
    el: any

    handler: any
    index: number
    prevIndex: number|null
    el_icon: any
}

export function parseOpts(args: string[], array: any[], vm, el): Opts {
    let i = 0, 
        len = args.length,
        type = args[i++],
        check_initial = args[i++] === '1',
        class_def = args[i++],
        class_alt = i !== len ? args[i++] : ''
    
    let opts: Opts = {
        type,
        class_def,
        class_alt,
        check_initial,

        array,
        vm,
        el,

        handler: null,
        index: 0,
        prevIndex: null,
        el_icon: el.firstElementChild || el
    }

    opts.handler = handler.bind(opts)
    el.addEventListener(type, opts.handler)
    return opts
}

function resolveTarget(self: Opts, array_entry: any[], vm) {
    var obj = array_entry[0]
    return obj.nodeName ? obj : (array_entry[0] = resolveElement(self.el, obj, vm))
}

function handler(e) {
    e.preventDefault()

    var self: Opts = this,
        array = self.array,
        el,
        vm,
        array_entry

    if (self.prevIndex != null) {
        array_entry = array[self.prevIndex]
        el = resolveTarget(self, array_entry, self.vm)
        if (removeClass(el, 'active')) {
            removeClass(self.el_icon, self.class_def)
            if (self.class_alt)
                addClass(self.el_icon, self.class_alt)

            /*if (array_entry.length > 1 && array_entry[1] && !util.vmGetHandler(self.vm)(array_entry[1], self)) {
                // depends on the return value
                array_entry[1] = null
            }

            vm = el.vue_vm || util.getFirstVm(el)
            if (vm && vm.handle(2)) vm.$broadcast('vui', 2)*/
            if (1 === array.length) {
                self.prevIndex = null
                //if (el.id && (el.className === 'modal' || el.className === 'dropdown')) document.modalId = null

                return
            }
        }
    }

    array_entry = array[self.index]
    el = resolveTarget(self, array_entry, self.vm)

    if (self.check_initial && self.prevIndex == null && removeClass(el, 'active')) {
        // was already visible and configure to hide on first toggle
        removeClass(self.el_icon, self.class_def)
        if (self.class_alt)
            addClass(self.el_icon, self.class_alt)

        self.check_initial = false
        return
    }

    self.prevIndex = self.index

    if (1 === array.length) {
        //if (el.id && (el.className === 'modal' || el.className === 'dropdown')) document.modalId = el.id
    } else if (++self.index === array.length) {
        self.index = 0
    }

    if (self.class_alt)
        removeClass(self.el_icon, self.class_alt)
    addClass(self.el_icon, self.class_def)

    /*if (array_entry.length > 1 && array_entry[1] && !util.vmGetHandler(self.vm)(array_entry[1], self)) {
        // call handler only once (initialization)
        array_entry[1] = null
    }*/

    addClass(el, 'active')
    //vm = el.vue_vm || util.getFirstVm(el)
    //if (vm && vm.handle(1)) vm.$broadcast('vui', 1)
}