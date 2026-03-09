import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1770997119607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Enums
    await queryRunner.query(
      `CREATE TYPE "user_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'DELETED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "access_method_enum" AS ENUM('EMAIL', 'GOOGLE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "role_user_enum" AS ENUM('USER', 'ADMIN')`,
    );

    // Users Table
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR(255) NOT NULL DEFAULT '',
                "password" VARCHAR(255),
                "username" VARCHAR(255),
                "full_name" VARCHAR(255),
                "avatar" VARCHAR(255),
                "description" TEXT,
                "status" "user_status_enum" NOT NULL DEFAULT 'ACTIVE',
                "access_method" "access_method_enum" NOT NULL DEFAULT 'EMAIL',
                "google_id" VARCHAR(255),
                "role" "role_user_enum" NOT NULL DEFAULT 'USER',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP
            )
        `);

    // Indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_users_email" ON "users" ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "role_user_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "access_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_status_enum"`);
  }
}
