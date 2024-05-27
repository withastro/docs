import type { AnnotationProperties } from '@actions/core';
import { formatCount } from '../../output.mjs';
import type { CheckBase } from './check';
import type { HtmlPage } from './page';

export interface LinkIssue {
	type: IssueType;
	linkHref: string;
	autofixHref?: string;
	annotationText?: string;
	page: HtmlPage;
	check: CheckBase;
	sourceFileAnnotations: SourceFileAnnotation[];
}

export interface SourceFileAnnotation {
	message: string;
	location: AnnotationProperties;
	autofixed?: boolean;
}

export class IssueType {
	readonly title: string;
	readonly prefix: string;
	readonly sortOrder: number;

	constructor({ title, prefix, sortOrder }: { title: string; prefix: string; sortOrder: number }) {
		this.title = title;
		this.prefix = prefix;
		this.sortOrder = sortOrder;
	}

	/**
	 * Formats the issue `title` template based on `count`.
	 *
	 * See {@link formatCount} for full formatting logic.
	 */
	formatTitle(count?: number) {
		return formatCount(count, this.title);
	}
}
