import {  Model } from 'sequelize';

export interface BloodPressureJournalAttributes {
  id: number;
  uid: string;
  date: Date;
  time: Date;
  systolic: number;
  diastolic: number;
  pulse: number;
  notes: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class BloodPressureJournal extends Model<BloodPressureJournalAttributes> {
    id!: number;
    uid!: string;
    date!: Date;
    time!: Date;
    systolic!: number;
    diastolic!: number;
    pulse!: number;
    notes!: string;
    static associate(models: any) {
      BloodPressureJournal.belongsTo(models.User, {
        foreignKey: 'uid',
        targetKey: 'uid',
      });
    }
  }
  BloodPressureJournal.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uid: {
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
      systolic: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      diastolic: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pulse: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'BloodPressureJournal',
    }
  );
  return BloodPressureJournal;
};

