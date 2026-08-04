import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsISO4217CurrencyCode,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty({ message: 'invoiceId cannot be empty' })
  readonly invoiceId: string;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'amount must be a number with max 2 decimal places' },
  )
  @IsPositive({ message: 'amount must be greater than zero' })
  readonly amount: number;

  @IsString()
  @IsISO4217CurrencyCode({
    message: 'currency must be a valid ISO 4217 3-letter code (e.g., EUR, USD)',
  })
  readonly currency: string;
}
