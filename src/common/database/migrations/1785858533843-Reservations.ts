import { MigrationInterface, QueryRunner } from "typeorm";

export class Reservations1785858533843 implements MigrationInterface {
    name = 'Reservations1785858533843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "programs" DROP COLUMN "reservedCapacity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "programs" ADD "reservedCapacity" numeric(15,2) NOT NULL DEFAULT '0'`);
    }

}
