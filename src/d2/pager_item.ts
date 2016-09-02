import { VNode, VNodeDirective, VNodeWithData } from '../v2/'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    el.pager_item = dir.value
}

//export function update(el: any, { value, oldValue }: VNodeDirective, vnode: VNodeWithData) { }

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}