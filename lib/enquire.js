// ported from enquire.js
import { noop } from 'vueds/lib/util';
function matchLazySetup() {
    if (!this.initialized) {
        this.initialized = true;
        this.setup();
    }
    this.opts.match();
}
var QueryHandler = (function () {
    function QueryHandler(opts) {
        this.opts = opts;
        this.initialized = !opts.deferSetup;
        this.setup = opts.setup || noop;
        this.match = this.initialized ? opts.match : matchLazySetup.bind(this);
        this.unmatch = opts.unmatch || noop;
        this.destroy = opts.destroy || this.unmatch;
    }
    return QueryHandler;
}());
function matchHandlers(handlers) {
    for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
        var handler = handlers_1[_i];
        handler.match();
    }
}
function unmatchHandlers(handlers) {
    for (var _i = 0, handlers_2 = handlers; _i < handlers_2.length; _i++) {
        var handler = handlers_2[_i];
        handler.unmatch();
    }
}
function cbAssess(mql) {
    this.mql = mql;
    this.assess();
}
/**
 * Represents a single media query, manages it's state and registered handlers for this query
 */
var MediaQuery = (function () {
    function MediaQuery(query, isUnconditional) {
        this.query = query;
        this.isUnconditional = isUnconditional;
        this.handlers = [];
        this.mql = matchMedia(query);
        this.listener = cbAssess.bind(this);
        this.mql.addListener(this.listener);
    }
    MediaQuery.prototype.matches = function () {
        return this.mql.matches || this.isUnconditional;
    };
    MediaQuery.prototype.add = function (opts) {
        var qh = new QueryHandler(opts);
        this.handlers.push(qh);
        this.matches() && qh.match();
    };
    MediaQuery.prototype.remove = function (opts) {
        var handlers = this.handlers, len = handlers.length, i = 0;
        for (; i < len; i++) {
            var h = handlers[i];
            if (opts !== h.opts)
                continue;
            h.destroy();
            handlers.splice(i, 1);
            break;
        }
    };
    MediaQuery.prototype.clear = function () {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler.destroy();
        }
        this.mql.removeListener(this.listener);
        this.handlers.length = 0; //clear array
    };
    MediaQuery.prototype.assess = function () {
        if (this.matches())
            matchHandlers(this.handlers);
        else
            unmatchHandlers(this.handlers);
    };
    return MediaQuery;
}());
/**
 * Registers a handler for the given media query.
 */
var MediaQueryRegistry = (function () {
    function MediaQueryRegistry() {
        this.queries = {};
        if (!matchMedia)
            throw new Error('matchMedia not present, legacy browsers require a polyfill');
        this.browserIsIncapable = !matchMedia('only all').matches;
    }
    MediaQueryRegistry.prototype.register = function (q, entry, shouldDegrade) {
        var queries = this.queries, query = queries[q];
        if (!query)
            queries[q] = query = new MediaQuery(q, !!shouldDegrade && this.browserIsIncapable);
        query.add(entry);
        return this;
    };
    MediaQueryRegistry.prototype.unregister = function (q, entry) {
        var query = this.queries[q];
        if (!query)
            return this;
        if (entry) {
            query.remove(entry);
        }
        else {
            query.clear();
            this.queries[q] = null;
            //delete this.queries[q]
        }
        return this;
    };
    return MediaQueryRegistry;
}());
export { MediaQueryRegistry };
export default new MediaQueryRegistry();
//# sourceMappingURL=enquire.js.map