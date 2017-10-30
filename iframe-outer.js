////////////////////////////////////////////////////////////////////////////
// Корректировка позиции спиннера внутри iframe
window.onresize = window.onscroll = correctSpinnerPosition();

function correctSpinnerPosition(
	box = document.getElementById('topiframe'),
	spinner = document.getElementById('spinner')
	) {
	return () => {
		// 1. фрейм на экране ?
		// 1.1. нет - ничего не делаем
		// 2 Полностью на экране ?
		// 2.1 Да - центруем по центру фрейма
		// 2.2 Нет - Какая часть срезана ?
		// 2.2.1 Срезана верхняя - центруем от  нижней части фрейма до верха вьюпорта
		// 2.2.3 Срезана  нижняя - центруем от верхней части фрейма до  низа вьюпорта
		// 2.2.2 Срезана и верхняя и нижняя - центруем по центру вьюпорта

		const viewportRect = getViewportRect();
		const boxRect = getBoxRect(box);

		// 1. На экране ?
		const isIframeOutside = boxRect.top > viewportRect.height || boxRect.bottom < 0;
		if (isIframeOutside) {
			// 1.1. нет - ничего не делаем
			return;
		}

		const isIframeBottomCuttedByViewport = boxRect.bottom > viewportRect.height;
		const isIframeTopCuttedByViewport = boxRect.top < 0;
		const isIframeBottomAndTopCuttedByViewport =
			isIframeBottomCuttedByViewport === true && isIframeTopCuttedByViewport === true;
		const isIframeFullyInsideViewport =
			isIframeBottomCuttedByViewport === false && isIframeTopCuttedByViewport === false;

		var spinnerPosition = 0;

		// 2 Полностью на экране?
		if (isIframeFullyInsideViewport) {
			// 2.1 Да - центруем по центру фрейма
			spinnerPosition = boxRect.top + boxRect.height / 2;
		} else {
			// 2.2 Нет - Какая часть срезана ?
			const mode = isIframeBottomAndTopCuttedByViewport ? "centred" : isIframeTopCuttedByViewport ? "top" : "bottom";
			switch (mode) {
				case "top":
					// 2.2.1 Срезана верхняя - центруем от  нижней части фрейма до верха вьюпорта
					spinnerPosition = boxRect.bottom / 2;
					break;
				case "bottom":
					// 2.2.3 Срезана  нижняя - центруем от верхней части фрейма до  низа вьюпорта
					spinnerPosition = (viewportRect.height - boxRect.top) / 2 + boxRect.top;
					break;
				case "centred":
					// 2.2.2 Срезана и верхняя и нижняя - центруем по центру вьюпорта
					spinnerPosition = viewportRect.height / 2;
					break;
			}
		}


		// позиция спиннера для родительского окна
		if (spinner != null) {
			spinner.style.top = `${window.scrollY + spinnerPosition}px`;
		}

		// шлём для фрейма
		const innerSpinnerPosition = spinnerPosition - boxRect.top;
		window.postMessage({ innerSpinnerPosition }, "*");
	};
}

function getViewportRect(viewport = document.documentElement) {
	return {
		width: Math.max(viewport.clientWidth, window.innerWidth || 0),
		height: Math.max(viewport.clientHeight, window.innerHeight || 0)
	};
}

function getBoxRect(box) {
	const boxRect = box.getBoundingClientRect();
	boxRect.bottom = window.scrollY + boxRect.top + boxRect.height;
	return boxRect;
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
