import enquire from './enquire'
import { addClass, removeClass, resolveElement } from './dom_util'
import { screen } from './screen_util'

export interface Opts {
    target: any
    query: string
    flags: number

    vm: any
    el: any
    orig_parent: any
    target_parent: any

    match: any
    unmatch: any
}

export const enum Flags {
    UNMATCH = 16
}

export function parseOpts(args: string[], vm, el): Opts {
    if (args.length < 2)
        throw Error('v-rclass requires the 1st arg (target) and 2nd arg (query)')
    
    let i = 0, 
        len = args.length,
        target = args[i++],
        type = args[i++],
        query = screen[type] || type,
        flags = 0 === len ? 0 : parseInt(args[i++], 10),
        reverse = 0 !== (flags & Flags.UNMATCH)
    
    let opts: Opts = {
        target,
        query, 
        flags,
        vm,
        el,
        orig_parent: el.parentElement,
        target_parent: null,
        match: null,
        unmatch: null
    }

    if (reverse) {
        opts.match = cbUnmatch.bind(opts)
        opts.unmatch = cbMatch.bind(opts)
    } else {
        opts.match = cbMatch.bind(opts)
        opts.unmatch = cbUnmatch.bind(opts)
    }

    enquire.register(query, opts)

    return opts
}

export function cleanup(opts: Opts) {
    enquire.unregister(opts.query, opts)
}

function resolveParent(self: Opts) {
    var parent = self.target_parent
    if (!parent)
        self.target_parent = parent = resolveElement(self.el, self.target, self.vm)
    return parent
}

function cbMatch(this: Opts) {
    resolveParent(this).appendChild(this.el)
}

function cbUnmatch(this: Opts) {
    this.orig_parent.appendChild(this.el)
}