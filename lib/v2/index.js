export function locateNode(vnode /*VNode*/) {
    return vnode.child && (!vnode.data || !vnode.data.transition) ?
        locateNode(vnode.child._vnode) : vnode;
}
//# sourceMappingURL=index.js.map