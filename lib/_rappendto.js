import enquire from './enquire';
import { resolveElement } from './dom_util';
import { screen } from './screen_util';
export function parseOpts(args, vm, el) {
    if (args.length < 2)
        throw Error('v-rclass requires the 1st arg (target) and 2nd arg (query)');
    var i = 0, len = args.length, target = args[i++], type = args[i++], query = screen[type] || type, flags = 0 === len ? 0 : parseInt(args[i++], 10), reverse = 0 !== (flags & 16 /* UNMATCH */);
    var opts = {
        target: target,
        query: query,
        flags: flags,
        vm: vm,
        el: el,
        orig_parent: el.parentElement,
        target_parent: null,
        match: null,
        unmatch: null
    };
    if (reverse) {
        opts.match = cbUnmatch.bind(opts);
        opts.unmatch = cbMatch.bind(opts);
    }
    else {
        opts.match = cbMatch.bind(opts);
        opts.unmatch = cbUnmatch.bind(opts);
    }
    enquire.register(query, opts);
    return opts;
}
export function cleanup(opts) {
    enquire.unregister(opts.query, opts);
}
function resolveParent(self) {
    var parent = self.target_parent;
    if (!parent)
        self.target_parent = parent = resolveElement(self.el, self.target, self.vm);
    return parent;
}
function cbMatch() {
    resolveParent(this).appendChild(this.el);
}
function cbUnmatch() {
    this.orig_parent.appendChild(this.el);
}
//# sourceMappingURL=_rappendto.js.map