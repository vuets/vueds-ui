import { getFnUpdate } from './dom_util';
export function parseOpts(args, el) {
    var i = 0, len = args.length, type = parseInt(args[i++], 10), flags = i === len ? 0 : parseInt(args[i++], 10);
    return {
        type: type,
        flags: flags,
        fn: getFnUpdate(el, type, flags)
    };
}
//# sourceMappingURL=_sval.js.map