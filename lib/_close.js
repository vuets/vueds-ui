import { resolveElementArray, removeClass } from './dom_util';
import { prevent } from './util';
export function parseOpts(args, target, el) {
    var i = 0, len = !args ? 0 : args.length, type = i === len ? 'click' : args[i++], flags = i === len ? 0 : parseInt(args[i++], 10);
    var opts = {
        type: type,
        flags: flags,
        target: target,
        el: el,
        handler: null,
        array: null
    };
    opts.handler = handler.bind(opts);
    el.addEventListener(type, opts.handler, 0 !== (flags & 4 /* CAPTURING */));
    return opts;
}
export function cleanup(opts) {
    opts.el.removeEventListener(opts.type, opts.handler);
}
function handler(e) {
    var self = this, array = self.array, vm;
    if (!array) {
        self.array = array = resolveElementArray(self.el, self.target, 0 !== (self.flags & 8 /* SELECT_FROM_PARENT */));
    }
    prevent(e, self.flags);
    for (var _i = 0, _a = array; _i < _a.length; _i++) {
        var el = _a[_i];
        removeClass(el, 'active');
        //vm = el.vue_vm || util.getFirstVm(el)
        //if (vm && vm.handle(2)) vm.$broadcast('vui', 2)
    }
}
//# sourceMappingURL=_close.js.map