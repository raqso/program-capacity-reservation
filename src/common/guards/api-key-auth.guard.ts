import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    const expectedApiKey = this.configService.get<string>('API_KEY');

    if (!apiKey || apiKey !== expectedApiKey) {
      throw new UnauthorizedException(
        'Invalid or missing API Key (X-API-KEY header required)',
      );
    }

    return true;
  }
}
