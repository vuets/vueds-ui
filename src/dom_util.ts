
export const UA = window.navigator.userAgent.toLowerCase(), // browser sniffing from vuejs
    //isIE = UA && UA.indexOf('trident') > 0,
    isIE9 = UA && UA.indexOf('msie 9.0') > 0

const hasClassList = 'classList' in document.documentElement,
    createEvent = document['createEvent'],
    createEventObject = document['createEventObject']

export const enum Keys {
    BACKSPACE = 8,
    ENTER = 13,
    ESCAPE = 27,
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40
}

var popup_

export function getPopup(): any {
    return popup_ || (popup_ = document.getElementById('popup'))
}

/**
 * Returns true if the popup is visible.
 */
export function visiblePopup(popup): boolean {
    return hasClass(popup, 'active')
}

export function hidePopup(popup): boolean {
    return removeClass(popup, 'active')
}

export function showPopup(popup, contentEl, positionEl) {
    let style = popup.style
    style.visibility = 'hidden'
    popup.replaceChild(contentEl, popup.firstChild)
    addClass(popup, 'active')
    positionTo(positionEl, popup)
    style.visibility = 'visible'
}

export interface LazyEl {
    id: string
    el: any
}

export function focus(id: string) {
    let el = document.getElementById(id)
    if (el)
        el.focus()
}

function bFocus(this: LazyEl) {
    let el = this.el
    if (el || (el === undefined && (this.el = el = document.getElementById(this.id))))
        el.focus()
}

export function bindFocus(id: string): any {
    return bFocus.bind({ id, el: undefined })
}

export function setClass(el, cls: string) {
    if (isIE9 && !/svg$/.test(el.namespaceURI)) {
        el.className = cls
    } else {
        el.setAttribute('class', cls)
    }
}

/**
 * For IE9 compat: when both class and :class are present
 * getAttribute('class') returns wrong value...
 *
 * @param {Element} el
 * @return {String}
 */
function getClass (el) {
    let className = el.className
    return typeof className !== 'object' ? className : (className.baseVal || '')
}

//export const { addClass } = Vue.util
export function addClass (el, cls: string) {
    if (el.classList) {
        el.classList.add(cls)
    } else {
        var cur = ' ' + getClass(el) + ' '
        if (cur.indexOf(' ' + cls + ' ') < 0) {
            setClass(el, (cur + cls).trim())
        }
    }
}

export function isInput(el: Element): boolean {
    var tag = el.tagName
    return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA'
}
export function findupClass(el: any, cls: string, limit: number): Element|null {
    if (hasClassList) {
        do {
            if (el.classList.contains(cls)) return el
            el = el.parentElement
        } while (--limit > 0)
    } else {
        do {
            if (el.className.indexOf(cls) !== -1) return el
            el = el.parentElement
        } while (--limit > 0)
    }
    return null
}
export function hasClass(el: Element, cls: string): boolean {
    if (hasClassList)
        return el.classList.contains(cls)
    
    let str = ' ' + el.className + ' '
    return str.indexOf(' ' + cls + ' ') !== -1
}
export function removeClass (el: Element, cls: string): boolean {
    let removed: boolean
    if (hasClassList) {
        let classList = el.classList, 
            len = classList.length
        
        classList.remove(cls)
        removed = len > classList.length
        if (removed && len === 1)
            el.removeAttribute('class')
    } else {
        let cur = ' ' + el.className + ' ',
            tar = ' ' + cls + ' '
        
        removed = false
        while (cur.indexOf(tar) >= 0) {
            cur = cur.replace(tar, ' ')
            removed = true
        }
        if (removed)
            setClass(el, cur.trim())
    }
    return removed
}
export function toggleClass(el: Element, cls: string) {
    if (hasClassList) {
        let classList = el.classList, 
            len = classList.length
        
        classList.remove(cls)
        if (len === classList.length)
            classList.add(cls)
    } else {
        let className = el.className,
            cur = ' ' + className + ' ',
            tar = ' ' + cls + ' ',
            removed = false
        
        while (cur.indexOf(tar) >= 0) {
            cur = cur.replace(tar, ' ')
            removed = true
        }
        setClass(el, removed ? cur.trim() : className + ' ' + cls)
    }
}

/*export function toggleActive(el) {
    if (removeClass(el, 'active')) {
        var vm = el.__vue__ || getFirstVm(el)
        if (vm && vm.handle(2))
            vm.$broadcast('vui', 2)
        if (el.className === 'modal' || el.className === 'dropdown')
            document.modalId = null
    } else {
        if (el.className === 'modal' || el.className === 'dropdown')
            document.modalId = el.id
        addClass(el, 'active')
        var vm = el.__vue__ || getFirstVm(el)
        if (vm && vm.handle(1))
            vm.$broadcast('vui', 1)
    }
}*/
export function getLastChildElement(el): any {
    return el.childElementCount ? el.children[el.childElementCount - 1] : null
}
export function getFirstChildElement(el): any {
    return el.childElementCount ? el.children[0] : null
    /*var child = el.firstChild;
    while (child && child.nodeType != 1)
        child = child.nextSibling;
    return child;*/
}
export function resolveRelativeElement(el, str: string): any {
    var startIdx = str.charAt(0) === '-' ? 1 : 0,
        dotIdx = str.indexOf('.'/*, startIdx*/),
        i

    if (dotIdx === startIdx) {
        // siblings
        i = parseInt(str.substring(dotIdx + 1), 10)
        if (startIdx === 0) {
            while (i--) el = el.nextElementSibling
        } else {
            while (i--) el = el.previousElementSibling
        }

        return el
    }

    i = parseInt(dotIdx === -1 ? str : str.substring(startIdx, dotIdx), 10)

    while (i--) el = el.parentElement

    if (dotIdx === -1) return el

    i = parseInt(str.substring(dotIdx + 1), 10)

    if (startIdx) {
        // negative, so start from bottom
        el = el.lastElementChild
        while (i--) el = el.previousElementSibling
    } else {
        el = el.firstElementChild
        while (i--) el = el.nextElementSibling
    }

    return el
}

// TODO optimize: parseInt is not necessary if the length is 1 (simply deduct 48)
export function chainResolveRelativeElement(el: Element, array: string[], i: number): any {
    for (var l = array.length; i < l; i++)
        el = resolveRelativeElement(el, array[i])
    
    return el
}
export function resolveElement(el: Element, value: any, vm?: any): any {
    if (!isNaN(value) || (vm && value.charAt(0) === '$' && !isNaN(value = vm.$get(value))))
        return resolveRelativeElement(el, value)
    else if (value.indexOf('__') !== -1)
        return chainResolveRelativeElement(el, value.split('__'), 0)
    else
        return document.getElementById(value)
}
export function resolveElementArray(el: any, value, selectFromParent: boolean, vm?: any): any {
    if (Array.isArray(value)) {
        return !value[0] ?
                [chainResolveRelativeElement(el, value, 1)] :
                value.map(function(item){ return resolveElement(el, item, vm) })
    }
    else if (!isNaN(value)) return [resolveRelativeElement(el, value)]
    else if (value.indexOf('__') !== -1) return [chainResolveRelativeElement(el, value.split('__'), 0)]
    else if (selectFromParent) return el.parentElement.querySelectorAll(value)
    else return el.querySelectorAll(value)
}

export function fireEvent(el, type: string) {
    if (createEvent) {
        var ev = document.createEvent("HTMLEvents");
        ev.initEvent(type, true, true); // type,bubbling,cancelable
        el.dispatchEvent(ev);
        return
    }
    
    if (createEventObject) {
        // IE
        el.fireEvent('on' + type, document['createEventObject']())
        return
    }
    
    throw new Error('Could not create an event.');
}

export function getAbsoluteLeft(el): number {
    var left = 0, curr = el;
    // This intentionally excludes body which has a null offsetParent.    
    while (curr.offsetParent) {
        left -= curr.scrollLeft;
        curr = curr.parentNode;
    }
    while (el) {
        left += el.offsetLeft;
        el = el.offsetParent;
    }
    return left;
}
export function getAbsoluteTop(el): number {
    var top = 0, curr = el;
    // This intentionally excludes body which has a null offsetParent.    
    while (curr.offsetParent) {
        top -= curr.scrollTop;
        curr = curr.parentNode;
    }
    while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
    }
    return top;
}

export function positionTo(relativeTarget, popup) {
    // Calculate left position for the popup. The computation for
    // the left position is bidi-sensitive.
    var offsetWidth = popup.offsetWidth || 0, 
        offsetHeight = popup.offsetHeight || 0,
        textBoxOffsetWidth = relativeTarget.offsetWidth || 0,
        // Compute the difference between the popup's width and the
        // textbox's width
        offsetWidthDiff = offsetWidth - textBoxOffsetWidth,
        left = getAbsoluteLeft(relativeTarget)

    /*if (LocaleInfo.getCurrentLocale().isRTL()) { // RTL case

        var textBoxAbsoluteLeft = relativeTarget.getAbsoluteLeft();

        // Right-align the popup. Note that this computation is
        // valid in the case where offsetWidthDiff is negative.
        left = textBoxAbsoluteLeft - offsetWidthDiff;

        // If the suggestion popup is not as wide as the text box, always
        // align to the right edge of the text box. Otherwise, figure out whether
        // to right-align or left-align the popup.
        if (offsetWidthDiff > 0) {

        // Make sure scrolling is taken into account, since
        // box.getAbsoluteLeft() takes scrolling into account.
        var windowRight = Window.getClientWidth() + Window.getScrollLeft();
        var windowLeft = Window.getScrollLeft();

        // Compute the left value for the right edge of the textbox
        var textBoxLeftValForRightEdge = textBoxAbsoluteLeft
            + textBoxOffsetWidth;

        // Distance from the right edge of the text box to the right edge
        // of the window
        var distanceToWindowRight = windowRight - textBoxLeftValForRightEdge;

        // Distance from the right edge of the text box to the left edge of the
        // window
        var distanceFromWindowLeft = textBoxLeftValForRightEdge - windowLeft;

        // If there is not enough space for the overflow of the popup's
        // width to the right of the text box and there IS enough space for the
        // overflow to the right of the text box, then left-align the popup.
        // However, if there is not enough space on either side, stick with
        // right-alignment.
        if (distanceFromWindowLeft < offsetWidth
            && distanceToWindowRight >= offsetWidthDiff) {
            // Align with the left edge of the text box.
            left = textBoxAbsoluteLeft;
        }
        }
    } else { // LTR case*/

        // Left-align the popup.
        // TODO this was moved to variable initialization
        //left = relativeTarget.getAbsoluteLeft();

        // If the suggestion popup is not as wide as the text box, always align to
        // the left edge of the text box. Otherwise, figure out whether to
        // left-align or right-align the popup.
        if (offsetWidthDiff > 0) {
        // Make sure scrolling is taken into account, since
        // box.getAbsoluteLeft() takes scrolling into account.
        var windowLeft = document['scrollLeft'] || 0,
            windowRight = windowLeft + (document['clientWidth'] || 0),
            // Distance from the left edge of the text box to the right edge
            // of the window
            distanceToWindowRight = windowRight - left,
            // Distance from the left edge of the text box to the left edge of the
            // window
            distanceFromWindowLeft = left - windowLeft

        // If there is not enough space for the overflow of the popup's
        // width to the right of hte text box, and there IS enough space for the
        // overflow to the left of the text box, then right-align the popup.
        // However, if there is not enough space on either side, then stick with
        // left-alignment.
            if (distanceToWindowRight < offsetWidth && distanceFromWindowLeft >= offsetWidthDiff) {
                // Align with the right edge of the text box.
                left -= offsetWidthDiff
            }
        }
    //}

    // Calculate top position for the popup

    var top = getAbsoluteTop(relativeTarget),

        // Make sure scrolling is taken into account, since
        // box.getAbsoluteTop() takes scrolling into account.
        windowTop = document.documentElement.scrollTop || 0,
        windowBottom = windowTop + document.documentElement.clientHeight,
        // Distance from the top edge of the window to the top edge of the
        // text box
        distanceFromWindowTop = top - windowTop,
        // Distance from the bottom edge of the window to the bottom edge of
        // the text box
        rtOffsetHeight = relativeTarget.offsetHeight || 0,
        distanceToWindowBottom = windowBottom - (top + rtOffsetHeight)

    // If there is not enough space for the popup's height below the text
    // box and there IS enough space for the popup's height above the text
    // box, then then position the popup above the text box. However, if there
    // is not enough space on either side, then stick with displaying the
    // popup below the text box.
    if (distanceToWindowBottom < offsetHeight && distanceFromWindowTop >= offsetHeight) {
        top -= offsetHeight
    } else {
        // Position above the text box
        top += rtOffsetHeight
    }
    
    popup.style.left = left + 'px'
    popup.style.top = top + 'px'
}

export function popTo(relativeTarget, popup) {
    popup.style.visibility = 'hidden'
    
    positionTo(relativeTarget, popup)
    
    popup.style.visibility = 'visible'
}
export function debounce(func, wait: number, immediate?: boolean): any {
    var timeout
    return function(this: any): any {
        var context = this, args = arguments
        var later = function() {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

/*var modalId
export const popup = document.getElementById('popup')
export function handle(type) {
    if (modalId) {
        document.modalId = modalId
        modalId = null
    }
    return false
}
export const handlerObj = { handle: handle }

export function deactivate() {
    var el = document.getElementById(document.modalId)
    document.modalId = null
    
    if(el) {
        removeClass(el, 'active')
        var prev = el.previousElementSibling
        if (prev && el.className === 'modal' && prev.className === 'modal-close') {
            fireEvent(prev, 'click')
        } else {
            var vm = el.__vue__ || getFirstVm(el)
            if(vm && vm.handle(2)) vm.$broadcast('vui', 2)
        }
    }
}
export function hidePopup(conditional): boolean {
    if (conditional && document.modalId !== 'popup') return false
    
    popup.style.visibility = 'hidden'
    removeClass(popup, 'active')
    
    document.modalId = modalId
    modalId = null
    
    return true
}
export function showPopup(el, elTo) {
    popup.replaceChild(el, popup.firstChild)
    addClass(popup, 'active')
    util.popTo(elTo || el, popup)
    
    if (document.modalId !== 'popup') {
        modalId = document.modalId
        document.modalId = 'popup'
    }
}
export function togglePopup(el, elTo): boolean {
    if (document.modalId === 'popup') return !hidePopup()
    
    showPopup(el, elTo)
    return true
}
export function isPopupShown(): boolean {
    return document.modalId === 'popup'
}

document.addEventListener('keyup', function(e) {
    if (e.keyCode === 27 && document.modalId) util.deactivate()
})

document.addEventListener('click', function(e) {
    if (!document.modalId) return
    
    var el = e.target
    if (el.className === 'modal active' || 
        (document.modalId === 'popup' && !el.$with_popup && el.tagName !== 'SELECT')) {
        util.deactivate()
    }
})*/

