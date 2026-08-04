import { IsOptional, IsString, IsISO4217CurrencyCode } from 'class-validator';

export class GetCapacityQueryDto {
  @IsOptional()
  @IsString()
  @IsISO4217CurrencyCode({
    message: 'currency must be a valid ISO 4217 3-letter code (e.g., EUR, USD)',
  })
  readonly currency?: string;
}
