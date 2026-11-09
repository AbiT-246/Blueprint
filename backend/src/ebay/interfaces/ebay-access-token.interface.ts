export interface EbayOAuthTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface EbayAccessToken {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  expiresAt: number;
}
