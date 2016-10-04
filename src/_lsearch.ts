import { PojoStore, Pager, PagerState, SelectionType } from 'vueds/lib/store/'
import search from './sifter'

export const enum Flags {
    SELECT_FROM_PARENT = 8
}

export interface Opts {
    flags: number

    pager: Pager
    fields: string[]
    vm: any
    el: any
    fn?: string
    //target?: any

    str: string
    array: any

    change: any
}

export function parseOpts(args: string[]|any, pager: Pager, fields: string[], fn: string|undefined/*, target: string|undefined*/, vm ,el): Opts {
    let i = 0,
        len = !args ? 0 : args.length,
        flags = i === len ? 0 : parseInt(args[i++], 10)
    
    let opts: Opts = {
        flags,

        pager,
        fields,
        vm,
        el,
        fn,
        //target,

        str: '',
        array: null,

        change: null
    }

    el.addEventListener('change', opts.change = change.bind(opts))

    return opts
}

export function cleanup(opts: Opts) {
    opts.el.removeEventListener('change', opts.change)
}

function change(this: Opts, e) {
    let el = this.el,
        value = el.value.trim(),
        fn = this.fn,
        pager = this.pager,
        store: PojoStore<any> = pager['store']

    if (value.length !== el.value.length) {
        // the new input has whitespace, replace with trimmed string
        el.value = value
        if (value === this.str) return
    }
    
    this.str = value
    if (!value) {
        // TODO
        /*if (util.isFlagSet(param, 1)) {

        }*/
        if (fn)
            this.vm[fn](0)
        
        pager.state ^= PagerState.LOCAL_SEARCH
        store.replace(store.mainArray, SelectionType.RETAIN)
        this.array = null
        return
    }

    if (this.array === null)
        pager.state |= PagerState.LOCAL_SEARCH
    
    // TODO
    /*if (util.isFlagSet(param, 2)) {

    }*/

    let target_array
    if (fn)
        target_array = this.vm[fn](1) || store.mainArray
    else
        target_array = store.mainArray
    
    let result_array = search(value, this, target_array)
    this.array = result_array
    store.replace(result_array, SelectionType.RETAIN)
}