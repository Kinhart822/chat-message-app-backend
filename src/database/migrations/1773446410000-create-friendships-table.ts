import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFriendshipsTable1773446410000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create Friendship Status Enum
    await queryRunner.query(
      `CREATE TYPE "friendship_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED')`,
    );

    // 2. Create friendships table
    await queryRunner.query(`
      CREATE TABLE "friendships" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INT NOT NULL,
        "friend_id" INT NOT NULL,
        "status" "friendship_status_enum" NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "FK_friendships_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_friendships_friend" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // 3. Create Indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_friendships_user_id" ON "friendships" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_friendships_friend_id" ON "friendships" ("friend_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_friendships_pair" ON "friendships" ("user_id", "friend_id") WHERE "deleted_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "friendships"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "friendship_status_enum"`);
  }
}
