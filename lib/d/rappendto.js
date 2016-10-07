import { parseOpts, cleanup } from '../_rappendto';
export function bind() {
    if (!this.arg) {
        console.warn('arg is required for v-rappendto.');
        return;
    }
    this.opts = parseOpts(this.arg.split(','), this.vm, this.el);
}
export function unbind() {
    var opts = this.opts;
    if (opts)
        cleanup(opts);
}
//# sourceMappingURL=rappendto.js.map