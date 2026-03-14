import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateParticipantsTable1773308045000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'participants',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'conversation_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['OWNER', 'MEMBER'],
            default: "'MEMBER'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'ACTIVE',
              'ARCHIVED',
              'LEFT',
              'REMOVED',
              'BLOCKED',
              'DELETED',
            ],
            default: "'ACTIVE'",
          },
          {
            name: 'unread_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'last_read_seq',
            type: 'bigint',
            isNullable: true,
            default: 0,
          },
          {
            name: 'mute_until',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'is_pinned',
            type: 'boolean',
            default: false,
          },
          {
            name: 'joined_at',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'left_at',
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
            columnNames: ['conversation_id', 'user_id'],
            isUnique: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('participants', [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['conversation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'conversations',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('participants');
    const foreignKeys = table?.foreignKeys || [];
    await queryRunner.dropForeignKeys('participants', foreignKeys);
    await queryRunner.dropTable('participants');
  }
}
