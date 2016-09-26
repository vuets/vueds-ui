import { parseOpts, cleanup } from '../_toggle';
export function update(value, oldValue) {
    if (!oldValue && value) {
        this.opts = parseOpts(this.arg && this.arg.split(','), value, this.vm, this.el);
    }
}
export function unbind() {
    var opts = this.opts;
    if (opts)
        cleanup(opts);
}
//# sourceMappingURL=toggle.js.map