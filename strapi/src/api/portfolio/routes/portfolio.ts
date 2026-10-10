/**
 * portfolio router
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::portfolio.portfolio', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
