import { defp } from 'vueds/lib/util';
export function bind() {
    if (!this.arg) {
        console.warn('arg is required for v-defp.');
    }
}
export function update(value, oldValue) {
    if (this.arg && !oldValue && value)
        defp(this.el, this.arg, value);
}
//# sourceMappingURL=defp.js.map