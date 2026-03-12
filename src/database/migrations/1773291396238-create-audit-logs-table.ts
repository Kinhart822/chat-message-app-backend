import { AuditLogStatus } from '@constants/audit.constant';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAuditLogsTable1773291396238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."audit_log_status_enum" AS ENUM (${Object.values(
        AuditLogStatus,
      )
        .map((v) => `'${v}'`)
        .join(', ')})`,
    );
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            isUnique: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'endpoint',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'timestamp',
            type: 'bigint',
            isNullable: false,
            default: 'EXTRACT(EPOCH FROM now())::bigint',
          },
          {
            name: 'ip_address',
            type: 'varchar',
            length: '15', // IPv4
            isNullable: true,
          },
          {
            name: 'device_info',
            type: 'jsonb',
            isNullable: false,
            default: `'{}'`,
          },
          {
            name: 'geolocation',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'audit_log_status_enum',
            isNullable: false,
          },
          {
            name: 'note',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'details',
            type: 'jsonb',
            isNullable: false,
            default: `'{}'`,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_logs');
    await queryRunner.query(`DROP TYPE "public"."audit_log_status_enum"`);
  }
}
