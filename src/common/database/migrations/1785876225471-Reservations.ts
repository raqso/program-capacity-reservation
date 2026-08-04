import { MigrationInterface, QueryRunner } from "typeorm";

export class Reservations1785876225471 implements MigrationInterface {
    name = 'Reservations1785876225471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."reservations_status_enum" AS ENUM('ACTIVE', 'RELEASED')`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "programId" uuid NOT NULL, "invoiceId" character varying(128) NOT NULL, "originalAmount" numeric(15,2) NOT NULL, "originalCurrency" character varying(3) NOT NULL, "reservedAmountInProgramCurrency" numeric(15,2) NOT NULL, "status" "public"."reservations_status_enum" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "UQ_a8729840b3a12196d6eef30134b" UNIQUE ("invoiceId"), CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5b214457974ce4ddefec827d99" ON "reservations"  ("programId") `);
        await queryRunner.query(`CREATE INDEX "idx_reservations_program_active" ON "reservations"  ("programId", "reservedAmountInProgramCurrency") WHERE "status" = 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_reservations_program_active"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b214457974ce4ddefec827d99"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`DROP TYPE "public"."reservations_status_enum"`);
    }

}
