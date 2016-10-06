export function putCheckboxBitset(container1, container2, bitArray1, bitArray2, arrayValue, arrayDisplay) {
    var display, value, strIdx, entry;
    for (var i = 0, len = arrayValue.length; i < len; i++) {
        display = arrayDisplay[i];
        value = arrayValue[i];
        strIdx = '$' + value;
        // 1
        entry = {
            display: display,
            value: value,
            checked: false
        };
        bitArray1.push(entry);
        container1[strIdx] = entry;
        // 2
        entry = {
            display: display,
            value: value,
            checked: false
        };
        bitArray2.push(entry);
        container2[strIdx] = entry;
    }
}
//# sourceMappingURL=bit_util.js.map