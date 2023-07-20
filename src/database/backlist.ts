import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import DataType from "sequelize/types/data-types";

export class Blacklist extends Model<
  InferAttributes<Blacklist>,
  InferCreationAttributes<Blacklist>
> {
  declare id: CreationOptional<string>;
  declare token: string;
  declare updatedAt?: Date;
  declare createdAt?: Date;
}

export default (sequelize: Sequelize, DataTypes: typeof DataType) => {
  Blacklist.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      token: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Blacklist",
    },
  );
  return Blacklist;
};
