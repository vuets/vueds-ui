import { parseOpts } from '../_close';
export function bind() {
    if (!this.arg) {
        console.warn('arg is required for v-close.');
    }
}
export function update(value, oldValue) {
    var opts = this.opts;
    if (this.arg && !oldValue && value) {
        this.opts = parseOpts(this.arg.split(','), value, this.el);
    }
}
export function unbind() {
    var opts = this.opts;
    if (opts)
        this.el.removeEventListener(opts.type, opts.handler);
}
//# sourceMappingURL=close.js.map