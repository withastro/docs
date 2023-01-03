import chroma from 'chroma-js';

export function ensureTextContrast(
	textColor: chroma.Color,
	backgroundColor: chroma.Color,
	minContrast = 6
): chroma.Color {
	const oldContrast = chroma.contrast(textColor, backgroundColor);
	if (oldContrast >= minContrast) return textColor;

	const textL = textColor.luminance();
	const bgL = backgroundColor.luminance();
	const lightenTargetL = (bgL + 0.05) * minContrast - 0.05;
	const darkenTargetL = (bgL + 0.05) / minContrast - 0.05;
	const lightenedColor = textColor.luminance(lightenTargetL);
	const darkenedColor = textColor.luminance(darkenTargetL);
	const lightenedContrast = chroma.contrast(lightenedColor, backgroundColor);
	const darkenedContrast = chroma.contrast(darkenedColor, backgroundColor);

	// If we couldn't improve the contrast, return the old text color
	if (lightenedContrast <= oldContrast && darkenedContrast <= oldContrast) return textColor;

	// First try to achieve the desired minimum contrast without inverting
	if (textL >= bgL && lightenedContrast >= minContrast) return lightenedColor;
	if (textL < bgL && darkenedContrast >= minContrast) return darkenedColor;

	// If that didn't work, return the color that achieves the best contrast
	return lightenedContrast > darkenedContrast ? lightenedColor : darkenedColor;
}
