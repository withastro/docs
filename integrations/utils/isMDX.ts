import type { VFile } from 'vfile';

export function isMDXFile(file: VFile) {
	return file.history[0].endsWith('.mdx');
}
