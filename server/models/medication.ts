"use strict";
const { Model } = require("sequelize");

type MedicationAttributes = {
  id: number;
  uid: string;
  medicationName: string;
  dateStarted: Date;
  expirationDate: Date;
  time: Date;
  dosage: number;
  unit: string;
  frequency: string;
  route: string;
  notes: string;
  image: string;

  // other attributes...
};

module.exports = (sequelize: any, DataTypes: any) => {
  class Medication
    extends Model<MedicationAttributes>
    implements MedicationAttributes
  {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    uid!: string;
    medicationName!: string;
    dateStarted!: Date;
    expirationDate!: Date;
    time!: Date;
    dosage!: number;
    unit!: string;
    frequency!: string;
    route!: string;
    notes!: string;
    image!: string;

    static associate(models: any) {
      Medication.belongsTo(models.User, {
        foreignKey: "uid",
        targetKey: "uid",
      });
      // define association here
    }
  }
  Medication.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      medicationName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateStarted: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      dosage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      route: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Medication",
      timestamps: false,
    }
  );
  return Medication;
};
