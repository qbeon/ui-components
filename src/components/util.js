export function componentName(name) {
	return 'uic-' + name
}

export function detectBrowser() {
	// get ie version helper
	function getIEVersion() {
		const match = window.navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/)
		return match ? parseInt(match[1]) : void 0
	}

	// user agent & vendor
	const ua = window.navigator.userAgent
	const vendor = window.navigator.vendor

	// chrome
	const chrome = (
		(ua.toLowerCase().indexOf('chrome') > -1) && (vendor.toLowerCase().indexOf('google') > -1)
	)

	// edge
	const edge = ua.indexOf('Edge') > -1

	// safari
	const safari = !!window.safari || ((ua.toLowerCase().indexOf('safari') > -1) && (vendor.toLowerCase().indexOf('apple') > -1))

	// internet explorer
	const ie8 = getIEVersion() == 8
	const ie9 = getIEVersion() == 9
	const ie10 = getIEVersion() == 10
	const ie11 = getIEVersion() == 11
	const ie = ie8 || ie9 || ie10 || ie11

	// is it mobile browser?
	// regex below thanks to http://detectmobilebrowsers.com/
	const uaOrVendor = ua || vendor || window.opera
	const mobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(uaOrVendor)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(uaOrVendor.substr(0,4)))

	// construct return object
	return {
		edge: edge,
		chrome: chrome,
		safari: safari,
		mobile: mobile,
		ie: ie,
		ie8: ie8,
		ie9: ie9,
		ie10: ie10,
		ie11: ie11,
	}
}

// https://remysharp.com/2010/07/21/throttling-function-calls
export function debounce(fn, delay) {
	let timer = null
	return function() {
		clearTimeout(timer)
		timer = setTimeout(function() {
			fn.apply(this, arguments)
		}, delay)
	}
}

// https://remysharp.com/2010/07/21/throttling-function-calls	
export function throttle(fn, threshhold, scope) {
	threshhold || (threshhold = 250)
	let last, deferTimer
	return function() {
		const context = scope || this
		const now = +new Date
		if (last && now < last + threshhold) {
			// hold on to it
			clearTimeout(deferTimer)
			deferTimer = setTimeout(function() {
				last = now
				fn.apply(context, arguments)
			}, threshhold)
		} else {
			last = now
			fn.apply(context, arguments)
		}
	}
}

export function compatStyle(element, property, value) {
	element.style['webkit' + property] = value
	element.style['moz' + property] = value
	element.style['ms' + property] = value
	element.style['o' + property] = value
	element.style[ property.slice(0,1).toLowerCase() + property.substring(1) ] = value
}


// https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
export function hasClass(el, className) {
	return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className)
}

export function addClass(el, className) {
	if (el.classList) el.classList.add(className)
	else if (!hasClass(el, className)) el.className += ' ' + className
}

export function removeClass(el, className) {
	if (el.classList) el.classList.remove(className)
	else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '')
}
