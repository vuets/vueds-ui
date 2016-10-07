export function fillWithCheckbox(arrayValue, arrayDisplay, fill1, fill2) {
    var display, value, strIdx;
    for (var i = 0, len = arrayValue.length; i < len; i++) {
        display = arrayDisplay[i];
        value = arrayValue[i];
        fill1.push({
            display: display,
            value: value,
            checked: false
        });
        if (!fill2)
            continue;
        // 2
        fill2.push({
            display: display,
            value: value,
            checked: false
        });
    }
}
//# sourceMappingURL=bit_util.js.map