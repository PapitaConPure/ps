function loadFont(el) {
	el.onload = null;
	el.rel = "stylesheet";
	document.documentElement.style.setProperty(
		"--f-outfit",
		'"Outfit", sans-serif',
	);
}
