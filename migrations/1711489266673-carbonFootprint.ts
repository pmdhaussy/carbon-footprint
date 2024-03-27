import { MigrationInterface, QueryRunner } from "typeorm";

export class CarbonFootprint1711489266673 implements MigrationInterface {
    name = 'CarbonFootprint1711489266673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carbon_footprint" ("id" SERIAL NOT NULL, "value" float NOT NULL, CONSTRAINT "PK_905c15ce8d098547599337b7669" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carbon_footprint_ingredient" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quantity" float NOT NULL, "unit" character varying NOT NULL, "footprintId" integer, CONSTRAINT "PK_56f3e500d08baa3e2fbbe0d7d51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "carbon_footprint_ingredient" ADD CONSTRAINT "FK_6d35ec279fa5d969aef6eeaa2e9" FOREIGN KEY ("footprintId") REFERENCES "carbon_footprint"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carbon_footprint_ingredient" DROP CONSTRAINT "FK_6d35ec279fa5d969aef6eeaa2e9"`);
        await queryRunner.query(`DROP TABLE "carbon_footprint_ingredient"`);
        await queryRunner.query(`DROP TABLE "carbon_footprint"`);
    }
}
