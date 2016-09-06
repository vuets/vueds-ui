import { EventFlags } from 'vueds'
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

export function parseOpts(args: string[], target, el): Opts {
    let i = 0, 
        len = args.length,
        type = args[i++],
        flags = parseInt(args[i++], 10)
    
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

function handler(e) {
    var self: Opts = this,
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