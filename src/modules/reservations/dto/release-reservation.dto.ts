import { IsOptional, IsString } from 'class-validator';

export class ReleaseReservationDto {
  @IsOptional()
  @IsString()
  readonly repaymentReference?: string;
}
