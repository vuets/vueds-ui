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

class QueryHandler2 {
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

/**
 * Delegate to handle a media query being matched and unmatched.
 *
 * @param {object} options
 * @param {function} options.match callback for when the media query is matched
 * @param {function} [options.unmatch] callback for when the media query is unmatched
 * @param {function} [options.setup] one-time callback triggered the first time a query is matched
 * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
 * @constructor
 */
function QueryHandler(options) {
    this.options = options;
    !options.deferSetup && this.setup();
}
QueryHandler.prototype = {

    /**
     * coordinates setup of the handler
     *
     * @function
     */
    setup: function () {
        if (this.options.setup)
            this.options.setup()
        
        this.initialized = true
    },

    /**
     * coordinates setup and triggering of the handler
     *
     * @function
     */
    on: function () {
        !this.initialized && this.setup()
        this.options.match && this.options.match()
    },

    /**
     * coordinates the unmatch event for the handler
     *
     * @function
     */
    off: function () {
        this.options.unmatch && this.options.unmatch()
    },

    /**
     * called when a handler is to be destroyed.
     * delegates to the destroy or unmatch callbacks, depending on availability.
     *
     * @function
     */
    destroy: function () {
        this.options.destroy ? this.options.destroy() : this.off()
    },

    /**
     * determines equality by reference.
     * if object is supplied compare options, if function, compare match callback
     *
     * @function
     * @param {object || function} [target] the target for comparison
     */
    equals: function (target) {
        return this.options === target || this.options.match === target
    }

};

function mqListener(this: MediaQuery, mql: MediaQueryList) {
    this.mql = mql
}

function cbRemoveHandler(this: MediaQuery, h, i) {
    if (h.equals(this.rm_handler)) {
        h.destroy()
        return !this.handlers.splice(i, 1) //remove from array and exit each early
    }
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
    handlers: QueryHandler2[] = []
    mql: MediaQueryList
    listener: any
    rm_handler: any
    cbRemoveHandler: any
    constructor(private query: string, private isUnconditional: boolean) {
        this.mql = matchMedia(query)
        this.listener = mqListener.bind(this)
        this.cbRemoveHandler = mqListener.bind(this)
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
        this.rm_handler = handler
        each(this.handlers, cbRemoveHandler)
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

export interface MediaMatchOpts {
    match: Function
}

/**
 * Registers a handler for the given media query
 */
export class MediaQueryDispatch2 {
    queries = {}
    browserIsIncapable: boolean
    constructor() {
        if (!matchMedia)
            throw new Error('matchMedia not present, legacy browsers require a polyfill')

        this.browserIsIncapable = !matchMedia('only all').matches
    }

    register(q: string, options: MediaMatchOpts, shouldDegrade: boolean) {
        var queries = this.queries,
            isUnconditional = shouldDegrade && this.browserIsIncapable,
            query = queries[q]

        if (!query)
            queries[q] = query = new MediaQuery(q, isUnconditional)
        
        query.addHandler(options)

        return this
    }
    
    unregister(q: string, handler: any) {
        var query: MediaQuery = this.queries[q]
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

export default new MediaQueryDispatch2()