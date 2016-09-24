import enquire from './enquire';
import { addClass, removeClass } from './dom_util';
import { screen } from './screen_util';
export function parseOpts(args, el) {
    if (args.length < 2)
        throw Error('v-rclass requires the 1st arg (class) and 2nd arg (query)');
    var i = 0, len = args.length, clazz = args[i++], type = args[i++], query = screen[type] || type, flags = 0 === len ? 0 : parseInt(args[i++], 10), reverse = 0 !== (flags & 16 /* UNMATCH */);
    var opts = {
        clazz: clazz,
        query: query,
        flags: flags,
        el: el,
        match: null,
        unmatch: null
    };
    if (reverse) {
        opts.match = cbRemoveClass.bind(opts);
        opts.unmatch = cbAddClass.bind(opts);
    }
    else {
        opts.match = cbAddClass.bind(opts);
        opts.unmatch = cbRemoveClass.bind(opts);
    }
    enquire.register(query, opts);
    return opts;
}
export function cleanup(opts) {
    enquire.unregister(opts.query, opts);
}
function cbAddClass() {
    addClass(this.el, this.clazz);
}
function cbRemoveClass() {
    removeClass(this.el, this.clazz);
}
//# sourceMappingURL=_rclass.js.map