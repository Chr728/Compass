import { Logger } from '../middlewares/logger';
import { UserAttributes } from '../models/user';
import { SpeedDialAttributes } from '../models/speedDial';
import { AppointmentAttributes } from '../models/appointment';
import { O2SaturationJournalAttributes } from '../models/O2SaturationJournal';

const userValidator = (values: UserAttributes) => {
  const { email, firstName, lastName, phoneNumber } = values;
  //check if email is valid
  if (
    !email ||
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    Logger.error(`Invalid email: ${email}`);
    throw new Error(`Invalid email: ${email}`);
  }
  //check if first name is valid
  if (!firstName || /\d/.test(firstName) || typeof firstName !== 'string') {
    Logger.error(`Invalid first name: ${firstName}`);
    throw new Error(`Invalid first name: ${firstName}`);
  }
  //check if last name is valid
  if (!lastName || /\d/.test(lastName) || typeof lastName !== 'string') {
    Logger.error(`Invalid last name: ${lastName}`);
    throw new Error(`Invalid last name: ${lastName}`);
  }
  //check if phone number is valid
  if (
    !phoneNumber ||
    typeof phoneNumber !== 'string' ||
    !/^[0-9]{10}$/.test(phoneNumber)
  ) {
    Logger.error(`Invalid phone number: ${phoneNumber}`);
    throw new Error(`Invalid phone number: ${phoneNumber}`);
  }
};

const appointmentValidator = (values: AppointmentAttributes) => {
  const { appointmentWith, reason, date, time, notes } = values;
  //Check if valid appointment
  if (
    !appointmentWith ||
    typeof appointmentWith !== 'string' ||
    /\d/.test(appointmentWith)
  ) {
    Logger.error(
      `Invalid person to have appointment with': ${appointmentWith}`
    );
    throw new Error(
      `Invalid person to have appointment with': ${appointmentWith}`
    );
  }
  //Check if valid reason
  if (!reason || typeof reason !== 'string') {
    Logger.error(`Invalid reason: ${reason}`);
    throw new Error(`Invalid reason : ${reason}`);
  }
  //Check if valid time
  if (!time || time instanceof Date) {
    Logger.error(`Invalid Time: ${time}`);
    throw new Error(`Invalid Time : ${time}`);
  }
  //Check if valid date
  if (!date || date instanceof Date) {
    Logger.error(`Invalid Date: ${date}`);
    throw new Error(`Invalid Date : ${date}`);
  }
};

const speedDialValidator = (values: {
  contactName: string;
  contactNumber: string;
}) => {
  const { contactName, contactNumber } = values;
  //check if contact name is valid
  if (
    !contactName ||
    /\d/.test(contactName) ||
    typeof contactName !== 'string'
  ) {
    Logger.error(`Invalid contact name: ${contactName}`);
    throw new Error(`Invalid contact name: ${contactName}`);
  }
  //check if contact number is valid
  if (
    !contactNumber ||
    typeof contactNumber !== 'string' ||
    !/^[0-9]{10}$/.test(contactNumber)
  ) {
    Logger.error(`Invalid contact number: ${contactNumber}`);
    throw new Error(`Invalid contact number: ${contactNumber}`);
  }
};

const notificationPreferenceValidator = (values: {
  permissionGranted: boolean;
  activityReminders: boolean;
  medicationReminders: boolean;
  appointmentReminders: boolean;
  foodIntakeReminders: boolean;
  insulinDosageReminders: boolean;
  glucoseMeasurementReminders: boolean;
}) => {
  const {
    permissionGranted,
    activityReminders,
    medicationReminders,
    appointmentReminders,
    foodIntakeReminders,
    insulinDosageReminders,
    glucoseMeasurementReminders,
  } = values;

  // check if permissionGranted is valid
  if (typeof permissionGranted !== 'boolean') {
    Logger.error(`Invalid permissionGranted: ${permissionGranted}`);
    throw new Error(`Invalid permissionGranted: ${permissionGranted}`);
  }
  //check if activityReminders is valid
  if (typeof activityReminders !== 'boolean') {
    Logger.error(`Invalid activityReminders: ${activityReminders}`);
    throw new Error(`Invalid activityReminders: ${activityReminders}`);
  }
  //check if medicationReminders is valid
  if (typeof medicationReminders !== 'boolean') {
    Logger.error(`Invalid medicationReminders: ${medicationReminders}`);
    throw new Error(`Invalid medicationReminders: ${medicationReminders}`);
  }
  //check if appointmentReminders is valid
  if (typeof appointmentReminders !== 'boolean') {
    Logger.error(`Invalid appointmentReminders: ${appointmentReminders}`);
    throw new Error(`Invalid appointmentReminders: ${appointmentReminders}`);
  }
  //check if foodIntakeReminders is valid
  if (typeof foodIntakeReminders !== 'boolean') {
    Logger.error(`Invalid foodIntakeReminders: ${foodIntakeReminders}`);
    throw new Error(`Invalid foodIntakeReminders: ${foodIntakeReminders}`);
  }
  //check if insulinDosageReminders is valid
  if (typeof insulinDosageReminders !== 'boolean') {
    Logger.error(`Invalid insulinDosageReminders: ${insulinDosageReminders}`);
    throw new Error(
      `Invalid insulinDosageReminders: ${insulinDosageReminders}`
    );
  }
  //check if glucoseMeasurementReminders is valid
  if (typeof glucoseMeasurementReminders !== 'boolean') {
    Logger.error(
      `Invalid glucoseMeasurementReminders: ${glucoseMeasurementReminders}`
    );
    throw new Error(
      `Invalid glucoseMeasurementReminders: ${glucoseMeasurementReminders}`
    );
  }
};

const medicationValidator = (values: {
  medicationName: string;
  dateStarted: Date;
  time: Date;
  dosage: number;
  unit: string;
  frequency: string;
  route: string;
  notes: string;
}) => {
  const {
    medicationName,
    dateStarted,
    time,
    dosage,
    unit,
    frequency,
    route,
    notes,
  } = values;
  //check if medication name is valid
  if (
    !medicationName ||
    /\d/.test(medicationName) ||
    typeof medicationName !== 'string'
  ) {
    Logger.error(`Invalid medication name: ${medicationName}`);
    throw new Error(`Invalid medication name: ${medicationName}`);
  }
  //check if date started is valid
  if (!dateStarted || typeof dateStarted !== 'string') {
    Logger.error(`Invalid date started: ${dateStarted}`);
    throw new Error(`Invalid date started: ${dateStarted}`);
  }
  //check if time is valid
  if (!time || typeof time !== 'string') {
    Logger.error(`Invalid time: ${time}`);
    throw new Error(`Invalid time: ${time}`);
  }
  //check if dosage is valid
  if (!dosage || typeof dosage !== 'number') {
    Logger.error(`Invalid dosage: ${dosage}`);
    throw new Error(`Invalid dosage: ${dosage}`);
  }
  //check if unit is valid
  if (!unit || /\d/.test(unit) || typeof unit !== 'string') {
    Logger.error(`Invalid unit: ${unit}`);
    throw new Error(`Invalid unit: ${unit}`);
  }
  //check if frequency is valid
  if (!frequency || typeof frequency !== 'string') {
    Logger.error(`Invalid frequency: ${frequency}`);
    throw new Error(`Invalid frequency: ${frequency}`);
  }
  //check if route is valid
  if (!route || /\d/.test(route) || typeof route !== 'string') {
    Logger.error(`Invalid route: ${route}`);
    throw new Error(`Invalid route: ${route}`);
  }
  //check if notes is valid
  if (notes !== undefined && (/\d/.test(notes) || typeof notes !== 'string')) {
    Logger.error(`Invalid notes: ${notes}`);
    throw new Error(`Invalid notes: ${notes}`);
  }
};

interface stressSignals {
  [key: string]: string;
}

const moodJournalValidator = (values: {
  howAreYou: string;
  stressSignals: stressSignals;
  date: Date;
  notes: string;
  time: Date;
}) => {
  const { howAreYou, stressSignals, date, notes, time } = values;
  //check if howAreYou is valid
  if (!howAreYou || typeof howAreYou !== 'string') {
    Logger.error(`Invalid howAreYou: ${howAreYou}`);
    throw new Error(`Invalid howAreYou: ${howAreYou}`);
  }
  const requiredKeys = [
    'tired',
    'sleep',
    'hunger',
    'overeating',
    'depressed',
    'pressure',
    'anxiety',
    'attention',
    'anger',
    'headache',
  ];

  if (
    !stressSignals ||
    typeof stressSignals !== 'object' ||
    !requiredKeys.every((key) => key in stressSignals)
  ) {
    Logger.error(`Invalid stressSignals: ${JSON.stringify(stressSignals)}`);
    throw new Error(`Invalid stressSignals: ${JSON.stringify(stressSignals)}`);
  }
  //check if date is valid
  if (!date || typeof date !== 'string') {
    Logger.error(`Invalid date: ${date}`);
    throw new Error(`Invalid date: ${date}`);
  }
  //check if notes is valid
  if (notes !== undefined && (/\d/.test(notes) || typeof notes !== 'string')) {
    Logger.error(`Invalid notes: ${notes}`);
    throw new Error(`Invalid notes: ${notes}`);
  }
  //check if time is valid
  if (!time || typeof time !== "string") {
    Logger.error(`Invalid time: ${time}`);
    throw new Error(`Invalid time: ${time}`);
  }
};

const weightJournalValidator = (values: {
  date: Date;
  time: Date;
  weight: number;
  height: number;
  unit: string;
  notes: string;
}) => {
  const { date, time, weight, height, unit, notes } = values;
  //check if date is valid
  if (!date || typeof date !== 'string') {
    Logger.error(`Invalid date: ${date}`);
    throw new Error(`Invalid date: ${date}`);
  }
  //check if time is valid
  if (!time || typeof time !== 'string') {
    Logger.error(`Invalid time: ${time}`);
    throw new Error(`Invalid time: ${time}`);
  }
  //check if weight is valid
  if (!weight || typeof weight !== 'number') {
    Logger.error(`Invalid weight: ${weight}`);
    throw new Error(`Invalid weight: ${weight}`);
  }
  //check if height is valid
  if (!height || typeof height !== 'number') {
    Logger.error(`Invalid height: ${height}`);
    throw new Error(`Invalid height: ${height}`);
  }
  //check if unit is valid
  if (!unit || /\d/.test(unit) || typeof unit !== 'string') {
    Logger.error(`Invalid unit: ${unit}`);
    throw new Error(`Invalid unit: ${unit}`);
  }
  //check if notes is valid
  if (notes !== undefined && (/\d/.test(notes) || typeof notes !== 'string')) {
    Logger.error(`Invalid notes: ${notes}`);
    throw new Error(`Invalid notes: ${notes}`);
  }
};

const activityJournalValidator = (values: {
  date: Date;
  time: Date;
  activity: string;
  duration: number;
  notes: string;
}) => {
  const { date, time, activity, duration, notes } = values;
  //check if date is valid, should be string
  if (!date || typeof date !== 'string') {
    Logger.error(`Invalid Date: ${date}`);
    throw new Error(`Invalid Date : ${date}`);
  }

  //check if time is valid, should be string
  if (!time || typeof time !== 'string') {
    Logger.error(`Invalid time : ${time}`);
    throw new Error(`Invalid time  : ${time}`);
  }

  //check if activity is valid, should be string
  if (!activity || typeof activity !== 'string') {
    Logger.error(`Invalid activity: ${activity}`);
    throw new Error(`Invalid activity: ${activity}`);
  }

  //check if duration is valid, should be number
  if (!duration || typeof duration !== 'number') {
    Logger.error(`Invalid duration: ${duration}`);
    throw new Error(`Invalid duration: ${duration}`);
  }

  //check if notes is valid, should be string
  if (notes == undefined || typeof notes !== 'string') {
    Logger.error(`Invalid notes: ${notes}`);
    throw new Error(`Invalid notes: ${notes}`);
  }
};

const diabeticGlucoseJournalValidator = (values: {
  date: Date;
  mealTime: string;
  bloodGlucose: number;
  unit: string;
  notes: string;
}) => {
  const { date, mealTime, bloodGlucose, unit, notes } = values;
  //check if date is valid, should be date
  //check if date is valid, should be string
  if (!date || typeof date !== 'string') {
    Logger.error(`Invalid Date: ${date}`);
    throw new Error(`Invalid Date : ${date}`);
  }

  //check if mealTime is valid, should be string
  if (!mealTime || typeof mealTime !== 'string') {
    Logger.error(`Invalid mealTime: ${mealTime}`);
    throw new Error(`Invalid mealTime : ${mealTime}`);
  }

  //check if bloodGlucose is valid, should be number
  if (!bloodGlucose || typeof bloodGlucose !== 'number') {
    Logger.error(`Invalid bloodGlucose: ${bloodGlucose}`);
    throw new Error(`Invalid bloodGlucose: ${bloodGlucose}`);
  }

  //check if unit is valid, should be string
  if (!unit || typeof unit !== 'string') {
    Logger.error(`Invalid unit: ${unit}`);
    throw new Error(`Invalid unit: ${unit}`);
  }

  //check if notes is valid, should be string
  if (notes == undefined || typeof notes !== 'string') {
    Logger.error(`Invalid notes: ${notes}`);
    throw new Error(`Invalid notes: ${notes}`);
  }
};

const diabeticInsulinJournalValidator = (values: {
  date: Date;
  time: Date;
  typeOfInsulin: string;
  unit: number;
  bodySite: string;
  notes: string;
}) => {
  const { date, time, typeOfInsulin, unit, bodySite, notes } = values;
  //check if date is valid, should be string
  if (!date || typeof date !== 'string') {
    Logger.error(`Invalid Date: ${date}`);
    throw new Error(`Invalid Date : ${date}`);
  }

  //check if time is valid, should be string
  if (!time || typeof time !== 'string') {
    Logger.error(`Invalid time : ${time}`);
    throw new Error(`Invalid time  : ${time}`);
  }

  //check if typeOfInsulin is valid, should be string
  if (!typeOfInsulin || typeof typeOfInsulin !== 'string') {
    Logger.error(`Invalid typeOfInsulin: ${typeOfInsulin}`);
    throw new Error(`Invalid typeOfInsulin: ${typeOfInsulin}`);
  }

  //check if bodySite is valid, should be string
  if (!bodySite || typeof bodySite !== 'string') {
    Logger.error(`Invalid bodySite: ${bodySite}`);
    throw new Error(`Invalid bodySite: ${bodySite}`);
  }

  //check if unit is valid, should be number
  if (!unit || typeof unit !== 'number') {
    Logger.error(`Invalid unit: ${unit}`);
    throw new Error(`Invalid unit: ${unit}`);
  }

  //check if notes is valid, should be string
  if (notes == undefined || typeof notes !== 'string') {
    Logger.error(`Invalid notes: ${notes}`);
    throw new Error(`Invalid notes: ${notes}`);
  }
};

const foodIntakeJournalValidator = (values: {
  date: Date;
  time: Date;
  foodName: string;
  mealType: string;
  servingNumber: number;
  notes: string;
  calorie : number;
}) => {
  const { date, time, foodName, mealType, servingNumber, notes, calorie } = values;
  //check if date is valid, should be string
  if (!date || typeof date !== 'string') {
    Logger.error(`Invalid Date: ${date}`);
    throw new Error(`Invalid Date : ${date}`);
  }

  //check if time is valid, should be string
  if (!time || typeof time !== 'string') {
    Logger.error(`Invalid time : ${time}`);
    throw new Error(`Invalid time  : ${time}`);
  }

  //check if foodName is valid, should be string
  if (!foodName || typeof foodName !== 'string') {
    Logger.error(`Invalid foodName: ${foodName}`);
    throw new Error(`Invalid foodName: ${foodName}`);
  }

  //check if mealType is valid, should be string
  if (!mealType || typeof mealType !== 'string') {
    Logger.error(`Invalid mealType: ${mealType}`);
    throw new Error(`Invalid mealType: ${mealType}`);
  }

  //check if unit is valid, should be number
  if (!servingNumber || typeof servingNumber !== 'number') {
    Logger.error(`Invalid servingNumber: ${servingNumber}`);
    throw new Error(`Invalid servingNumber: ${servingNumber}`);
  }

  //check if notes is valid, should be string
  if (notes == undefined || typeof notes !== 'string') {
    Logger.error(`Invalid notes: ${notes}`);
    throw new Error(`Invalid notes: ${notes}`);
  }

  //check if calorie is valid, should be integer
  if (calorie !== null && typeof calorie !== "number") {
    Logger.error(`Invalid calorie: ${calorie}`);
    throw new Error(`Invalid calorie: ${calorie}`);
  }
};

const o2SaturationJournalValidator = (
  values: O2SaturationJournalAttributes
) => {
  const { date, time, o2sat, pulse, activityLevel, notes } = values;
  //check if date is valid
  if (!date || typeof date !== 'string') {
    Logger.error(`Invalid Date: ${date}`);
    throw new Error(`Invalid Date : ${date}`);
  }

  //check if time is valid
  if (!time || typeof time !== 'string') {
    Logger.error(`Invalid time : ${time}`);
    throw new Error(`Invalid time  : ${time}`);
  }

  //check if o2sat is valid
  if (!o2sat || typeof o2sat !== 'number') {
    Logger.error(`Invalid o2sat: ${o2sat}`);
    throw new Error(`Invalid o2sat: ${o2sat}`);
  }

  //check if pulse is valid
  if (!pulse || typeof pulse !== 'number') {
    Logger.error(`Invalid pulse: ${pulse}`);
    throw new Error(`Invalid pulse: ${pulse}`);
  }

  //check if activityLevel is valid
  if (!activityLevel || typeof activityLevel !== 'string') {
    Logger.error(`Invalid activityLevel: ${activityLevel}`);
    throw new Error(`Invalid activityLevel: ${activityLevel}`);
  }

  //check if notes is valid
  if (notes == undefined || typeof notes !== 'string') {
    Logger.error(`Invalid notes: ${notes}`);
    throw new Error(`Invalid notes: ${notes}`);
  }

};

export {
  userValidator,
  speedDialValidator,
  appointmentValidator,
  notificationPreferenceValidator,
  medicationValidator,
  moodJournalValidator,
  weightJournalValidator,
  activityJournalValidator,
  diabeticGlucoseJournalValidator,
  diabeticInsulinJournalValidator,
  foodIntakeJournalValidator,
  o2SaturationJournalValidator,
};
