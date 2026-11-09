import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EBAY_BROWSE_API_SCOPE,
  EBAY_OAUTH_TOKEN_PATH,
  EBAY_TOKEN_EXPIRY_BUFFER_MS,
} from './constants/ebay.constants';
import {
  EbayAccessToken,
  EbayOAuthTokenResponse,
} from './interfaces/ebay-access-token.interface';
import { getEbayApiBaseUrl } from './utils/ebay-api-base-url.util';

@Injectable()
export class EbayAuthService {
  private readonly logger = new Logger(EbayAuthService.name);
  private cachedToken: EbayAccessToken | null = null;

  constructor(private readonly configService: ConfigService) {}

  async getAccessToken(): Promise<EbayAccessToken> {
    if (this.cachedToken && this.isTokenUnexpired(this.cachedToken)) {
      return this.cachedToken;
    }

    const token = await this.requestAccessToken();
    this.cachedToken = token;
    return token;
  }

  private isTokenUnexpired(token: EbayAccessToken): boolean {
    return Date.now() < token.expiresAt - EBAY_TOKEN_EXPIRY_BUFFER_MS;
  }

  private async requestAccessToken(): Promise<EbayAccessToken> {
    const clientId = this.configService.getOrThrow<string>('EBAY_CLIENT_ID');
    const clientSecret = this.configService.getOrThrow<string>(
      'EBAY_CLIENT_SECRET',
    );
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: EBAY_BROWSE_API_SCOPE,
    });
    const tokenUrl = `${getEbayApiBaseUrl(this.configService)}${EBAY_OAUTH_TOKEN_PATH}`;

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `eBay OAuth token request failed with status ${response.status}: ${errorBody}`,
        );
        throw new BadGatewayException(
          'Unable to fetch an eBay application access token.',
        );
      }

      const payload = (await response.json()) as EbayOAuthTokenResponse;
      return this.toAccessToken(payload);
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      this.logger.error('eBay OAuth token request failed', error);
      throw new ServiceUnavailableException(
        'Unable to reach the eBay OAuth token endpoint.',
      );
    }
  }

  private toAccessToken(payload: EbayOAuthTokenResponse): EbayAccessToken {
    const issuedAt = Date.now();

    return {
      accessToken: payload.access_token,
      expiresIn: payload.expires_in,
      tokenType: payload.token_type,
      expiresAt: issuedAt + payload.expires_in * 1000,
    };
  }
}
