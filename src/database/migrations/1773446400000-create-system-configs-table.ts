import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSystemConfigsTable1773446400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "system_configs" (
        "id" SERIAL PRIMARY KEY,
        "key" VARCHAR(255) UNIQUE NOT NULL,
        "value" TEXT NOT NULL,
        "description" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP
      )
    `);

    // Seed initial data for MAX_NON_FRIEND_MESSAGES
    await queryRunner.query(`
      INSERT INTO "system_configs" ("key", "value", "description") 
      VALUES ('MAX_NON_FRIEND_MESSAGES', '5', 'Maximum messages a user can send to a non-friend in a DIRECT conversation.'),
      ('MAX_FRIEND_REQUESTS_PER_DAY', '20', 'Maximum number of friend requests a user can send per day.')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "system_configs"`);
  }
}
