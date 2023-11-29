import {Logger} from '../middlewares/logger';
import {UserAttributes} from '../models/user';
import {SpeedDialAttributes} from '../models/speedDial';
import { AppointmentAttributes } from "../models/appointment";

const userValidator = (values : UserAttributes) => {
    const {email, firstName, lastName, phoneNumber} = values;
    //check if email is valid
    if(!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        Logger.error(`Invalid email: ${email}`);
        throw new Error(`Invalid email: ${email}`);
    }
    //check if first name is valid
    if(!firstName || /\d/.test(firstName) || typeof firstName !== 'string') {
        Logger.error(`Invalid first name: ${firstName}`);
        throw new Error(`Invalid first name: ${firstName}`);
    }
    //check if last name is valid
    if(!lastName || /\d/.test(lastName) || typeof lastName !== 'string') {
        Logger.error(`Invalid last name: ${lastName}`);
        throw new Error(`Invalid last name: ${lastName}`);
    }
    //check if phone number is valid
    if(!phoneNumber || typeof phoneNumber !== 'string' || !/^[0-9]{10}$/.test(phoneNumber)) {
        Logger.error(`Invalid phone number: ${phoneNumber}`);
        throw new Error(`Invalid phone number: ${phoneNumber}`);
    }
}


const appointmentValidator = (values: AppointmentAttributes) => {
  const { appointmentWith, reason, date, time, notes } = values;
  //Check if valid appointment
  if (
    !appointmentWith ||
    typeof appointmentWith !== "string" ||
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
  if (!reason || typeof reason !== "string") {
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

const speedDialValidator = (values: { contactName: string; contactNumber: string }) => {
    const {contactName, contactNumber} = values;
    //check if contact name is valid
    if(!contactName || /\d/.test(contactName) || typeof contactName !== 'string') {
        Logger.error(`Invalid contact name: ${contactName}`);
        throw new Error(`Invalid contact name: ${contactName}`);
    }
    //check if contact number is valid
    if(!contactNumber || typeof contactNumber !== 'string' || !/^[0-9]{10}$/.test(contactNumber)) {
        Logger.error(`Invalid contact number: ${contactNumber}`);
        throw new Error(`Invalid contact number: ${contactNumber}`);
    }

}

const notificationPreferenceValidator = (values: { activityReminders: boolean; medicationReminders: boolean; appointmentReminders: boolean; foodIntakeReminders: boolean; insulinDosageReminders: boolean; glucoseMeasurementReminders: boolean }) => {
    const {activityReminders, medicationReminders, appointmentReminders, foodIntakeReminders, insulinDosageReminders, glucoseMeasurementReminders} = values;
    //check if activityReminders is valid
    if(typeof activityReminders !== 'boolean') {
        Logger.error(`Invalid activityReminders: ${activityReminders}`);
        throw new Error(`Invalid activityReminders: ${activityReminders}`);
    }
    //check if medicationReminders is valid
    if(typeof medicationReminders !== 'boolean') {
        Logger.error(`Invalid medicationReminders: ${medicationReminders}`);
        throw new Error(`Invalid medicationReminders: ${medicationReminders}`);
    }
    //check if appointmentReminders is valid
    if(typeof appointmentReminders !== 'boolean') {
        Logger.error(`Invalid appointmentReminders: ${appointmentReminders}`);
        throw new Error(`Invalid appointmentReminders: ${appointmentReminders}`);
    }
    //check if foodIntakeReminders is valid
    if(typeof foodIntakeReminders !== 'boolean') {
        Logger.error(`Invalid foodIntakeReminders: ${foodIntakeReminders}`);
        throw new Error(`Invalid foodIntakeReminders: ${foodIntakeReminders}`);
    }
    //check if insulinDosageReminders is valid
    if(typeof insulinDosageReminders !== 'boolean') {
        Logger.error(`Invalid insulinDosageReminders: ${insulinDosageReminders}`);
        throw new Error(`Invalid insulinDosageReminders: ${insulinDosageReminders}`);
    }
    //check if glucoseMeasurementReminders is valid
    if(typeof glucoseMeasurementReminders !== 'boolean') {
        Logger.error(`Invalid glucoseMeasurementReminders: ${glucoseMeasurementReminders}`);
        throw new Error(`Invalid glucoseMeasurementReminders: ${glucoseMeasurementReminders}`);
    }
}



export {
  userValidator,
  speedDialValidator,
  appointmentValidator,
  notificationPreferenceValidator,


}

