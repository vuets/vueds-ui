import { resolveElement, removeClass, addClass } from './dom_util';
export function parseOpts(args, array, vm, el) {
    var i = 0, len = args.length, class_def = args[i++], class_alt = i === len ? '' : args[i++], type = i === len ? 'click' : (args[i++] || 'click'), flags = i === len ? 16 /* CHECK_INITIIAL */ : parseInt(args[i++], 10), check_initial = 0 !== (flags & 16 /* CHECK_INITIIAL */);
    var opts = {
        class_def: class_def,
        class_alt: class_alt,
        type: type,
        flags: flags,
        check_initial: check_initial,
        array: array,
        vm: vm,
        el: el,
        handler: null,
        index: 0,
        prevIndex: null,
        el_icon: el.firstElementChild || el
    };
    opts.handler = handler.bind(opts);
    el.addEventListener(type, opts.handler);
    return opts;
}
export function cleanup(opts) {
    opts.el.removeEventListener(opts.type, opts.handler);
}
function resolveTarget(self, array, idx) {
    var obj = array[idx];
    return obj.tagName ? obj : (array[idx] = resolveElement(self.el, obj, self.vm));
}
function handler(e) {
    e.preventDefault();
    var self = this, array = self.array, el;
    if (self.prevIndex !== null) {
        el = resolveTarget(self, array, self.prevIndex);
        if (removeClass(el, 'active')) {
            removeClass(self.el_icon, self.class_def);
            if (self.class_alt)
                addClass(self.el_icon, self.class_alt);
            /*if (array_entry.length > 1 && array_entry[1] && !util.vmGetHandler(self.vm)(array_entry[1], self)) {
                // depends on the return value
                array_entry[1] = null
            }

            vm = el.vue_vm || util.getFirstVm(el)
            if (vm && vm.handle(2)) vm.$broadcast('vui', 2)*/
            if (1 === array.length) {
                self.prevIndex = null;
                //if (el.id && (el.className === 'modal' || el.className === 'dropdown')) document.modalId = null
                return;
            }
        }
    }
    el = resolveTarget(self, array, self.index);
    if (self.check_initial && self.prevIndex === null && removeClass(el, 'active')) {
        // was already visible and configure to hide on first toggle
        removeClass(self.el_icon, self.class_def);
        if (self.class_alt)
            addClass(self.el_icon, self.class_alt);
        self.check_initial = false;
        return;
    }
    self.prevIndex = self.index;
    if (1 === array.length) {
        //if (el.id && (el.className === 'modal' || el.className === 'dropdown')) document.modalId = el.id
    }
    else if (++self.index === array.length) {
        self.index = 0;
    }
    if (self.class_alt)
        removeClass(self.el_icon, self.class_alt);
    addClass(self.el_icon, self.class_def);
    /*if (array_entry.length > 1 && array_entry[1] && !util.vmGetHandler(self.vm)(array_entry[1], self)) {
        // call handler only once (initialization)
        array_entry[1] = null
    }*/
    addClass(el, 'active');
    //vm = el.vue_vm || util.getFirstVm(el)
    //if (vm && vm.handle(1)) vm.$broadcast('vui', 1)
}
//# sourceMappingURL=_itoggle.js.map