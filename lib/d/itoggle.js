import { parseOpts } from '../_itoggle';
export function bind() {
    if (!this.arg) {
        console.warn('arg is required for v-itoggle.');
    }
}
export function update(value, oldValue) {
    var opts = this.opts;
    if (this.arg && !oldValue && value) {
        this.opts = parseOpts(this.arg.split('__'), value, this.vm, this.el);
    }
}
export function unbind() {
    var opts = this.opts;
    if (opts)
        this.el.removeEventListener(opts.type, opts.handler);
}
//# sourceMappingURL=itoggle.js.map