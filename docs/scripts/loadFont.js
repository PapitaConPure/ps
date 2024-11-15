function loadFont(el) {
	el.onload = null;
	el.onerror = null;
	el.rel = "stylesheet";
	document.documentElement.style.setProperty(
		"--f-outfit",
		'"Outfit", ui-sans-serif, system-ui, sans-serif',
	);
}
