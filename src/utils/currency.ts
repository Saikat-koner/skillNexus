import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRateFromUSD: 1.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRateFromUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRateFromUSD: 0.79 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRateFromUSD: 83.5 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', exchangeRateFromUSD: 1.36 },
  USDC: { code: 'USDC', symbol: 'USDC', name: 'USD Coin (Crypto)', exchangeRateFromUSD: 1.0 },
};

export const convertFromUSD = (amountInUSD: number, currency: CurrencyCode): number => {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  return Math.round(amountInUSD * config.exchangeRateFromUSD);
};

export const formatPrice = (amountInUSD: number, currency: CurrencyCode = 'USD'): string => {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const converted = convertFromUSD(amountInUSD, currency);

  if (currency === 'USDC') {
    return `${converted} USDC`;
  }
  return `${config.symbol}${converted.toLocaleString()}`;
};
