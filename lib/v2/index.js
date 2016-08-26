"use strict";
function locateNode(vnode /*VNode*/) {
    return vnode.child && (!vnode.data || !vnode.data.transition) ?
        locateNode(vnode.child._vnode) : vnode;
}
exports.locateNode = locateNode;
//# sourceMappingURL=index.js.map