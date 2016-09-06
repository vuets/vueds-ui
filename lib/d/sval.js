import { parseOpts } from '../_sval';
export function bind() {
    if (!this.arg) {
        console.warn('arg is required for v-sval.');
        return;
    }
    this.opts = parseOpts(this.arg.split('__'), this.el);
}
export function update(value, oldValue) {
    var opts = this.opts;
    if (opts)
        opts.fn(this.el, value);
}
export function unbind() { }
//# sourceMappingURL=sval.js.map