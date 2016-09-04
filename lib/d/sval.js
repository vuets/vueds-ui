import { parseOpts } from '../_sval';
export function bind() {
    this.opts = parseOpts(this.arg.split('__'), this.el);
}
export function update(value, oldValue) {
    this.opts.fn(this.el, value);
}
export function unbind() { }
//# sourceMappingURL=sval.js.map