import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  CreationOptional,
} from "sequelize";
import type DataType from "sequelize/types/data-types";

export class Video extends Model<
  InferAttributes<Video>,
  InferCreationAttributes<Video>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare url: string;
  declare title: string;
  declare description: string;
  declare updatedAt?: Date;
  declare createdAt?: Date;

  static associate(models: any) {
    Video.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "cascade",
    });
  }
}

export default (sequelize: Sequelize, DataTypes: typeof DataType) => {
  Video.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUIDV4,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      url: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isUrl: true,
        },
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(300),
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(2000),
      },
    },
    {
      sequelize,
      modelName: "Video",
    },
  );

  return Video;
};
