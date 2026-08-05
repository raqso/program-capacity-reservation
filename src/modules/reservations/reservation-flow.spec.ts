import { INestApplication, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';

import { ApiKeyAuthGuard } from '../../common/guards/api-key-auth.guard';
import { FxService } from '../fx/fx.service';
import { ProgramEntity } from '../programs/programs.entity';
import { ProgramsController } from '../programs/programs.controller';
import { ProgramsService } from '../programs/programs.service';
import { ReservationEntity, ReservationStatus } from './reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

const programId = 'program-1';
const apiKey = 'test-api-key';
let reservations: ReservationEntity[] = [];

const program = {
  id: programId,
  totalCapacity: 1_000,
  currency: 'EUR',
} as ProgramEntity;

const programRepository = {
  findOne: jest.fn(async () => program),
};

const reservationRepository = {
  sum: jest.fn(
    async (
      _field: string,
      where: { programId: string; status: ReservationStatus },
    ) =>
      reservations
        .filter(
          (reservation) =>
            reservation.programId === where.programId &&
            reservation.status === where.status,
        )
        .reduce(
          (total, reservation) =>
            total + reservation.reservedAmountInProgramCurrency,
          0,
        ),
  ),
};

const transactionManager = {
  findOne: jest.fn(
    async (
      entity: typeof ProgramEntity | typeof ReservationEntity,
      options: { where: { id?: string; invoiceId?: string } },
    ) => {
      if (entity === ProgramEntity) {
        return options.where.id === programId ? program : null;
      }

      return (
        reservations.find(
          (reservation) => reservation.invoiceId === options.where.invoiceId,
        ) ?? null
      );
    },
  ),
  sum: reservationRepository.sum,
  create: jest.fn(
    (_entity: typeof ReservationEntity, values: Partial<ReservationEntity>) =>
      values as ReservationEntity,
  ),
  save: jest.fn(
    async (
      _entity: typeof ReservationEntity,
      reservation: ReservationEntity,
    ) => {
      if (!reservations.includes(reservation)) {
        reservations.push(reservation);
      }

      return reservation;
    },
  ),
};

@Module({
  controllers: [ProgramsController, ReservationsController],
  providers: [
    ProgramsService,
    ReservationsService,
    FxService,
    { provide: getRepositoryToken(ProgramEntity), useValue: programRepository },
    {
      provide: getRepositoryToken(ReservationEntity),
      useValue: reservationRepository,
    },
    {
      provide: DataSource,
      useValue: {
        transaction: async (
          work: (manager: typeof transactionManager) => Promise<unknown>,
        ) => work(transactionManager),
      },
    },
    { provide: ConfigService, useValue: { get: () => apiKey } },
    { provide: APP_GUARD, useClass: ApiKeyAuthGuard },
  ],
})
class ReservationFlowTestModule {}

describe('reservation capacity flow', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ReservationFlowTestModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    reservations = [];
    program.totalCapacity = 1_000;
  });

  it('updates available capacity after reservations are created and released', async () => {
    const initialCapacity = await request(app.getHttpServer())
      .get(`/programs/${programId}/capacity`)
      .set('X-API-KEY', apiKey)
      .expect(200);
    expect(initialCapacity.body.capacity.available).toBe(1_000);

    await request(app.getHttpServer())
      .post(`/programs/${programId}/reservations`)
      .set('X-API-KEY', apiKey)
      .send({ invoiceId: 'invoice-1', amount: 200, currency: 'EUR' })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/programs/${programId}/reservations`)
      .set('X-API-KEY', apiKey)
      .send({ invoiceId: 'invoice-2', amount: 300, currency: 'EUR' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/reservations/invoice-1/release')
      .set('X-API-KEY', apiKey)
      .expect(200);

    const finalCapacity = await request(app.getHttpServer())
      .get(`/programs/${programId}/capacity`)
      .set('X-API-KEY', apiKey)
      .expect(200);

    expect(finalCapacity.body.capacity.available).toBe(700);
  });

  it('returns an exact available capacity after decimal reservations are released', async () => {
    program.totalCapacity = 1;

    for (let invoiceNumber = 1; invoiceNumber <= 10; invoiceNumber += 1) {
      await request(app.getHttpServer())
        .post(`/programs/${programId}/reservations`)
        .set('X-API-KEY', apiKey)
        .send({
          invoiceId: `decimal-invoice-${invoiceNumber}`,
          amount: 0.1,
          currency: 'EUR',
        })
        .expect(201);
    }

    await request(app.getHttpServer())
      .post('/reservations/decimal-invoice-1/release')
      .set('X-API-KEY', apiKey)
      .expect(200);

    const capacity = await request(app.getHttpServer())
      .get(`/programs/${programId}/capacity`)
      .set('X-API-KEY', apiKey)
      .expect(200);

    expect(capacity.body.capacity.available).toBe(0.1);
  });
});
