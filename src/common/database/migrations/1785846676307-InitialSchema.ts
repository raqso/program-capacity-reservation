import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1785846676307 implements MigrationInterface {
    name = 'InitialSchema1785846676307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "programs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "totalCapacity" numeric(15,2) NOT NULL, "reservedCapacity" numeric(15,2) NOT NULL DEFAULT '0', "currency" character varying(3) NOT NULL, CONSTRAINT "PK_d43c664bcaafc0e8a06dfd34e05" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "programs"`);
    }

}
