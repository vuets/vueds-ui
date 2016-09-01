import {
    PojoStore, PojoState, Pager, PagerState, SelectionFlags, SelectionType, resolveNextPageIndex
} from 'vueds/lib/store/'

import { screen } from './screen_util'

export function selectIdx(idx: number, array: any[], store: PojoStore<any>, clickUpdate: boolean) {
    let pojo = array[idx], flags = 0
    if (clickUpdate) {
        pojo['vstate'] |= PojoState.UPDATE
        flags = SelectionFlags.CLICKED_UPDATE
    }
    store.select(pojo, flags, idx)
}

export function pageAndSelectIdx(page: number, idx: number, array: any[], store: PojoStore<any>, clickUpdate: boolean) {
    let flags = 0
    if (clickUpdate) {
        let pojo = array[idx]
        pojo['vstate'] |= PojoState.UPDATE
        flags = SelectionFlags.CLICKED_UPDATE
    }
    store.$populate(SelectionType.SELECT, flags,
        store.isMainArray(),
        idx,
        page)
}

// =====================================
// list

export function listUp(pager: Pager, index_selected: number, e: Event, clickUpdate: boolean) {
    e.preventDefault()

    let array = pager.array
    
    var index_hidden: number, pojo
    if (index_selected === -1) {
        index_hidden = pager.index_hidden
        // select the visible item at the bottom (last)
        if (index_hidden) selectIdx(index_hidden - 1, array, pager['store'], clickUpdate)
    } else if (!pager.page) {
        if (index_selected) selectIdx(index_selected - 1, array, pager['store'], clickUpdate)
    } else if (index_selected) {
        selectIdx(index_selected - 1, array, pager['store'], clickUpdate)
    } else {
        // move to previous page and select the last element
        pageAndSelectIdx(--pager.page, array.length - 1, array, pager['store'], clickUpdate)
    }
    
    // TODO focus item when not visible on view
    //opts.vm.$.repeat[index_selected].$el.focus()
}

export function listDown(pager: Pager, index_selected: number, e: Event, clickUpdate: boolean) {
    e.preventDefault()

    let array = pager.array

    if (pager.page < pager.page_count) {
        if (index_selected === (array.length - 1)) {
            // move to next page and select the first element
            pageAndSelectIdx(++pager.page, 0, array, pager['store'], clickUpdate)
        } else {
            selectIdx(index_selected + 1, array, pager['store'], clickUpdate)
        }
    } else if (pager.index_hidden - 1 > index_selected) {
        selectIdx(index_selected + 1, array, pager['store'], clickUpdate)
    }
}

// =====================================
// table-like

export function tableUp(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean) {
    e.preventDefault()
    
    let array = pager.array, index_hidden
    if (idx === -1) {
        index_hidden = pager.index_hidden
        // select the visible item at the bottom (last)
        if (index_hidden) selectIdx(index_hidden - 1, array, pager['store'], clickUpdate)
    } else if (idx >= col_size) {
        selectIdx(idx - col_size, array, pager['store'], clickUpdate)
    } else if (pager.page) {
        // move to previous page
        pageAndSelectIdx(--pager.page, (col_size * (array.length/col_size - 1)) + idx, 
            array, pager['store'], clickUpdate)
    }
}
export function tableJumpUp(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean) {
    e.preventDefault()
    
    let array = pager.array
    if (idx === -1) {
        selectIdx(Math.min(col_size - 1, pager.index_hidden - 1), array, pager['store'], clickUpdate)
    } else if (idx >= col_size) {
        selectIdx(idx % col_size, array, pager['store'], clickUpdate)
    } else if (pager.page) {
        // move to previous page
        pageAndSelectIdx(--pager.page, (col_size * (pager.array.length/col_size - 1)) + (idx % col_size), 
            array, pager['store'], clickUpdate)
    }
}
export function tableDown(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean) {
    e.preventDefault()
    
    let array = pager.array
    if (idx === -1) {
        selectIdx(0, array, pager['store'], clickUpdate)
    } else if (idx + col_size < pager.index_hidden) {
        selectIdx(idx + col_size, array, pager['store'], clickUpdate)
    } else if (pager.page < pager.page_count) {
        // move to next page
        let page = ++pager.page
        pageAndSelectIdx(page, page === pager.page_count ?
            Math.min(idx % col_size, (pager.size % pager.array.length) - 1) : (idx % col_size),
            array, pager['store'], clickUpdate)
    }
}
export function tableJumpDown(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean) {
    e.preventDefault()
    
    let array = pager.array, 
        row_size = pager.array.length / col_size
    if (idx === -1) {
        selectIdx(Math.min(col_size * (row_size-1), pager.index_hidden - 1), array, pager['store'], clickUpdate)
    } else if (idx < col_size * (row_size-1)) {
        idx = col_size * (row_size-1) + (idx % col_size)
        if (idx < pager.index_hidden) selectIdx(idx, array, pager['store'], clickUpdate)
    } else if (pager.page < pager.page_count) {
        // move to next page
        let page = ++pager.page
        pageAndSelectIdx(page, page === pager.page_count ?
            Math.min(idx % col_size, (pager.size % pager.array.length) - 1) : (idx % col_size),
            array, pager['store'], clickUpdate)
    }
}
export function tableLeft(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean) {
    e.preventDefault()
    
    let array = pager.array
    if (idx === -1) {
        selectIdx(Math.min(col_size - 1, pager.index_hidden - 1), array, pager['store'], clickUpdate)
    } else if (idx % col_size !== 0) {
        selectIdx(idx - 1, array, pager['store'], clickUpdate)
    } else if (pager.page !== 0) {
        // move to previous page
        pageAndSelectIdx(--pager.page, idx + col_size - 1, array, pager['store'], clickUpdate)
    }
}
export function tableJumpLeft(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean) {
    e.preventDefault()
    
    let array = pager.array
    if (idx === -1) {
        selectIdx(0, array, pager['store'], clickUpdate)
    } else if (idx % col_size !== 0) {
        selectIdx(idx - (idx % col_size), array, pager['store'], clickUpdate)
    } else if (pager.page !== 0) {
        // move to previous page (same as left)
        pageAndSelectIdx(--pager.page, idx + col_size - 1, array, pager['store'], clickUpdate)
    }
}
export function tableRight(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean) {
    e.preventDefault()
    
    let array = pager.array
    if (idx === -1) {
        selectIdx(Math.min(col_size * (pager.array.length/col_size - 1), pager.index_hidden - 1), 
            array, pager['store'], clickUpdate)
    } else if (pager.page === pager.page_count) {
        if ((idx + 1) % col_size !== 0 && (idx + 1) < pager.index_hidden) {
            selectIdx(idx + 1, array, pager['store'], clickUpdate)
        }
    } else if ((idx + 1) % col_size === 0) {
        // move to next page
        let page = ++pager.page
        pageAndSelectIdx(page, resolveNextPageIndex(page, idx - col_size + 1, pager),
            array, pager['store'], clickUpdate)
    } else {
        selectIdx(idx + 1, array, pager['store'], clickUpdate)
    }
}
export function tableJumpRight(pager: Pager, col_size: number, flags: number, idx: number, e: Event, clickUpdate: boolean) {
    e.preventDefault()
    
    let array = pager.array
    if (idx === -1) {
        selectIdx(Math.min(col_size - 1, pager.index_hidden - 1), array, pager['store'], clickUpdate)
    } else if (pager.page === pager.page_count) {
        if ((idx + 1) % col_size !== 0 && (idx + 1) < pager.index_hidden) {
            selectIdx(Math.min(idx - (idx % col_size) + col_size - 1, pager.index_hidden - 1), 
                array, pager['store'], clickUpdate)
        }
    } else if ((idx + 1) % col_size == 0) {
        // move to next page (same as right)
        let page = ++pager.page
        pageAndSelectIdx(page, resolveNextPageIndex(page, idx - col_size + 1, pager),
            array, pager['store'], clickUpdate)
    } else {
        selectIdx(idx - (idx % col_size) + col_size - 1, array, pager['store'], clickUpdate)
    }
}

// =====================================

export interface Opts {
    col_size: number
    table_flags: number
    flags: number
}

export function moveTopOrUp(e, pager: Pager, opts: Opts) {
    if (!pager.index_hidden) return
    
    if (opts.col_size) {
        tableJumpUp(pager, opts.col_size, opts.table_flags, pager.index_selected, e,
                !!(opts.flags & screen.flags))
        return
    }
    
    var index_selected = pager.index_selected,
        clickUpdate = !!(opts.flags & screen.flags)
    
    if (!index_selected)
        listUp(pager, index_selected, e, clickUpdate)
    else
        selectIdx(0, pager.array, pager['store'], clickUpdate)
}

export function moveBottomOrDown(e, pager: Pager, opts: Opts) {
    if (!pager.index_hidden) return
    
    if (opts.col_size) {
        tableJumpDown(pager, opts.col_size, opts.table_flags, pager.index_selected, e,
                !!(opts.flags & screen.flags))
        return
    }
    
    var index_selected = pager.index_selected,
        index_hidden = pager.index_hidden,
        clickUpdate = !!(opts.flags & screen.flags)
    if (index_selected === index_hidden - 1)
        listDown(pager, index_selected, e, clickUpdate)
    else
        selectIdx(index_hidden - 1, pager.array, pager['store'], clickUpdate)
}

export function pageFirst(e, pager: Pager, opts: Opts) {
    if (opts.col_size) {
        if (pager.index_hidden) {
            tableJumpLeft(pager, opts.col_size, opts.table_flags, pager.index_selected, e,
                    !!(opts.flags & screen.flags))
        }
        return
    }
    
    if (!pager.page) return
    
    e.preventDefault()

    let store = pager['store'] as PojoStore<any>
    pager.page = 0
    if (opts.flags & 16) {
        pageAndSelectIdx(0, pager.index_selected, pager.array, store, false)
    } else {
        store.repaint()
    }
}

export function pageLast(e, pager: Pager, opts: Opts) {
    if (opts.col_size) {
        if (pager.index_hidden) {
            tableJumpRight(pager, opts.col_size, opts.table_flags, pager.index_selected, e,
                    !!(opts.flags & screen.flags))
        }
        return
    }
    
    if (pager.page === pager.page_count) return
    
    e.preventDefault()

    let store = pager['store'] as PojoStore<any>,
        page = pager.page_count
    pager.page = page
    if (opts.flags & 16) {
        pageAndSelectIdx(page, Math.min(pager.index_selected, (pager.size % pager.array.length) - 1), 
            pager.array, store, false)
    } else {
        store.repaint()
    }
}

export function pageSort(e, pager, opts: Opts) {
    if (pager.state & PagerState.LOADING || !pager.index_hidden) return
    
    e.preventDefault()
    pager.state ^= PagerState.DESC
    pager.store.repaint()
}

export function pageNewer(e, pager, opts: Opts) {
    if (pager.state & PagerState.MASK_RPC_DISABLE) return
    
    e.preventDefault()
    pager.store.requestNewer()
}

export function pageOlder(e, pager, opts: Opts) {
    if (pager.state & PagerState.MASK_RPC_DISABLE || !pager.index_hidden) return
    
    e.preventDefault()
    pager.store.requestOlder()
}

export function pageReload(e, pager, opts: Opts) {
    if (opts.flags & 8 || pager.state & PagerState.MASK_RPC_DISABLE || !pager.index_hidden) return
    
    e.preventDefault()
    pager.store.reload()
}

export function pagePrevOrLoad(e, pager, opts: Opts) {
    if (pager.page) {
        // goto previous
        e.preventDefault()
        let page = --pager.page
        if (opts.flags & 16) {
            pageAndSelectIdx(page, pager.index_selected, pager.array, pager.store, false)
        } else {
            pager.store.repaint()
        }
        return
    }
    // page unshift
    if ((opts.flags & 1) || (pager.state & PagerState.MASK_RPC_DISABLE)) return
    
    if (pager.state & PagerState.DESC) {
        e.preventDefault()
        pager.store.requestNewer()
    } else if (pager.index_hidden) {
        // only allow load older if store is not empty
        e.preventDefault()
        pager.store.requestOlder()
    }
}

export function pageNextOrLoad(e, pager: Pager, opts: Opts) {
    let store = pager['store'] as PojoStore<any>,
        page = pager.page
    if (page < pager.page_count) {
        // goto next
        e.preventDefault()
        page = ++pager.page
        if (0 === (opts.flags & 16)) {
            store.repaint()
            return
        }

        pageAndSelectIdx(page, resolveNextPageIndex(page, pager.index_selected, pager), 
            pager.array, store, false)
        return
    }

    let state = pager.state
    // page push
    if ((opts.flags & 1) || (state & PagerState.MASK_RPC_DISABLE) || !pager.index_hidden) return
    
    e.preventDefault()

    if (state & PagerState.DESC)
        store.requestOlder()
    else
        store.requestNewer()
}

export function moveLeft(e, pager: Pager, opts: Opts) {
    if (!opts.col_size) {
        pagePrevOrLoad(e, pager, opts)
    } else if (pager.index_hidden) {
        tableLeft(pager, opts.col_size, opts.table_flags, pager.index_selected, e,
                !!(opts.flags & screen.flags))
    }
}

export function moveRight(e, pager: Pager, opts: Opts) {
    if (!opts.col_size) {
        pageNextOrLoad(e, pager, opts)
    } else if (pager.index_hidden) {
        tableRight(pager, opts.col_size, opts.table_flags, pager.index_selected, e,
                !!(opts.flags & screen.flags))
    }
}