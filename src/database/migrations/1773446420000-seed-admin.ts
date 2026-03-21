import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAdmin1773446420000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const admins = [
      {
        email: 'admin1@test.com',
        username: 'admin1',
        password:
          '$2b$12$AJqVquRsJ.3US0QxrBDN.OHYcbKUm1nGD5V6OLk89KvXAAUfyPsRPq', // Admin@123
        status: 'ACTIVE',
        access_method: 'EMAIL',
        role: 'ADMIN',
      },
      {
        email: 'admin2@test.com',
        username: 'admin2',
        password:
          '$2b$12$AJqVquRsJ.3US0QxrBDN.OHYcbKUm1nGD5V6OLk89KvXAAUfyPsRPq',
        status: 'ACTIVE',
        access_method: 'EMAIL',
        role: 'ADMIN',
      },
      {
        email: 'admin3@test.com',
        username: 'admin3',
        password:
          '$2b$12$AJqVquRsJ.3US0QxrBDN.OHYcbKUm1nGD5V6OLk89KvXAAUfyPsRPq',
        status: 'ACTIVE',
        access_method: 'EMAIL',
        role: 'ADMIN',
      },
      {
        email: 'admin4@test.com',
        username: 'admin4',
        password:
          '$2b$12$AJqVquRsJ.3US0QxrBDN.OHYcbKUm1nGD5V6OLk89KvXAAUfyPsRPq',
        status: 'ACTIVE',
        access_method: 'EMAIL',
        role: 'ADMIN',
      },
      {
        email: 'admin5@test.com',
        username: 'admin5',
        password:
          '$2b$12$AJqVquRsJ.3US0QxrBDN.OHYcbKUm1nGD5V6OLk89KvXAAUfyPsRPq',
        status: 'ACTIVE',
        access_method: 'EMAIL',
        role: 'ADMIN',
      },
    ];

    for (const admin of admins) {
      await queryRunner.query(
        `INSERT INTO "users" ("email", "username", "password", "status", "access_method", "role") 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          admin.email,
          admin.username,
          admin.password,
          admin.status,
          admin.access_method,
          admin.role,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "users" WHERE "email" IN ('admin1@test.com', 'admin2@test.com', 'admin3@test.com', 'admin4@test.com', 'admin5@test.com')`,
    );
  }
}
