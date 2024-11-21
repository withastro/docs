#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

// Convert bytes to GB with 2 decimal places
const bytesToGB = (bytes) => (bytes / 1024 / 1024 / 1024).toFixed(2);

// Convert milliseconds to seconds with 2 decimal places
const msToSeconds = (ms) => (ms / 1000).toFixed(2);

// Group files by their base name (removing the run number)
const groupFiles = (files) => {
	return files.reduce((groups, file) => {
		const baseName = file.replace(/-\d+\.log$/, '.log');
		if (!groups[baseName]) {
			groups[baseName] = [];
		}
		groups[baseName].push(file);
		return groups;
	}, {});
};

// Process a single timing log
const processTiming = (data) => {
	const parsedData = JSON.parse(data);
	return {
		totalTime: parsedData['Total build'].elapsedTime,
		peakHeap: Math.max(...Object.values(parsedData).map((v) => v.heapUsedTotal)),
	};
};

// Calculate average metrics for a group of runs
const calculateAverages = (runs) => {
	const sum = runs.reduce(
		(acc, run) => ({
			totalTime: acc.totalTime + run.totalTime,
			peakHeap: acc.peakHeap + run.peakHeap,
		}),
		{ totalTime: 0, peakHeap: 0 }
	);

	return {
		totalTime: sum.totalTime / runs.length,
		peakHeap: sum.peakHeap / runs.length,
	};
};

// Generate markdown table
const generateMarkdownTable = (results) => {
	const rows = [
		'| Build Type | Total Time (s) | Peak Heap (GB) |',
		'|------------|---------------|----------------|',
	];

	Object.entries(results)
		.sort(([a], [b]) => a.localeCompare(b))
		.forEach(([buildType, metrics]) => {
			const formattedType = buildType.replace('time-', '').replace('.log', '');

			rows.push(
				`| ${formattedType} | ${msToSeconds(metrics.totalTime)} | ${bytesToGB(metrics.peakHeap)} |`
			);
		});

	return rows.join('\n');
};

// Main processing function
const processTimingLogs = async (files) => {
	try {
		// Group files by base name
		const groupedFiles = groupFiles(files);
		const results = {};

		// Process each group
		for (const [baseFile, group] of Object.entries(groupedFiles)) {
			const runs = await Promise.all(
				group.map(async (file) => {
					const content = await readFile(file, { encoding: 'utf8' });
					return processTiming(content);
				})
			);

			results[baseFile] = calculateAverages(runs);
		}

		// Generate and return markdown table
		return generateMarkdownTable(results);
	} catch (error) {
		console.error('Error processing timing logs:', error);
		process.exit(1);
	}
};

// Get files from command line arguments, excluding node and script path
const files = process.argv.slice(2);

if (files.length === 0) {
	console.error('Usage: node script.js <timing-log-files...>');
	process.exit(1);
}

// Execute and print results
const table = await processTimingLogs(files);
console.log(table);
