import { parseOpts, cleanup } from '../_lsearch';
export function update(value, oldValue) {
    if (oldValue)
        return;
    if (value && value.pager && value.fields) {
        this.lsearch = parseOpts(this.arg && this.arg.split(','), value.pager, value.fields, value.fn, this.vm, this.el);
    }
    else {
        console.warn('v-lsearch requires the value: { pager: Pager, fields: string[], fn? }');
    }
}
export function unbind() {
    var lsearch = this.lsearch;
    if (lsearch)
        cleanup(lsearch);
}
//# sourceMappingURL=lsearch.js.map