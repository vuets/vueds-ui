import { resolveNextPageIndex } from 'vueds/lib/store/';
import { screen } from './screen_util';
export function selectIdx(idx, array, store, flags) {
    store.select(array[idx], !(flags & screen.flags) ? 0 : 4 /* CLICKED_UPDATE */, idx);
}
export function pageAndSelectIdx(page, idx, array, store, flags) {
    store.$populate(2 /* SELECT */, !(flags & screen.flags) ? 0 : 4 /* CLICKED_UPDATE */, store.isMainArray(), idx, page);
}
// =====================================
// list
export function listUp(pager, index_selected, e, flags) {
    e.preventDefault();
    var array = pager.array;
    var index_hidden, pojo;
    if (index_selected === -1) {
        index_hidden = pager.index_hidden;
        // select the visible item at the bottom (last)
        if (index_hidden)
            selectIdx(index_hidden - 1, array, pager['store'], flags);
    }
    else if (!pager.page) {
        if (index_selected)
            selectIdx(index_selected - 1, array, pager['store'], flags);
    }
    else if (index_selected) {
        selectIdx(index_selected - 1, array, pager['store'], flags);
    }
    else {
        // move to previous page and select the last element
        pageAndSelectIdx(--pager.page, array.length - 1, array, pager['store'], flags);
    }
    // TODO focus item when not visible on view
    //opts.vm.$.repeat[index_selected].$el.focus()
}
export function listDown(pager, index_selected, e, flags) {
    e.preventDefault();
    var array = pager.array;
    if (pager.page < pager.page_count) {
        if (index_selected === (array.length - 1)) {
            // move to next page and select the first element
            pageAndSelectIdx(++pager.page, 0, array, pager['store'], flags);
        }
        else {
            selectIdx(index_selected + 1, array, pager['store'], flags);
        }
    }
    else if (pager.index_hidden - 1 > index_selected) {
        selectIdx(index_selected + 1, array, pager['store'], flags);
    }
}
// =====================================
// table-like
export function tableUp(pager, col_size, table_flags, idx, e, flags) {
    e.preventDefault();
    var array = pager.array, index_hidden;
    if (idx === -1) {
        index_hidden = pager.index_hidden;
        // select the visible item at the bottom (last)
        if (index_hidden)
            selectIdx(index_hidden - 1, array, pager['store'], flags);
    }
    else if (idx >= col_size) {
        selectIdx(idx - col_size, array, pager['store'], flags);
    }
    else if (pager.page) {
        // move to previous page
        pageAndSelectIdx(--pager.page, (col_size * (array.length / col_size - 1)) + idx, array, pager['store'], flags);
    }
}
export function tableJumpUp(pager, col_size, table_flags, idx, e, flags) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(Math.min(col_size - 1, pager.index_hidden - 1), array, pager['store'], flags);
    }
    else if (idx >= col_size) {
        selectIdx(idx % col_size, array, pager['store'], flags);
    }
    else if (pager.page) {
        // move to previous page
        pageAndSelectIdx(--pager.page, (col_size * (pager.array.length / col_size - 1)) + (idx % col_size), array, pager['store'], flags);
    }
}
export function tableDown(pager, col_size, table_flags, idx, e, flags) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(0, array, pager['store'], flags);
    }
    else if (idx + col_size < pager.index_hidden) {
        selectIdx(idx + col_size, array, pager['store'], flags);
    }
    else if (pager.page < pager.page_count) {
        // move to next page
        var page = ++pager.page;
        pageAndSelectIdx(page, page === pager.page_count ?
            Math.min(idx % col_size, (pager.size % pager.array.length) - 1) : (idx % col_size), array, pager['store'], flags);
    }
}
export function tableJumpDown(pager, col_size, table_flags, idx, e, flags) {
    e.preventDefault();
    var array = pager.array, row_size = pager.array.length / col_size;
    if (idx === -1) {
        selectIdx(Math.min(col_size * (row_size - 1), pager.index_hidden - 1), array, pager['store'], flags);
    }
    else if (idx < col_size * (row_size - 1)) {
        idx = col_size * (row_size - 1) + (idx % col_size);
        if (idx < pager.index_hidden)
            selectIdx(idx, array, pager['store'], flags);
    }
    else if (pager.page < pager.page_count) {
        // move to next page
        var page = ++pager.page;
        pageAndSelectIdx(page, page === pager.page_count ?
            Math.min(idx % col_size, (pager.size % pager.array.length) - 1) : (idx % col_size), array, pager['store'], flags);
    }
}
export function tableLeft(pager, col_size, table_flags, idx, e, flags) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(Math.min(col_size - 1, pager.index_hidden - 1), array, pager['store'], flags);
    }
    else if (idx % col_size !== 0) {
        selectIdx(idx - 1, array, pager['store'], flags);
    }
    else if (pager.page !== 0) {
        // move to previous page
        pageAndSelectIdx(--pager.page, idx + col_size - 1, array, pager['store'], flags);
    }
}
export function tableJumpLeft(pager, col_size, table_flags, idx, e, flags) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(0, array, pager['store'], flags);
    }
    else if (idx % col_size !== 0) {
        selectIdx(idx - (idx % col_size), array, pager['store'], flags);
    }
    else if (pager.page !== 0) {
        // move to previous page (same as left)
        pageAndSelectIdx(--pager.page, idx + col_size - 1, array, pager['store'], flags);
    }
}
export function tableRight(pager, col_size, table_flags, idx, e, flags) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(Math.min(col_size * (pager.array.length / col_size - 1), pager.index_hidden - 1), array, pager['store'], flags);
    }
    else if (pager.page === pager.page_count) {
        if ((idx + 1) % col_size !== 0 && (idx + 1) < pager.index_hidden) {
            selectIdx(idx + 1, array, pager['store'], flags);
        }
    }
    else if ((idx + 1) % col_size === 0) {
        // move to next page
        var page = ++pager.page;
        pageAndSelectIdx(page, resolveNextPageIndex(page, idx - col_size + 1, pager), array, pager['store'], flags);
    }
    else {
        selectIdx(idx + 1, array, pager['store'], flags);
    }
}
export function tableJumpRight(pager, col_size, table_flags, idx, e, flags) {
    e.preventDefault();
    var array = pager.array;
    if (idx === -1) {
        selectIdx(Math.min(col_size - 1, pager.index_hidden - 1), array, pager['store'], flags);
    }
    else if (pager.page === pager.page_count) {
        if ((idx + 1) % col_size !== 0 && (idx + 1) < pager.index_hidden) {
            selectIdx(Math.min(idx - (idx % col_size) + col_size - 1, pager.index_hidden - 1), array, pager['store'], flags);
        }
    }
    else if ((idx + 1) % col_size == 0) {
        // move to next page (same as right)
        var page = ++pager.page;
        pageAndSelectIdx(page, resolveNextPageIndex(page, idx - col_size + 1, pager), array, pager['store'], flags);
    }
    else {
        selectIdx(idx - (idx % col_size) + col_size - 1, array, pager['store'], flags);
    }
}
export function moveTopOrUp(e, pager, opts) {
    if (!pager.index_hidden)
        return;
    if (opts.col_size) {
        tableJumpUp(pager, opts.col_size, opts.table_flags, pager.index_selected, e, opts.flags);
        return;
    }
    var index_selected = pager.index_selected;
    if (!index_selected)
        listUp(pager, index_selected, e, opts.flags);
    else
        selectIdx(0, pager.array, pager['store'], opts.flags);
}
export function moveBottomOrDown(e, pager, opts) {
    if (!pager.index_hidden)
        return;
    if (opts.col_size) {
        tableJumpDown(pager, opts.col_size, opts.table_flags, pager.index_selected, e, opts.flags);
        return;
    }
    var index_selected = pager.index_selected, index_hidden = pager.index_hidden, clickUpdate = !!(opts.flags & screen.flags);
    if (index_selected === index_hidden - 1)
        listDown(pager, index_selected, e, opts.flags);
    else
        selectIdx(index_hidden - 1, pager.array, pager['store'], opts.flags);
}
export function pageFirst(e, pager, opts) {
    if (opts.col_size) {
        if (pager.index_hidden) {
            tableJumpLeft(pager, opts.col_size, opts.table_flags, pager.index_selected, e, opts.flags);
        }
        return;
    }
    if (!pager.page)
        return;
    e.preventDefault();
    var store = pager['store'];
    pager.page = 0;
    if (opts.flags & 32 /* PAGE_AND_SELECT */) {
        pageAndSelectIdx(0, pager.index_selected, pager.array, store, opts.flags); // TODO pass flag?
    }
    else {
        store.repaint();
    }
}
export function pageLast(e, pager, opts) {
    if (opts.col_size) {
        if (pager.index_hidden) {
            tableJumpRight(pager, opts.col_size, opts.table_flags, pager.index_selected, e, opts.flags);
        }
        return;
    }
    if (pager.page === pager.page_count)
        return;
    e.preventDefault();
    var store = pager['store'], page = pager.page_count;
    pager.page = page;
    if (opts.flags & 32 /* PAGE_AND_SELECT */) {
        pageAndSelectIdx(page, Math.min(pager.index_selected, (pager.size % pager.array.length) - 1), pager.array, store, opts.flags); // TODO pass flag?
    }
    else {
        store.repaint();
    }
}
export function pageSort(e, pager, opts) {
    if (pager.state & 8 /* LOADING */ || !pager.index_hidden)
        return;
    e.preventDefault();
    pager.state ^= 16 /* DESC */;
    pager.store.repaint();
}
export function pageNewer(e, pager, opts) {
    if (pager.state & 264 /* MASK_RPC_DISABLE */)
        return;
    e.preventDefault();
    pager.store.requestNewer();
}
export function pageOlder(e, pager, opts) {
    if (pager.state & 264 /* MASK_RPC_DISABLE */ || !pager.index_hidden)
        return;
    e.preventDefault();
    pager.store.requestOlder();
}
export function pageReload(e, pager, opts) {
    if (opts.flags & 64 /* NO_RELOAD */ || pager.state & 264 /* MASK_RPC_DISABLE */ || !pager.index_hidden)
        return;
    e.preventDefault();
    pager.store.reload();
}
export function pagePrevOrLoad(e, pager, flags) {
    if (pager.page) {
        // goto previous
        e.preventDefault();
        var page = --pager.page;
        if (flags & 32 /* PAGE_AND_SELECT */) {
            pageAndSelectIdx(page, pager.index_selected, pager.array, pager.store, flags);
        }
        else {
            pager.store.repaint();
        }
        return;
    }
    // page unshift
    if ((flags & 128 /* NO_RPC */) || (pager.state & 264 /* MASK_RPC_DISABLE */))
        return;
    if (pager.state & 16 /* DESC */) {
        e.preventDefault();
        pager.store.requestNewer();
    }
    else if (pager.index_hidden) {
        // only allow load older if store is not empty
        e.preventDefault();
        pager.store.requestOlder();
    }
}
export function pageNextOrLoad(e, pager, flags) {
    var store = pager['store'], page = pager.page;
    if (page < pager.page_count) {
        // goto next
        e.preventDefault();
        page = ++pager.page;
        if (flags & 32 /* PAGE_AND_SELECT */) {
            pageAndSelectIdx(page, resolveNextPageIndex(page, pager.index_selected, pager), pager.array, store, flags);
        }
        else {
            store.repaint();
        }
        return;
    }
    var state = pager.state;
    // page push
    if ((flags & 128 /* NO_RPC */) || (state & 264 /* MASK_RPC_DISABLE */) || !pager.index_hidden)
        return;
    e.preventDefault();
    if (state & 16 /* DESC */)
        store.requestOlder();
    else
        store.requestNewer();
}
export function moveLeft(e, pager, opts) {
    if (!opts.col_size) {
        pagePrevOrLoad(e, pager, opts.flags);
    }
    else if (pager.index_hidden) {
        tableLeft(pager, opts.col_size, opts.table_flags, pager.index_selected, e, opts.flags);
    }
}
export function moveRight(e, pager, opts) {
    if (!opts.col_size) {
        pageNextOrLoad(e, pager, opts.flags);
    }
    else if (pager.index_hidden) {
        tableRight(pager, opts.col_size, opts.table_flags, pager.index_selected, e, opts.flags);
    }
}
//# sourceMappingURL=pager_util.js.map