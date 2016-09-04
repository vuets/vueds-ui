import { FieldType } from 'vueds'
import { FnUpdate, getFnUpdate } from './dom_util'

export interface Opts {
    type: number
    flags: number
    fn: FnUpdate
}

export function parseOpts(args: string[], el): Opts {
    let i = 0, len = args.length, 
        type = parseInt(args[i++], 10),
        flags = i === len ? 0 : parseInt(args[i++], 10)
    
    return {
        type,
        flags,
        fn: getFnUpdate(el, type, flags)
    }
}