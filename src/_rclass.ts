import enquire from './enquire'
import { addClass, removeClass } from './dom_util'
import { screen } from './screen_util'

export interface Opts {
    clazz: string
    query: string
    flags: number

    el: any

    match: any
    unmatch: any
}

export const enum Flags {
    UNMATCH = 16
}

export function parseOpts(args: string[], el): Opts {
    if (args.length < 2)
        throw Error('v-rclass requires the 1st arg (class) and 2nd arg (query)')
    
    let i = 0, 
        len = args.length,
        clazz = args[i++],
        type = args[i++],
        query = screen[type] || type,
        flags = 0 === len ? 0 : parseInt(args[i++], 10),
        reverse = 0 !== (flags & Flags.UNMATCH)
    
    let opts: Opts = {
        clazz,
        query, 
        flags,
        el,
        match: null,
        unmatch: null
    }

    if (reverse) {
        opts.match = cbRemoveClass.bind(opts)
        opts.unmatch = cbAddClass.bind(opts)
    } else {
        opts.match = cbAddClass.bind(opts)
        opts.unmatch = cbRemoveClass.bind(opts)
    }

    enquire.register(query, opts)

    return opts
}

export function cleanup(opts: Opts) {
    enquire.unregister(opts.query, opts)
}

function cbAddClass(this: Opts) {
    addClass(this.el, this.clazz)
}

function cbRemoveClass(this: Opts) {
    removeClass(this.el, this.clazz)
}