window.parent.addEventListener("message", function({ data }) {
	const spinnerFrame = document.getElementById('spinnerFrame');
	const {innerSpinnerPosition} = data;
	spinnerFrame.style.top = `${innerSpinnerPosition}px`;
});
