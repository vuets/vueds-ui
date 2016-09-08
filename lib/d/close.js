import { parseOpts, cleanup } from '../_close';
export function bind() {
    if (!this.arg) {
        console.warn('arg is required for v-close.');
    }
}
export function update(value, oldValue) {
    if (this.arg && !oldValue && value) {
        this.opts = parseOpts(this.arg.split(','), value, this.el);
    }
}
export function unbind() {
    var opts = this.opts;
    if (opts)
        cleanup(opts);
}
//# sourceMappingURL=close.js.map