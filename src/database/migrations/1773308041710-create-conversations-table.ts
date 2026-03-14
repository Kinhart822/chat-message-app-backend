import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateConversationsTable1773308041710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'conversations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['DIRECT', 'GROUP'],
            default: "'DIRECT'",
          },
          {
            name: 'owner_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'avatar_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
            default: "'ACTIVE'",
          },
          {
            name: 'last_message_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'last_message_seq',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'last_message_preview',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'last_message_type',
            type: 'enum',
            enum: ['TEXT', 'MEDIA', 'SYSTEM'],
            isNullable: true,
          },
          {
            name: 'last_message_sender_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'last_message_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('conversations');
  }
}
