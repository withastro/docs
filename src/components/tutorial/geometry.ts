/** Convert an angle in degrees to an angle in radians. */
const degToRad = (deg: number) => (deg / 180) * Math.PI;

/** Convert polar to cartesian co-ordinates. */
function polToCar(px: number, py: number, r: number, angleInDegrees: number) {
	const angleInRadians = degToRad(angleInDegrees);
	return {
		x: px + r * Math.cos(angleInRadians),
		y: py + r * Math.sin(angleInRadians),
	};
}

function getArcString(
	angle: number,
	{ cx, cy, r, isLargeArc }: { cx: number; cy: number; r: number; isLargeArc: boolean }
) {
	const { x, y } = polToCar(cx, cy, r, angle);
	return `A${r},${r} 0 ${isLargeArc ? '1' : '0'} 0 ${x},${y}`;
}

interface SectorOpts {
	/** X-coordinate of the circle’s centre */
	cx?: number;
	/** Y-coordinate of the circle’s centre */
	cy?: number;
	/** Radius of the circle. */
	r: number;
	/** Angle around the circle to start the sector at (in degrees). */
	startAngle: number;
	/** Angle around the circle to end the sector at (in degrees). */
	endAngle: number;
	/** If truthy, returns only the arc path, otherwise returns a full sector path. */
	arc?: boolean;
}

/**
 * Get a path string describing the sector (or arc) of a circle.
 * Intended to be used as the value of an SVG `<path>`’s `d` attribute.
 */
export function SectorPath({ cx = 0, cy = 0, r, startAngle, endAngle, arc = false }: SectorOpts) {
	// Wrap angles larger than 360°
	startAngle = startAngle % 360;
	endAngle = endAngle % 360;

	const start = polToCar(cx, cy, r, endAngle);
	const isLargeArc = endAngle - startAngle > 180;

	const arcString = getArcString(startAngle, { cx, cy, r, isLargeArc });
	let endString = '';
	let startString = '';

	if (arc) {
		startString = `M${start.x},${start.y}`;
	} else {
		startString = `M${cx},${cy} L${start.x},${start.y}`;
		endString = 'z';
	}

	const d = `${startString} ${arcString} ${endString}`;
	return d.trim();
}
