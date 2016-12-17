import { parseOpts, cleanup } from '../_suggest';
export function update(value, oldValue) {
    if (oldValue)
        return;
    if (value && value.pojo && value.field && value.fetch)
        this.suggest = parseOpts(this.arg && this.arg.split(','), value.pojo, value.field, value.fetch, this.onSelect, this.vm, this.el);
    else
        console.warn('Must provide value: { pojo: obj, field: string, fetch: function }');
}
export function unbind() {
    var suggest = this.suggest;
    if (suggest)
        cleanup(suggest);
}
//# sourceMappingURL=suggest.js.map