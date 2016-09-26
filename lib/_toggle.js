import { removeClass, addClass, resolveElementArray } from './dom_util';
export function parseOpts(args, target, vm, el) {
    var i = 0, len = !args ? 0 : args.length, type = i === len ? 'click' : args[i++], flags = i === len ? 0 : parseInt(args[i++], 10);
    var opts = {
        type: type,
        flags: flags,
        target: target,
        array: null,
        vm: vm,
        el: el,
        handler: null,
        index: 0,
        prevIndex: null
    };
    opts.handler = handler.bind(opts);
    el.addEventListener(type, opts.handler);
    return opts;
}
export function cleanup(opts) {
    opts.el.removeEventListener(opts.type, opts.handler);
}
function handler(e) {
    e.preventDefault();
    var self = this, array = self.array, vm = self.vm, el;
    if (!array)
        self.array = array = resolveElementArray(self.el, self.target, vm);
    if (self.prevIndex !== null) {
        el = array[self.prevIndex];
        if (removeClass(el, 'active') && 1 === array.length)
            return;
    }
    self.prevIndex = self.index;
    el = array[self.index];
    if (1 === array.length) {
    }
    else if (++self.index === array.length) {
        self.index = 0;
    }
    addClass(el, 'active');
}
//# sourceMappingURL=_toggle.js.map