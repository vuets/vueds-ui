import { EventFlags } from 'vueds/lib/types'
import { resolveElementArray, removeClass } from './dom_util'
import { prevent } from './util'

export const enum Flags {
    SELECT_FROM_PARENT = 8
}

export interface Opts {
    type: string
    flags: number

    target: any
    el: any

    handler: any
    array: any[]|null
}

export function parseOpts(args: string[]|any, target, el): Opts {
    let i = 0, 
        len = !args ? 0 : args.length,
        type = i === len ? 'click' : args[i++],
        flags = i === len ? 0 : parseInt(args[i++], 10)
    
    let opts: Opts = {
        type,
        flags,

        target,
        el,

        handler: null,
        array: null
    }

    opts.handler = handler.bind(opts)
    el.addEventListener(type, opts.handler, 0 !== (flags & EventFlags.CAPTURING))
    return opts
}

export function cleanup(opts: Opts) {
    opts.el.removeEventListener(opts.type, opts.handler)
}

function handler(this: Opts, e) {
    let self = this,
        array = self.array,
        vm

    if (!array) {
        self.array = array = resolveElementArray(self.el, self.target, 
            0 !== (self.flags & Flags.SELECT_FROM_PARENT))
    }

    prevent(e, self.flags)

    for (let el of array as any[]) {
        removeClass(el, 'active')
        //vm = el.vue_vm || util.getFirstVm(el)
        //if (vm && vm.handle(2)) vm.$broadcast('vui', 2)
    }
}