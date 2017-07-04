interface Token {
    s: string
    r: RegExp
}

function escape_regex(str: string) {
    return !str ? '' : str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
}

function scoreValue(value: string, token: Token) {
    var score, pos;

    if (!value) return 0
        
    pos = value.search(token.r)
    
    if (pos === -1) return 0
    
    score = token.s.length / value.length
    if (pos === 0)
        score += 0.5
    
    return score
}

function scoreZero(): number {
    return 0
}

function scoreSingle(token: Token, data: any, fields: any[]): number {
    return scoreValue(data[fields[0]], token)
}

function scoreMulti(token: Token, data: any, fields: any[]): number {
    var sum = 0
    for (let f of fields)
        sum += scoreValue(data[f], token)
    
    return sum / fields.length
}

function getFnScoreFields(len: number): Function {
    switch (len) {
        case 0: return scoreZero
        case 1: return scoreSingle
        default: return scoreMulti
    }
}

function scoreTokensSingle(tokens: Token[], data: any, fields: any[], fn: any): number {
    return fn(tokens[0], data, fields)
}

function scoreTokens(tokens: Token[], data: any, fields: any[], fn: any): number {
    var sum = 0
    for (let t of tokens)
        sum += fn(t, data, fields)
    
    return sum / tokens.length
}

function scoreTokensAnd(tokens: Token[], data: any, fields: any[], fn: any): number {
    var sum = 0, v
    for (let t of tokens) {
        if (0 >= (v = fn(t, data, fields)))
            return 0
        sum += v
    }
    
    return sum / tokens.length
}

function getFnScoreTokens(len: number, and?: boolean) {
    switch (len) {
        case 0: return scoreZero
        case 1: return scoreTokensSingle
        default: return and ? scoreTokensAnd : scoreTokens
    }
}

interface SearchItem {
    score: number
    id: number
}

function sortFn(a: SearchItem, b: SearchItem): number {
    if (a.score === b.score) return 0
    else if (a.score < b.score) return -1
    else return 1
}

const DIACRITICS = {
    'a': '[aÀÁÂÃÄÅàáâãäå]',
    'c': '[cÇçćĆčČ]',
    'd': '[dđĐďĎ]',
    'e': '[eÈÉÊËèéêëěĚ]',
    'i': '[iÌÍÎÏìíîï]',
    'n': '[nÑñňŇ]',
    'o': '[oÒÓÔÕÕÖØòóôõöø]',
    'r': '[rřŘ]',
    's': '[sŠš]',
    't': '[tťŤ]',
    'u': '[uÙÚÛÜùúûüůŮ]',
    'y': '[yŸÿýÝ]',
    'z': '[zŽž]'
}

function getDiacriticsRegex(pattern, letter) {
    var d = DIACRITICS[letter]
    return !d ? pattern : pattern.replace(new RegExp(letter, 'g'), d)
}

const regexSpace = / +/

function tokenize(query: string, diacritics?: boolean): Token[] {
    let tokens: Token[] = []
    if (!query || !query.length)
        return tokens
    
    let words = query.split(regexSpace),
        i, n, regex, letter
    
    for (i = 0, n = words.length; i < n; i++) {
        regex = escape_regex(words[i])
        if (diacritics)
            regex = getDiacriticsRegex(regex, letter)
        
        tokens.push({
            s: words[i],
            r: new RegExp(regex, 'i')
        })
    }

    return tokens
}

export interface Opts {
    fields: string[]
    diacritics?: boolean
    and?: boolean
}

export default function search(q: string, opts: Opts, array: any[]): any[] {
    let fields = opts.fields,
        query = q.trim().toLowerCase(),
        tokens = tokenize(query),
        items: SearchItem[] = [],
        fn_score = getFnScoreTokens(tokens.length, opts.and),
        fn_score_fields = getFnScoreFields(fields.length),
        len = array.length,
        i = 0
    
    for (; i < len; i++) {
        let score = fn_score(tokens, array[i], fields, fn_score_fields)
        if (score > 0)
            items.push({ 'score': score, 'id': i })
    }

    items.sort(sortFn)

    i = 0
    len = items.length
    for (; i < len; i++)
        items[i] = array[items[i].id]
    
    return items
}

