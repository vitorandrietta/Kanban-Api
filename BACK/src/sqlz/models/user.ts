import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Model, UUIDV4 } from "sequelize";

const DEFAULT_ENCRYPTION_ROUNDS = 10;
const TOKEN_EXPIRATION_TIME = "1h";

export interface IUserAttributes {
  id: string;
  name: string;
  password_hash: string;
  email: string;
  login: string;
  password?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<IUserAttributes> {
    name!: string;
    id!: string;
    password_hash!: string;
    password?: string;

    static associate(_: unknown) {
      // define association here
    }

    public async validPassword(): Promise<boolean> {
      return !!(
        this.password &&
        (await bcrypt.compare(this.password, this.password_hash))
      );
    }

    /**TODO create refresh token */
    public generateToken() {
      return jwt.sign({}, process.env.JWT_SECRET as string, {
        expiresIn: TOKEN_EXPIRATION_TIME,
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.VIRTUAL,
      },
    },
    {
      sequelize,
      modelName: "users",
      hooks: {
        beforeSave: async (user) => {
          if (!!user.password) {
            user.password_hash = await bcrypt.hash(
              user.password,
              DEFAULT_ENCRYPTION_ROUNDS
            );
          }
        },
      },
    }
  );
  return User;
};
