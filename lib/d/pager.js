import { attachOptsTo, cleanup } from '../_pager';
export function update(value, oldValue) {
    if (!oldValue && value) {
        attachOptsTo(this.el, this.arg && this.arg.split(','), value, this.vm);
    }
}
export function unbind() {
    var opts = this.el.pager_opts;
    if (opts)
        cleanup(opts);
}
//# sourceMappingURL=pager.js.map