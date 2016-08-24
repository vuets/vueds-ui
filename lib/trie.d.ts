export declare const enum Sort {
    ASC = 1,
    DESC = 2,
    NONE = 4,
}
/**
 * Trie is a kind of digital search tree. (See [Knuth1972] for more details
 * on digital search trees.)
 * [Fredkin1960] introduced the trie terminology, which is abbreviated from "Retrieval".
 * [Knuth1972] Knuth, D. E. The Art of Computer Programming Vol. 3, Sorting and Searching. Addison-Wesley. 1972.
 * [Fredkin1960] Fredkin, E. Trie Memory. Communication of the ACM. Vol. 3:9 (Sep 1960). pp. 490-499.
 * <a href="http://linux.thai.net/~thep/datrie/datrie.html">source</a>
 * @see <a href="http://en.wikipedia.org/wiki/Trie">Wikipedia article</a>
 *
 * The trie implementation of Dennis Byrne served as a starting point and inspiration:
 * @link http://notdennisbyrne.blogspot.com/2008/12/javascript-trie-implementation.html
 *
 * @param {String} stem    One character long representation of the trie node instance
 * @default ''
 * @param {Array}  meta    Metadata associated with a word is stored here
 * @default {}
 * @param {Number} sorting Sort method. May be {@link SORT_ASC} or {@link SORT_DESC}.
 * @default SORT_DESC
 * @property {Number} SORT_ASC sort the trie in ascending lexical order
 * @property {Number} SORT_DESC sort the trie in descending lexical order
 * @property {Number} SORT_NONE  sort the trie in no particular order
 * @author Mike de Boer <info AT mikedeboer DOT nl>
 * @license MIT
 * @constructor
 */
export declare class Trie {
    stem: string;
    nstem: number;
    sorting: Sort;
    wordCount: number;
    prefixCount: number;
    children: any[];
    meta: any[];
    /** @ignore */
    constructor(stem?: string, sorting?: Sort);
    static STATIC_PROPS: string[];
    /**
     * Add a word to the existing dictionary. If a trie node doesn't exist
     * yet, it is created with that character as its stem.
     * Since an add is already an expensive action, compared to adding nodes to
     * native Javascript containers like Array or Object, inserting a trie
     * node in lexical order is relatively cheap.
     * Please refer to the test suite to compare performance in your browser(s).
     *
     * @param {String} word Remainder of the word that is added to the root trie
     * @param {Object} meta Metadata associated with a word
     * @type  {void}
     */
    add(word: any, meta: any): void;
    /**
     * Update a word in the dictionary. This update implementation is
     * implemented like a file rename action as on a filesystem: add a node
     * with the new name and remove the outdated, 'old' version.
     *
     * @param {String} sOld the old word to be replaced by the word provided
     *                      by 'sNew'
     * @param {String} sNew the new word to be added to the dictionary
     * @param {Object} meta Metadata associated with a word
     * @type  {void}
     */
    update(sOld: any, sNew: any, meta: any): void;
    /**
     * Remove a word from the dictionary. This function uses the
     * walker, which is a generic implementation of a tree walker.
     *
     * @param {String} word the word to remove
     * @type  {void}
     */
    remove(word: any): void;
    /**
     * Find a trie node that is paired with a word or prefix 's'. Like the
     * {@link remove} function, this function also uses the walker.
     *
     * @param {String}   prefix the word or prefix to search for in the dictionary
     * @type  {Trie}
     */
    find(prefix: any): any;
    /**
     * @alias {find}
     *
     * @param {String} prefix the word or prefix to search for in the dictionary
     * @type  {Trie}
     */
    findPrefix(prefix: any): any;
    /**
     * Retrieve a direct child node of this dictionary with 'prefix'.
     *
     * @param {String} prefix s the word or prefix to search for in the
     *                          children of this dictionary
     * @type  {Trie}
     */
    getChild(prefix: any): any;
    /**
     * A version of {@link getChild} with a Boolean return type.
     *
     * @param {String} prefix s the word or prefix to search for in the
     *                          children of this dictionary
     * @type  {Boolean}
     */
    hasChild(prefix: any): boolean;
    /**
     * Resort this dictionary in lexical order, either in an ascending or
     * descending direction.
     * Since it uses the native {@link Array#sort} method, sorting speed can
     * be considered linear O(n) to the size of the trie, i.e. the word count.
     * Please refer to the test suite to compare performance in your browser(s).
     *
     * @param {Number} direction sorting direction. Possible values:
     *                 {@link Trie#SORT_ASC}
     *                 {@link Trie#SORT_DESC}
     * @type  {void}
     */
    sort(direction: any): void;
    /**
     * Retrieve the Array of words that originate from this trie.
     * The main use-case for this function is for implementations of the
     * type-ahead user experience pattern, but can be used to other ends as
     * well, of course.
     * The performance of this function still needs to be profiled against
     * alternatives, like pre-caching the words Array per Trie when it's
     * instantiated.
     *
     * @type  {Array}
     */
    getWords(): never[];
    /**
     * Retrieve the Array of words that originate from this trie.
     * The main use-case for this function is for implementations of the
     * type-ahead user experience pattern, but can be used to other ends as
     * well, of course.
     * The performance of this function still needs to be profiled against
     * alternatives, like pre-caching the words Array per Trie when it's
     * instantiated.
     *
     * @type  {Array}
     */
    getMetas(): never[];
    /**
     * Retrieve the prefix count of the applied argument
     *
     * @param {String} word the prefix or word-completing stem
     * @type  {Number}
     */
    getPrefixCount(word: any): any;
    /**
     * Retrieve the word count of the applied argument
     *
     * @param {String} word the prefix or word-completing stem
     * @type  {Number}
     */
    getWordCount(word: any): any;
    /**
     * Overrides Object.prototype.toString to deliver a more context sensitive
     * String representation of a Trie.
     *
     * @type {String}
     */
    toString(): string;
    /**
     * Load this Trie instance with properties from `json`; a serialized old(er)
     * version.
     *
     * @param {Object} json A serialized version of a Trie
     * @type  {void}
     */
    fromJSON(json: any): void;
    /**
     * Serialize this Trie instance to a JSON blob that may be stringified
     * and used at convenience.
     *
     * @type {Object}
     */
    toJSON(): {
        children: any[];
    };
}
