export const EBAY_PRODUCTION_API_BASE_URL = 'https://api.ebay.com';
export const EBAY_SANDBOX_API_BASE_URL = 'https://api.sandbox.ebay.com';

export const EBAY_OAUTH_TOKEN_PATH = '/identity/v1/oauth2/token';
export const EBAY_ITEM_SUMMARY_SEARCH_PATH = '/buy/browse/v1/item_summary/search';

export const EBAY_BROWSE_API_SCOPE =
  'https://api.ebay.com/oauth/api_scope';

export const EBAY_DEFAULT_MARKETPLACE_ID = 'EBAY_US';
export const EBAY_DEFAULT_SEARCH_LIMIT = 20;

/** Refresh the cached token this many ms before eBay's stated expiry. */
export const EBAY_TOKEN_EXPIRY_BUFFER_MS = 60_000;

export const EBAY_ENV_PRODUCTION = 'production';
export const EBAY_ENV_SANDBOX = 'sandbox';
