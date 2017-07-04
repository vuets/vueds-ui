function escape_regex(str) {
    return !str ? '' : str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}
function scoreValue(value, token) {
    var score, pos;
    if (!value)
        return 0;
    pos = value.search(token.r);
    if (pos === -1)
        return 0;
    score = token.s.length / value.length;
    if (pos === 0)
        score += 0.5;
    return score;
}
function scoreZero() {
    return 0;
}
function scoreSingle(token, data, fields) {
    return scoreValue(data[fields[0]], token);
}
function scoreMulti(token, data, fields) {
    var sum = 0;
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
        var f = fields_1[_i];
        sum += scoreValue(data[f], token);
    }
    return sum / fields.length;
}
function getFnScoreFields(len) {
    switch (len) {
        case 0: return scoreZero;
        case 1: return scoreSingle;
        default: return scoreMulti;
    }
}
function scoreTokensSingle(tokens, data, fields, fn) {
    return fn(tokens[0], data, fields);
}
function scoreTokens(tokens, data, fields, fn) {
    var sum = 0;
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var t = tokens_1[_i];
        sum += fn(t, data, fields);
    }
    return sum / tokens.length;
}
function scoreTokensAnd(tokens, data, fields, fn) {
    var sum = 0, v;
    for (var _i = 0, tokens_2 = tokens; _i < tokens_2.length; _i++) {
        var t = tokens_2[_i];
        if (0 >= (v = fn(t, data, fields)))
            return 0;
        sum += v;
    }
    return sum / tokens.length;
}
function getFnScoreTokens(len, and) {
    switch (len) {
        case 0: return scoreZero;
        case 1: return scoreTokensSingle;
        default: return and ? scoreTokensAnd : scoreTokens;
    }
}
function sortFn(a, b) {
    if (a.score === b.score)
        return 0;
    else if (a.score < b.score)
        return -1;
    else
        return 1;
}
var DIACRITICS = {
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
};
function getDiacriticsRegex(pattern, letter) {
    var d = DIACRITICS[letter];
    return !d ? pattern : pattern.replace(new RegExp(letter, 'g'), d);
}
var regexSpace = / +/;
function tokenize(query, diacritics) {
    var tokens = [];
    if (!query || !query.length)
        return tokens;
    var words = query.split(regexSpace), i, n, regex, letter;
    for (i = 0, n = words.length; i < n; i++) {
        regex = escape_regex(words[i]);
        if (diacritics)
            regex = getDiacriticsRegex(regex, letter);
        tokens.push({
            s: words[i],
            r: new RegExp(regex, 'i')
        });
    }
    return tokens;
}
export default function search(q, opts, array) {
    var fields = opts.fields, query = q.trim().toLowerCase(), tokens = tokenize(query), items = [], fn_score = getFnScoreTokens(tokens.length, opts.and), fn_score_fields = getFnScoreFields(fields.length), len = array.length, i = 0;
    for (; i < len; i++) {
        var score = fn_score(tokens, array[i], fields, fn_score_fields);
        if (score > 0)
            items.push({ 'score': score, 'id': i });
    }
    items.sort(sortFn);
    i = 0;
    len = items.length;
    for (; i < len; i++)
        items[i] = array[items[i].id];
    return items;
}
//# sourceMappingURL=sifter.js.map