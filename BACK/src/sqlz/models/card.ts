import { Model } from "sequelize";

enum cardState {
  "TODO" = "TODO",
  "INPROGRESS" = "INPROGRESS",
  "DONE" = "DONE",
}

export interface ICardsAttributes {
  id: number;
  title: string;
  content: string;
  state: cardState;
  user_id: number;
  updated_at: Date;
  created_at: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
module.exports = (sequelize: any, DataTypes: any) => {
  class Card extends Model<ICardsAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_: unknown) {
      // define association here
    }
  }
  Card.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM(Object.values(cardState)),
        defaultValue: cardState.TODO,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "cards",
    }
  );
  return Card;
};
