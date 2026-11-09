import { ConfigService } from '@nestjs/config';
import {
  EBAY_ENV_PRODUCTION,
  EBAY_ENV_SANDBOX,
  EBAY_PRODUCTION_API_BASE_URL,
  EBAY_SANDBOX_API_BASE_URL,
} from '../constants/ebay.constants';

export function getEbayApiBaseUrl(configService: ConfigService): string {
  const environment =
    configService.get<string>('EBAY_ENV') ?? EBAY_ENV_PRODUCTION;

  if (environment === EBAY_ENV_SANDBOX) {
    return EBAY_SANDBOX_API_BASE_URL;
  }

  return EBAY_PRODUCTION_API_BASE_URL;
}
