import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table(
  { tableName: 'files' }
)

export class FileModel extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: 'name',
  })
  name: string;

  @AllowNull(false)
  @Column({
    field: 'url',
    type: DataType.STRING,
  })
  url: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    field: 'storage_url',
  })
  storage_url: string | null;
}
