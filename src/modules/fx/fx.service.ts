import { Injectable, BadRequestException } from '@nestjs/common';

type AVAILABLE_CURRENCIES = ['USD', 'EUR', 'GBP', 'PLN', 'CHF', 'CAD'];
type Currency = AVAILABLE_CURRENCIES[number];

@Injectable()
export class FxService {
  private readonly ratesToUsdBase: Record<Currency, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.78,
    PLN: 3.95,
    CHF: 0.88,
    CAD: 1.36,
  };

  async convert(amount: number, fromCurrency: string, toCurrency: string) {
    const from = fromCurrency.toUpperCase() as Currency;
    const to = toCurrency.toUpperCase() as Currency;

    if (from === to) {
      return amount;
    }

    const fromRate = this.ratesToUsdBase[from];
    const toRate = this.ratesToUsdBase[to];

    if (!fromRate) {
      throw new BadRequestException(`Unsupported source currency: ${from}`);
    }

    if (!toRate) {
      throw new BadRequestException(`Unsupported target currency: ${to}`);
    }

    const amountInUsd = amount / fromRate;
    const convertedAmount = amountInUsd * toRate;

    return Math.round(convertedAmount * 100) / 100;
  }
}
