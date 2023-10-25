'use strict';
import {
  Model
} from 'sequelize';

export type SubscriptionAttributes = {
  id: number;
  uid: string;
  subscription: any;

  

  // other attributes...
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Subscription extends Model<SubscriptionAttributes>
  implements SubscriptionAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    id!: number;
    uid!: string;
    subscription!: any;

    static associate(models:any) {
        Subscription.belongsTo(models.User,{
        foreignKey: "uid",
        targetKey: 'uid',}
      )
      // define association here
    }
  }
  Subscription.init({
    id:{
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    subscription: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Subscription',
    timestamps: false
  });
  return Subscription;
};