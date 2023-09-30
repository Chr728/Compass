'use strict';
import {
  Model
} from 'sequelize';

type SpeedDialAttributes = {
  id: number;
  uid: string;
  contactName: string;
  contactNumber: string;

  

  // other attributes...
};

module.exports = (sequelize:any, DataTypes:any) => {
  class SpeedDial extends Model<SpeedDialAttributes>
  implements SpeedDialAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    id!: number;
    uid!: string;
    contactName!: string;
    contactNumber!: string;

    static associate(models:any) {
      SpeedDial.belongsTo(models.User,{
        foreignKey: "uid",
        targetKey: 'uid',}
      )
      // define association here
    }
  }
  SpeedDial.init({
    id:{
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
    contactNumber:  {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
  }, {
    sequelize,
    modelName: 'SpeedDial',
    timestamps: false
  });
  return SpeedDial;
};