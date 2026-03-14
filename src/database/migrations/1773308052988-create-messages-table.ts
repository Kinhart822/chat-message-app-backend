import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMessagesTable1773308052988 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'messages',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'conversation_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sender_participant_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sequence',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['TEXT', 'MEDIA', 'SYSTEM'],
            default: "'TEXT'",
          },
          {
            name: 'reply_to_message_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['SENT', 'FAILED', 'DELETED'],
            default: "'SENT'",
          },
          {
            name: 'is_edited',
            type: 'boolean',
            default: false,
          },
          {
            name: 'edited_at',
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
        indices: [
          {
            columnNames: ['conversation_id', 'sequence'],
            isUnique: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('messages', [
      new TableForeignKey({
        columnNames: ['conversation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'conversations',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['sender_participant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'participants',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['reply_to_message_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'messages',
        onDelete: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('messages');
    const foreignKeys = table.foreignKeys || [];
    await queryRunner.dropForeignKeys('messages', foreignKeys);
    await queryRunner.dropTable('messages');
  }
}
