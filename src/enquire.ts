// ported from enquire.js
import { noop } from 'vueds/lib/util'

/**
 * Helper function for iterating over a collection
 *
 * @param collection
 * @param fn
 */
/*function each(collection: any[], fn: Function) {
    var i = 0,
        length = collection.length
    
    for (i; i < length; i++) {
        // allow early exit
        if (false === fn(collection[i], i)) break
    }
}*/

/**
 * Helper function for determining whether target object is a function
 *
 * @param target the object under test
 * @return {Boolean} true if function, false otherwise
 */
/*function isFunction(target) {
    return typeof target === 'function'
}*/

export interface Opts {
    match: Function
    unmatch?: Function
    setup?: Function
    destroy?: Function
    deferSetup?: boolean
}

function matchLazySetup(this: QueryHandler) {
    if (!this.initialized) {
        this.initialized = true
        this.setup()
    }
    
    this.opts.match()
}

class QueryHandler {
    initialized: boolean
    setup: Function
    match: Function
    unmatch: Function
    destroy: Function

    constructor(public opts: Opts) {
        this.initialized = !opts.deferSetup
        this.setup = opts.setup || noop
        this.match = this.initialized ? opts.match : matchLazySetup.bind(this)
        this.unmatch = opts.unmatch || noop
        this.destroy = opts.destroy || this.unmatch
    }
}

function matchHandlers(handlers: QueryHandler[]) {
    for (let handler of handlers)
        handler.match()
}

function unmatchHandlers(handlers: QueryHandler[]) {
    for (let handler of handlers)
        handler.unmatch()
}

function cbAssess(this: MediaQuery, mql: MediaQueryList) {
    this.mql = mql
    this.assess()
}

/**
 * Represents a single media query, manages it's state and registered handlers for this query
 */
class MediaQuery {
    handlers: QueryHandler[] = []
    mql: MediaQueryList
    listener: any
    constructor(public query: string, public isUnconditional: boolean) {
        this.mql = matchMedia(query)
        this.listener = cbAssess.bind(this)
    }

    matches(): boolean {
        return this.mql.matches || this.isUnconditional
    }

    add(opts: Opts) {
        const qh = new QueryHandler(opts)
        this.handlers.push(qh)
        this.matches() && qh.match()
    }

    remove(opts: Opts) {
        let handlers = this.handlers,
            len = handlers.length,
            i = 0
        for (; i < len; i++) {
            let h = handlers[i]
            if (opts !== h.opts)
                continue
            
            h.destroy()
            handlers.splice(i, 1)
            break
        }
    }

    clear() {
        for (let handler of this.handlers)
            handler.destroy()
        this.mql.removeListener(this.listener)
        this.handlers.length = 0 //clear array
    }

    assess() {
        if (this.matches)
            matchHandlers(this.handlers)
        else
            unmatchHandlers(this.handlers)
    }
}

interface MediaQueryMap {
    [index: string]: MediaQuery|null
}



/**
 * Registers a handler for the given media query.
 */
export class MediaQueryRegistry {
    private queries: MediaQueryMap = {}
    private browserIsIncapable: boolean
    constructor() {
        if (!matchMedia)
            throw new Error('matchMedia not present, legacy browsers require a polyfill')

        this.browserIsIncapable = !matchMedia('only all').matches
    }

    register(q: string, entry: Opts, shouldDegrade?: boolean) {
        let queries = this.queries,
            query = queries[q]
        
        if (!query)
            queries[q] = query = new MediaQuery(q, !!shouldDegrade && this.browserIsIncapable)
        
        query.add(entry)
        return this
    }
    
    unregister(q: string, entry?: Opts) {
        const query = this.queries[q]
        if (!query) return this

        if (entry) {
            query.remove(entry)
        } else {
            query.clear()
            this.queries[q] = null
            //delete this.queries[q]
        }

        return this
    }
}

export default new MediaQueryRegistry()