import { PojoStore, PojoState, Pager, SelectionFlags, SelectionType, resolveNextPageIndex } from 'vueds/lib/store/'

export function selectIdx(idx: number, array: any[], store: PojoStore<any>, clickUpdate: boolean) {
    let pojo = array[idx], flags = 0
    if (clickUpdate) {
        pojo = array[idx];
        pojo['vstate'] |= PojoState.UPDATE
        flags = SelectionFlags.CLICKED_UPDATE
    }
    store.select(pojo, flags, idx)
}

export function pageAndSelectIdx(page: number, idx: number, array: any[], store: PojoStore<any>, clickUpdate: boolean) {
    let pojo = array[idx], flags = 0
    if (clickUpdate) {
        pojo = array[idx];
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
    //current.vm.$.repeat[index_selected].$el.focus()
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
