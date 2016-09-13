import { resolveElement } from '../dom_util';
export function inserted(el, dir, vnode) {
    var value = dir.value, vm = vnode.context, target, parent;
    if (!Array.isArray(value)) {
        target = el;
        parent = resolveElement(target, value, vm);
    }
    else if (value.length === 1) {
        target = el;
        parent = resolveElement(target, value[0], vm);
    }
    else {
        target = resolveElement(el, value[0], vm);
        parent = resolveElement(target, value[1], vm);
    }
    if (dir.arg === '1')
        parent.insertBefore(target, parent.lastElementChild);
    else
        parent.appendChild(target);
}
//# sourceMappingURL=appendto.js.map