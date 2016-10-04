import search from './sifter';
export function parseOpts(args, pager, fields, fn /*, target: string|undefined*/, vm, el) {
    var i = 0, len = !args ? 0 : args.length, flags = i === len ? 0 : parseInt(args[i++], 10);
    var opts = {
        flags: flags,
        pager: pager,
        fields: fields,
        vm: vm,
        el: el,
        fn: fn,
        //target,
        str: '',
        array: null,
        change: null
    };
    el.addEventListener('change', opts.change = change.bind(opts));
    return opts;
}
export function cleanup(opts) {
    opts.el.removeEventListener('change', opts.change);
}
function change(e) {
    var el = this.el, value = el.value.trim(), fn = this.fn, pager = this.pager, store = pager['store'];
    if (value.length !== el.value.length) {
        // the new input has whitespace, replace with trimmed string
        el.value = value;
        if (value === this.str)
            return;
    }
    this.str = value;
    if (!value) {
        // TODO
        /*if (util.isFlagSet(param, 1)) {

        }*/
        if (fn)
            this.vm[fn](0);
        pager.state ^= 256 /* LOCAL_SEARCH */;
        store.replace(store.mainArray, 3 /* RETAIN */);
        this.array = null;
        return;
    }
    if (this.array === null)
        pager.state |= 256 /* LOCAL_SEARCH */;
    // TODO
    /*if (util.isFlagSet(param, 2)) {

    }*/
    var target_array;
    if (fn)
        target_array = this.vm[fn](1) || store.mainArray;
    else
        target_array = store.mainArray;
    var result_array = search(value, this, target_array);
    this.array = result_array;
    store.replace(result_array, 3 /* RETAIN */);
}
//# sourceMappingURL=_lsearch.js.map