"use strict";

import { Model } from "sequelize";

export interface O2SaturationJournalAttributes {
	id: number;
	uid: string;
	date: Date;
	time: Date;
	o2sat: number;
	pulse: number;
	activityLevel: string;
	notes: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
	class O2SaturationJournal extends Model<O2SaturationJournalAttributes> {
		id!: number;
		uid!: string;
		date!: Date;
		time!: Date;
		o2sat!: number;
		pulse!: number;
		activityLevel!: string;
		notes!: string;
		static associate(models: any) {
			O2SaturationJournal.belongsTo(models.User, {
				foreignKey: "uid",
				targetKey: "uid",
			});
		}
	}
	O2SaturationJournal.init(
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
			o2sat: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			pulse: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			activityLevel: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			notes: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "O2SaturationJournal",
		}
	);
	return O2SaturationJournal;
};
