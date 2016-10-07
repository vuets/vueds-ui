import { resolveElement, removeClass, addClass, resolveElementArray } from './dom_util'

export interface Opts {
    type: string
    flags: number

    target: any
    array: any
    vm: any
    el: any

    handler: any
    index: number
    prevIndex: number | null
}

export function parseOpts(args: string[]|any, target: any, vm, el): Opts {
    let i = 0,
        len = !args ? 0 : args.length,
        type = i === len ? 'click' : args[i++],
        flags = i === len ? 0 : parseInt(args[i++], 10)
    
    let opts: Opts = {
        type,
        flags,

        target,
        array: null,
        vm,
        el,

        handler: null,
        index: 0,
        prevIndex: null
    }

    opts.handler = handler.bind(opts)
    el.addEventListener(type, opts.handler)
    return opts
}

export function cleanup(opts: Opts) {
    opts.el.removeEventListener(opts.type, opts.handler)
}

function handler(this: Opts, e) {
    e.preventDefault()

    let self = this,
        array = self.array,
        vm = self.vm,
        el

    if (!array)
        self.array = array = resolveElementArray(self.el, self.target, vm)
    
    if (self.prevIndex !== null) {
        el = array[self.prevIndex]
        if (removeClass(el, 'active') && 1 === array.length) return
    }

    self.prevIndex = self.index
    el = array[self.index]

    if (1 === array.length) {
        // non-rotating index
    } else if (++self.index === array.length) {
        self.index = 0
    }

    addClass(el, 'active')
}