import { INestApplication, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { ApiKeyAuthGuard } from './common/guards/api-key-auth.guard';
import { ProgramsController } from './modules/programs/programs.controller';
import { ProgramsService } from './modules/programs/programs.service';
import { ReservationsController } from './modules/reservations/reservations.controller';
import { ReservationsService } from './modules/reservations/reservations.service';

@Module({
  controllers: [ProgramsController, ReservationsController],
  providers: [
    { provide: ProgramsService, useValue: {} },
    { provide: ReservationsService, useValue: {} },
    {
      provide: ConfigService,
      useValue: { get: jest.fn().mockReturnValue('test-api-key') },
    },
    { provide: APP_GUARD, useClass: ApiKeyAuthGuard },
  ],
})
class HttpEndpointsTestModule {}

describe('HTTP endpoint authentication', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpEndpointsTestModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it.each([
    ['get', '/programs/program-1/capacity'],
    ['post', '/programs/program-1/reservations'],
    ['post', '/reservations/invoice-1/release'],
  ] as const)(
    'rejects unauthenticated %s %s requests',
    async (method, path) => {
      await request(app.getHttpServer())[method](path).expect(401);
    },
  );
});
