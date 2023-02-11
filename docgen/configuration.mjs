import { slug as githubSlug } from 'github-slugger';
import fs from 'fs';
import jsdoc from 'jsdoc-api';

export async function scrapeFileForInterfaces(fileContents) {
    const astroErrorData = await getRawSourceFile(fileContents);

    // TODO: Implement compiler errors

    let result = [];
    for (const comment of astroErrorData.jsdoc) {
        const proccessedCommentDoc = processComment(comment);
        if (!proccessedCommentDoc) {
            continue;
        }
        result.push(proccessedCommentDoc);
    }
    return result;
}


function processComment(comment) {
    const categoryFlag = comment.tags.find((f) => f.title === 'category')?.text;
    if (comment.kind === 'heading') {
        throw new Error('DEPRECATED');
    }
    if (!categoryFlag) {
        throw new Error('Category required! ' + comment.longname);
    }
    if (!comment.longname) {
        throw new Error(`Missing @docs JSDoc tag: @name`);
    }
    // Pass to more specific processor
    if (categoryFlag === 'config') {
        return processConfigComment(comment);
    }
    if (categoryFlag === 'runtime') {
        return;
    //     return processRuntimeComment(comment);
    }
    throw new Error('Category not supported! ' + comment.longname);
}

function processConfigComment(comment) {
    const cliFlag = comment.tags.find((f) => f.title === 'cli');
    const typerawFlag = comment.tags.find((f) => f.title === 'typeraw');
    const typesFormatted = typerawFlag
        ? typerawFlag.text.replace(/\{(.*)\}/, '$1')
        : comment.type.names.join(' | ');

    if (!comment.type && !typerawFlag) {
        throw new Error(`Missing @docs JSDoc tag: @type or @typeraw (${comment.longname})`);
    }

    return {
        slug: githubSlug(comment.longname),
        name: comment.longname,
        description: comment.description && comment.description.trim(),
        category: 'config',
        version: comment.version,
        deprecated: comment.deprecated,
        seeAlsoLinks: [...(comment.see || []).join('\n').matchAll(/\[(.*?)\]\((.*?)\)/g)].map(m => ([m[1], m[2]])),
        meta: {
            flag: cliFlag && cliFlag.text,
            type: typesFormatted,
            defaultValue: comment.defaultvalue,
        },
    }
}

// function processRuntimeComment(comment) {
//     const typerawFlag = comment.tags.find((f) => f.title === 'typeraw');
//     const typesFormatted = typerawFlag
//         ? typerawFlag.text.replace(/\{(.*)\}/, '$1')
//         : comment.type.names.join(' | ');

//     if (!comment.type && !typerawFlag) {
//         throw new Error(`Missing @docs JSDoc tag: @type or @typeraw (${comment.longname})`);
//     }

//     return {
//         slug: githubSlug(comment.longname),
//         name: comment.longname,
//         body: comment.description && comment.description.trim(),
//         category: 'runtime',
//         version: comment.version,
//         deprecated: comment.deprecated,
//         seeAlsoLinks: [...(comment.see || []).join('\n').matchAll(/\[(.*?)\]\((.*?)\)/g)].map(m => ([m[1], m[2]])),
//         meta: {
//             type: typesFormatted,
//         },
//     }
// }

async function getRawSourceFile(fileContents) {
    // Get all `@docs` JSDoc comments in the file.
    const allComments = [
        ...fileContents.matchAll(/\/\*\*\s*\n([^\*]|\*[^\/])*@docs([^\*]|\*[^\/])*\*\//g),
    ];
    const allCommentsInput = allComments
        .map((m) => m[0])
        .filter((c) => c.includes('* @docs'))
        .join('\n\n');

    console.log(jsdoc);
    console.log(allCommentsInput);
    console.log(jsdoc.explainSync({ source: allCommentsInput }));

    const allParsedComments = jsdoc
        .explainSync({ source: allCommentsInput })
        .filter((data) => data.tags && data.tags.some((tag) => tag.title === 'docs'));


    return {
        data: undefined,
        jsdoc: allParsedComments,
    };
}

export function writeConfigurationPage(data) {
    fs.writeFileSync(
        `src/pages/en/reference/configuration/${data.slug}.mdx`,
        `---
# NOTE: This file is auto-generated from 'scripts/docgen.mjs'
# Do not make edits to it directly, they will be overwritten.
# Instead, change this file: https://github.com/withastro/astro/blob/main/packages/astro/src/%40types/astro.ts
# Translators, please remove this note and the <DontEditWarning/> component. 

layout: ~/layouts/MainLayout.astro
i18nReady: true
githubURL: https://github.com/withastro/astro/blob/main/packages/astro/src/%40types/astro.ts
title: ${data.name}
---

import Since from '../../../../components/Since.astro'
import DontEditWarning from '../../../../components/DontEditWarning.astro'

<DontEditWarning />

<p>
**Type:** \`${data.type}\`
${data.meta.flag ? `**CLI:** \`${data.meta.flag}\`` : ''}
${data.meta.defaultValue ? `**Default:** ${data.meta.defaultValue}` : ''}
${data.version ? `<Since v="${data.version}" />` : ''}
</p>

${data.description || ''}
${data.seeAlsoLinks.length > 1 ? `**See Also:**` : ''}
${data.seeAlsoLinks.map((s) => `- [${s[0]}](${s[1]})`).join('\n')}
`,
        'utf8'
    );
}