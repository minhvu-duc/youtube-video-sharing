import bcrypt from "bcrypt";
import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  CreationOptional,
} from "sequelize";
import type DataType from "sequelize/types/data-types";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare password: string;
  declare name: string;
  declare updatedAt?: Date;
  declare createdAt?: Date;
}

export default (sequelize: Sequelize, DataTypes: typeof DataType) => {
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUIDV4,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        async beforeCreate(user) {
          user.password = await bcrypt.hash(user.password, 10);
        },
        async beforeUpdate(user) {
          user.password = await bcrypt.hash(user.password, 10);
        },
      },
      sequelize,
      modelName: "User",
    },
  );

  return User;
};
