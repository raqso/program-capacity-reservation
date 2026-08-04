import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultProgram1785846817831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO programs (
        id,
        "totalCapacity",
        "reservedCapacity",
        currency,
        "createdAt",
        "updatedAt"
      )
      VALUES (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        10000000.00,
        0.00,
        'USD',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM programs WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    `);
  }
}
