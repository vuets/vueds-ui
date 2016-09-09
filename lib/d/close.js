import { parseOpts, cleanup } from '../_close';
export function update(value, oldValue) {
    if (!oldValue && value) {
        this.opts = parseOpts(this.arg && this.arg.split(','), value, this.el);
    }
}
export function unbind() {
    var opts = this.opts;
    if (opts)
        cleanup(opts);
}
//# sourceMappingURL=close.js.map