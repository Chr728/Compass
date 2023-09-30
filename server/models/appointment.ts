'use strict';
import {
  Model
} from 'sequelize';

type AppointmentAttributes = {
  id: number;
  uid: string;
  appointmentWith: string;
  reason: string;
  date: Date;
  time: Date;
  notes: string
  

  // other attributes...
};

module.exports = (sequelize:any, DataTypes:any) => {

  class Appointment extends Model<AppointmentAttributes>
  implements AppointmentAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    uid!: string;
    appointmentWith!: string;
    reason!: string;
    date!: Date;
    time!: Date;
    notes!: string;

    static associate(models:any) {
      Appointment.belongsTo(models.User,{
        foreignKey: "uid",
        targetKey: 'uid',}
      )
      // define association here
    }
  }

  Appointment.init({
    id: {
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    appointmentWith: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },{
    sequelize,
    modelName: 'Appointment',
    timestamps: false
  });
  return Appointment;
};