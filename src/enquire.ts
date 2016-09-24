/**
 * Helper function for iterating over a collection
 *
 * @param collection
 * @param fn
 */
function each(collection: any[], fn: Function) {
    var i = 0,
        length = collection.length
    
    for (i; i < length; i++) {
        // allow early exit
        if (false === fn(collection[i], i)) break
    }
}

/**
 * Helper function for determining whether target object is a function
 *
 * @param target the object under test
 * @return {Boolean} true if function, false otherwise
 */
function isFunction(target) {
    return typeof target === 'function';
}

interface QueryHandlerOpts {
    match: Function
    unmatch: Function
    setup: Function
    deferSetup?: boolean
}

class QueryHandler {
    initialized = false

    constructor(private options: any) {
        !options.deferSetup && this.setup();
    }

    setup() {
        if (this.options.setup)
            this.options.setup()
        
        this.initialized = true
    }

    on() {
        !this.initialized && this.setup()
        this.options.match && this.options.match()
    }

    off() {
        this.options.unmatch && this.options.unmatch()
    }

    destroy() {
        this.options.destroy ? this.options.destroy() : this.off()
    }

    equals(target): boolean {
        return this.options === target || this.options.match === target
    }
}

function mqListener(this: MediaQuery, mql: MediaQueryList) {
    this.mql = mql
}

function cbClear(handler) {
    handler.destroy()
}

function cbOn(handler) {
    handler.on()
}

function cbOff(handler) {
    handler.off()
}

/**
 * Represents a single media query, manages it's state and registered handlers for this query
 */
class MediaQuery {
    handlers: QueryHandler[] = []
    mql: MediaQueryList
    listener: any
    cbRemoveHandler: any
    constructor(private query: string, private isUnconditional: boolean) {
        this.mql = matchMedia(query)
        this.listener = mqListener.bind(this)
    }

    matches(): boolean {
        return this.mql.matches || this.isUnconditional;
    }

    addHandler(handler) {
        const qh = new QueryHandler(handler)
        this.handlers.push(qh)

        this.matches() && qh.on()
    }

    removeHandler(handler) {
        let handlers = this.handlers,
            len = handlers.length,
            i = 0,
            h
        for (; i < len; i++) {
            h = handlers[i]
            if (!h.equals(handler))
                continue
            
            h.destroy()
            handlers.splice(i, 1)
            break
        }
    }

    clear() {
        each(this.handlers, cbClear)
        this.mql.removeListener(this.listener)
        this.handlers.length = 0 //clear array
    }

    assess() {
        each(this.handlers, this.matches ? cbOn : cbOff)
    }
}

interface MediaQueryMap {
    [index: string]: MediaQuery|null
}

export interface Opts {
    match: Function
    unmatch: Function
}

/**
 * Registers a handler for the given media query
 */
export class MediaQueryDispatch {
    private queries: MediaQueryMap = {}
    private browserIsIncapable: boolean
    constructor() {
        if (!matchMedia)
            throw new Error('matchMedia not present, legacy browsers require a polyfill')

        this.browserIsIncapable = !matchMedia('only all').matches
    }

    register(q: string, options: Opts, shouldDegrade?: boolean) {
        let queries = this.queries,
            query = queries[q]
        
        if (!query)
            queries[q] = query = new MediaQuery(q, !!shouldDegrade && this.browserIsIncapable)
        
        query.addHandler(options)
        return this
    }
    
    unregister(q: string, handler: any) {
        const query = this.queries[q]
        if (!query) return this

        if (handler) {
            query.removeHandler(handler)
        } else {
            query.clear()
            this.queries[q] = null
            //delete this.queries[q]
        }

        return this
    }
}

export default new MediaQueryDispatch()