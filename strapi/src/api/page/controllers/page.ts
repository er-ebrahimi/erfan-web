// src/api/page/controllers/page.ts
import { factories } from '@strapi/strapi';

function ensureFaqPopulate(populate: unknown): Record<string, any> {
    if (!populate || typeof populate !== 'object') {
        return {
            dynamic_zone: {
                on: {
                    'dynamic-zone.faq': {
                        populate: { faqs: true },
                    },
                },
            },
        };
    }

    const merged: Record<string, any> = { ...populate };
    const dz = merged.dynamic_zone && typeof merged.dynamic_zone === 'object' ? { ...merged.dynamic_zone } : {};
    const on = dz.on && typeof dz.on === 'object' ? { ...dz.on } : {};
    const faqBranch =
        on['dynamic-zone.faq'] && typeof on['dynamic-zone.faq'] === 'object' ? { ...on['dynamic-zone.faq'] } : {};
    const faqPopulate =
        faqBranch.populate && typeof faqBranch.populate === 'object' ? { ...faqBranch.populate } : {};

    faqBranch.populate = { ...faqPopulate, faqs: true };
    on['dynamic-zone.faq'] = faqBranch;
    dz.on = on;
    merged.dynamic_zone = dz;

    return merged;
}

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
    async find(ctx) {
        const contentType = strapi.contentType('api::page.page');

        // sanitizeQuery does two things: coerces raw query-string values ("true" -> true,
        // "5" -> 5, etc.) AND strips anything the requesting role isn't allowed to query.
        // Skipping it (like my last version did) is exactly what broke metaImage and
        // every other populate branch that relied on those coerced values.
        const sanitizedQueryParams = await (this as any).sanitizeQuery(ctx);

        const documents = await strapi.documents('api::page.page').findMany({
            ...sanitizedQueryParams,
            status: 'published',
            populate: ensureFaqPopulate(sanitizedQueryParams.populate),
        });

        const sanitized = await strapi.contentAPI.sanitize.output(documents, contentType, {
            auth: ctx.state.auth,
        });

        return { data: sanitized, meta: {} };
    },
}));