import { MigrationInterface, QueryRunner } from "typeorm";

export class ProcessedEvents1785853050952 implements MigrationInterface {
    name = 'ProcessedEvents1785853050952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "processed_events" ("messageId" character varying(255) NOT NULL, "processedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_396a5b605b93ce9bec5bf73395c" PRIMARY KEY ("messageId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "processed_events"`);
    }

}
